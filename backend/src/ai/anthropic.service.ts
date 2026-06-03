import Anthropic from "@anthropic-ai/sdk";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "../config/config.service";

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

    this.client = new Anthropic({ apiKey });
  }

  async complete(options: AnthropicCompleteOptions) {
    const response = await this.client.messages.create({
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
