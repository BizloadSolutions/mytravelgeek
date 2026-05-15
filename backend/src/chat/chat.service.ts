import Anthropic from "@anthropic-ai/sdk";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import type { ChatMessage, ChatRequest } from "./chat.types";

type AnthropicTextBlock = {
  type?: string;
  text?: string;
};

@Injectable()
export class ChatService {
  private readonly client: Anthropic;

  constructor() {
    const apiKey =
      process.env.SECRET ?? process.env.ANTHROPIC_API_KEY ?? process.env.KEY;

    if (!apiKey) {
      throw new InternalServerErrorException(
        "Missing Anthropic API key in SECRET."
      );
    }

    this.client = new Anthropic({ apiKey });
  }

  async createReply(body: ChatRequest) {
    const messages = this.normalizeMessages(body.messages);

    if (!messages.some((message) => message.role === "user")) {
      throw new BadRequestException(
        "Send at least one user message to start the conversation."
      );
    }

    const response = await this.client.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: this.buildSystemPrompt(),
      messages: messages as Array<{ role: "user" | "assistant"; content: string }>,
    });

    const reply = this.extractText(response.content as AnthropicTextBlock[]);

    return {
      reply: reply || "I’m ready to help with the next step of your trip.",
    };
  }

  private buildSystemPrompt() {
    return [
      "You are Travel Geek, a friendly human-sounding travel advisor.",
      "Write naturally and conversationally in simple, easy-to-understand English, as if you are helping a person one-on-one.",
      "Never mention being an AI, assistant, agent, model, prompt, system, or backend.",
      "Keep all responses highly concise, optimized, and brief. Get straight to the point and avoid fluff, filler words, or lengthy explanations.",
      "Do not remove important context or meaning, just deliver it efficiently.",
      "Answer the user's request directly and match the requested detail level.",
      "Format your responses using Markdown. Organize the response into well-categorized sections with clear structure and good readability.",
      "Use headings (e.g. ###) for important headlines so they stand out.",
      "Whenever you include key information, specific names, or special terms, wrap them in double quotes (e.g. \"Eiffel Tower\") so the UI can highlight them.",
      "Include anchor tags or Markdown links `[Link Text](url)` when providing URLs or referring to resources.",
      "For trip plans and itineraries, provide a complete, structured response with a short intro, day-by-day sections, morning/afternoon/evening breakdowns when helpful, hotel suggestions, food suggestions, and a closing note.",
      "Do not use live availability, pricing claims, or booking confirmations unless the user has provided that data.",
      "Help with custom itineraries, trip planning, destination ideas, budgets, transit, packing, and comparing hotel or flight options that the user provides.",
      "Ask one brief follow-up question when important details are missing."
    ].join(" ");
  }

  private extractText(content: AnthropicTextBlock[]) {
    return content
      .filter((block) => block.type === "text" && typeof block.text === "string")
      .map((block) => block.text ?? "")
      .join("")
      .trim();
  }

  private normalizeMessages(messages: unknown): ChatMessage[] {
    if (!Array.isArray(messages)) {
      return [];
    }

    return messages
      .filter((message): message is ChatMessage => {
        if (typeof message !== "object" || message === null) {
          return false;
        }

        const candidate = message as Partial<ChatMessage>;
        return (
          (candidate.role === "user" || candidate.role === "assistant") &&
          typeof candidate.content === "string" &&
          candidate.content.trim().length > 0
        );
      })
      .map((message) => ({
        role: message.role,
        content: message.content.trim(),
      }));
  }
}
