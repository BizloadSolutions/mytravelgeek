import Anthropic from "@anthropic-ai/sdk";
import type {
  Message,
  MessageCreateParamsNonStreaming,
} from "@anthropic-ai/sdk/resources/messages/messages";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "../config/config.service";

const TRANSIENT_ANTHROPIC_RETRIES = 3;
const TRANSIENT_RETRY_BASE_MS = 600;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientAnthropicError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const code = (error as NodeJS.ErrnoException).code;
  if (code === "ERR_STREAM_PREMATURE_CLOSE" || code === "ECONNRESET") {
    return true;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("premature close") ||
    message.includes("socket hang up") ||
    message.includes("fetch failed") ||
    message.includes("network")
  );
}

type AnthropicTextBlock = {
  type?: string;
  text?: string;
};

export type AnthropicChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AnthropicCompleteOptions = {
  system?: string;
  messages: AnthropicChatMessage[];
  max_tokens: number;
  temperature?: number;
};

@Injectable()
export class AnthropicService {
  private readonly logger = new Logger(AnthropicService.name);
  readonly client: Anthropic;
  readonly model: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.keys.SECRET;
    if (!apiKey) {
      throw new InternalServerErrorException(
        "Missing Anthropic API key in SECRET.",
      );
    }

    this.model = this.config.keys.ANTHROPIC_MODEL;
    if (!this.model) {
      throw new InternalServerErrorException(
        "Missing Anthropic model in ANTHROPIC_MODEL.",
      );
    }

    // Prefer Node's native fetch on Railway/production — the SDK's default
    // node-fetch + keep-alive path is prone to ERR_STREAM_PREMATURE_CLOSE
    // when the remote side closes a reused connection mid-body.
    const clientOptions: ConstructorParameters<typeof Anthropic>[0] = {
      apiKey,
      maxRetries: 2,
      timeout: 120_000,
    };
    if (typeof globalThis.fetch === "function") {
      clientOptions.fetch = globalThis.fetch.bind(
        globalThis,
      ) as unknown as NonNullable<
        ConstructorParameters<typeof Anthropic>[0]
      >["fetch"];
    }
    this.client = new Anthropic(clientOptions);
  }

  async complete(options: AnthropicCompleteOptions) {
    const response = await this.createMessageWithRetry({
      model: this.model,
      max_tokens: options.max_tokens,
      temperature: options.temperature ?? 0.5,
      system: options.system,
      messages: options.messages,
    });

    const text = this.extractText(response.content as AnthropicTextBlock[]);
    if (!text) {
      this.logger.warn(
        `Empty model reply (stop=${response.stop_reason}, model=${this.model})`,
      );
    }

    return { text, stopReason: response.stop_reason, response };
  }

  private async createMessageWithRetry(
    params: MessageCreateParamsNonStreaming,
  ): Promise<Message> {
    let lastError: unknown;

    for (let attempt = 0; attempt < TRANSIENT_ANTHROPIC_RETRIES; attempt++) {
      try {
        return await this.client.messages.create(params);
      } catch (error) {
        lastError = error;
        const canRetry =
          attempt < TRANSIENT_ANTHROPIC_RETRIES - 1 &&
          isTransientAnthropicError(error);

        if (!canRetry) break;

        const delayMs = TRANSIENT_RETRY_BASE_MS * 2 ** attempt;
        this.logger.warn(
          `Anthropic request failed (${(error as Error).message}); retrying in ${delayMs}ms (${attempt + 1}/${TRANSIENT_ANTHROPIC_RETRIES - 1})`,
        );
        await sleep(delayMs);
      }
    }

    this.logger.error(
      `Anthropic request failed after ${TRANSIENT_ANTHROPIC_RETRIES} attempts`,
      lastError instanceof Error ? lastError.stack : String(lastError),
    );
    throw new ServiceUnavailableException(
      "The AI service is temporarily unavailable. Please try again in a moment.",
    );
  }

  extractText(content: AnthropicTextBlock[]) {
    return content
      .filter(
        (block) => block.type === "text" && typeof block.text === "string",
      )
      .map((block) => block.text ?? "")
      .join("")
      .trim();
  }

  tokenLimit(raw: string, fallback: number) {
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }
}
