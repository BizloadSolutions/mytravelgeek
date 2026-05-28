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
    const apiKey = process.env.SECRET;

    if (!apiKey) {
      throw new InternalServerErrorException(
        "Missing Anthropic API key in SECRET.",
      );
    }

    this.client = new Anthropic({ apiKey });
  }

  async createReply(body: ChatRequest) {
    const messages = this.normalizeMessages(body.messages);

    if (!messages.some((message) => message.role === "user")) {
      throw new BadRequestException(
        "Send at least one user message to start the conversation.",
      );
    }

    const itineraryMode = this.isItineraryRequest(messages);
    const checklistMode = !itineraryMode && this.isChecklistRequest(messages);

    const response = await this.client.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
      max_tokens: this.resolveMaxTokens({ itineraryMode, checklistMode }),
      temperature: itineraryMode ? 0.65 : checklistMode ? 0.55 : 0.5,
      system: itineraryMode
        ? this.buildItineraryPrompt()
        : checklistMode
          ? this.buildChecklistPrompt()
          : this.buildBriefPrompt(),
      messages: messages as Array<{
        role: "user" | "assistant";
        content: string;
      }>,
    });

    const reply = this.extractText(response.content as AnthropicTextBlock[]);

    return {
      reply: reply || "I’m ready to help with the next step of your trip.",
    };
  }

  private isItineraryRequest(messages: ChatMessage[]) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const text = lastUser?.content.toLowerCase() ?? "";

    return (
      /itinerar|itenar|itinerary|trip plan|plan me|plan a\b|plan our|plan the/.test(
        text,
      ) ||
      /road trip|day[- ]?by[- ]?day|full plan|custom plan/.test(text) ||
      /(\d+)\s*days?\s+(trip|in|to|from)/.test(text) ||
      (/jaipur|udaipur|from .+ to .+|to udaipur|to jaipur/.test(text) &&
        /plan|trip|itinerar|itenar|going|group|friends/.test(text))
    );
  }

  private isChecklistRequest(messages: ChatMessage[]) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const text = lastUser?.content.toLowerCase() ?? "";

    // User explicitly wants "detailed list" / "puri list" / checklist-style output
    return (
      /packing|pack(ing)? tips|what to pack|pack kya|packign|packin/.test(text) ||
      /list|checklist|items|things to carry|puri list|detail|detailed|full list/.test(
        text,
      )
    );
  }

  private resolveMaxTokens({
    itineraryMode,
    checklistMode,
  }: {
    itineraryMode: boolean;
    checklistMode: boolean;
  }) {
    if (itineraryMode) return Number(process.env.ANTHROPIC_MAX_TOKENS ?? 2048);
    if (checklistMode)
      return Number(process.env.ANTHROPIC_MAX_TOKENS_CHECKLIST ?? 900);
    return Number(process.env.ANTHROPIC_MAX_TOKENS_BRIEF ?? 400);
  }

  private buildBriefPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, and simple. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: BRIEF (general questions, tips, what can I ask, comparisons, single recommendations).",
      "",
      "LENGTH:",
      "- 40–70 words total. Never exceed 80 words.",
      "- Each line max 12 words. No filler or repetition.",
      "",
      "STRUCTURE:",
      "1) One-line intro.",
      "2) Exactly 3–4 short paragraphs (blank line between). Use: I can help you… / You can ask for… / I can suggest…",
      "3) One short closing question with two options.",
      "",
      "FORMAT: Plain paragraphs only. No headings, emoji, or bullet lists.",
      "",
      "CONTEXT: Use full chat. Personalize when known. Do not invent destinations on meta questions.",
      "",
      "FACTS: No invented prices, availability, or bookings.",
    ].join("\n");
  }

  private buildChecklistPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, and practical. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: DETAILED CHECKLIST (packing lists, step-by-step lists, 'puri list', 'detailed').",
      "Do NOT use the brief 40–70 word format. Provide a complete, organized checklist the user can follow.",
      "",
      "OUTPUT RULES:",
      "- Use simple Markdown with short section headings (###) and bullet lists (- ).",
      "- Keep items actionable, not generic. Avoid long paragraphs.",
      "- If trip length is known (e.g. 7 days) size the list accordingly.",
      "- If climate is uncertain, give two variants (mild vs very cold) but keep it concise.",
      "",
      "PACKING LIST TEMPLATE (when asked for packing):",
      "### Clothes (7 days)",
      "- ...",
      "### Footwear",
      "- ...",
      "### Essentials",
      "- ...",
      "### Toiletries",
      "- ...",
      "### Medicines",
      "- ...",
      "### Documents & money",
      "- ...",
      "### Tech",
      "- ...",
      "### Couple extras (nice-to-have)",
      "- ...",
      "",
      "CLOSING:",
      "- End with 1 short question to customize (e.g. 'Snow expect kar rahe ho ya normal thand?').",
      "",
      "FACTS: No invented prices, availability, or bookings.",
    ].join("\n");
  }

  private buildItineraryPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound enthusiastic, human, and helpful — like a friend who knows the route well. Never mention AI or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: DETAILED ITINERARY (user asked to plan a trip, route, or day-by-day schedule).",
      "Do NOT use the brief 40–70 word format. Give a complete, practical plan they can follow.",
      "",
      "OPENING (2–3 sentences):",
      "- Echo their trip details (route, group size, dates/timing, vibe) and sound excited.",
      "- One line introducing the plan (e.g. well-paced X-day itinerary balancing sightseeing and relaxation).",
      "",
      "DAILY SECTIONS — for each day use Markdown:",
      "### Day N: [Title] ([drive time or theme if relevant])",
      "",
      "Under each day, 4–6 bullet points (- ) with:",
      "- Specific times when helpful (e.g. Leave around 6 AM).",
      "- Real place names: landmarks, restaurants, viewpoints.",
      "- Prefix notable stops with 📍 before the place name (e.g. 📍 City Palace).",
      "- Midway stops on drives, sunset spots, group-friendly meals.",
      "- Mix culture, food, scenery, and downtime for groups.",
      "",
      "INFER TRIP LENGTH:",
      "- Road trips (e.g. Jaipur → Udaipur): default 3–4 days unless they specify otherwise.",
      "- City weekends: 2–3 days. Match their dates if given.",
      "",
      "CLOSING:",
      "- One sentence on the overall vibe of the trip.",
      "- One follow-up question (hotels, villas, restaurants, or tweaking the plan).",
      "",
      "QUALITY:",
      "- Use the full conversation. Respect group size (e.g. 10 friends → group-friendly spots, villas).",
      "- Be specific and actionable, not vague one-liners.",
      "- Rough length: 250–450 words for a multi-day trip.",
      "",
      "FACTS: No invented live prices or booking confirmations. Real place names are fine.",
    ].join("\n");
  }

  private extractText(content: AnthropicTextBlock[]) {
    return content
      .filter(
        (block) => block.type === "text" && typeof block.text === "string",
      )
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
