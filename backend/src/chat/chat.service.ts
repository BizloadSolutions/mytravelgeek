import Anthropic from "@anthropic-ai/sdk";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import {
  buildFlightSearchParams,
  isFlightSearchRequest,
} from "../integrations/flights/flight-intent";
import type { FlightsChatPayload } from "../integrations/flights/flight.types";
import { ConfigService } from "../config/config.service";
import { FlightsService } from "../integrations/flights/flights.service";
import type { ChatMessage, ChatRequest, ChatResponse } from "./chat.types";

type AnthropicTextBlock = {
  type?: string;
  text?: string;
};

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly client: Anthropic;

  constructor(
    private readonly flightsService: FlightsService,
    private readonly config: ConfigService,
  ) {
    const apiKey = this.config.keys.SECRET;

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
    const flightMode =
      !itineraryMode && !checklistMode && isFlightSearchRequest(messages);

    let flightsPayload: FlightsChatPayload | null = null;

    if (flightMode) {
      const params = buildFlightSearchParams(messages);
      if (params) {
        this.logger.log(
          `Flight search: ${params.origin} → ${params.destination}, month ${params.departMonth}${params.departDate ? `, day ${params.departDate}` : ""}`,
        );
        try {
          const result = await this.flightsService.search(params);
          flightsPayload = result.payload;
          if (!flightsPayload) {
            this.logger.warn(
              `Flight search returned no results for ${params.origin}→${params.destination}`,
            );
          }
        } catch (error) {
          this.logger.warn(
            `Flight search failed: ${error instanceof Error ? error.message : error}`,
          );
        }
      } else {
        this.logger.warn(
          "Flight mode active but could not parse origin/destination from messages.",
        );
      }
    }

    const maxTokens = this.resolveMaxTokens({
      itineraryMode,
      checklistMode,
      flightMode,
      hasFlights: Boolean(flightsPayload),
    });

    const response = await this.client.messages.create({
      model: this.config.keys.ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      temperature: itineraryMode ? 0.65 : checklistMode ? 0.55 : 0.5,
      system: itineraryMode
        ? this.buildItineraryPrompt()
        : checklistMode
          ? this.buildChecklistPrompt()
          : flightMode
            ? this.buildFlightPrompt(Boolean(flightsPayload))
            : this.buildBriefPrompt(),
      messages: messages as Array<{
        role: "user" | "assistant";
        content: string;
      }>,
    });

    const reply = this.extractText(response.content as AnthropicTextBlock[]);

    if (!reply) {
      this.logger.warn(
        `Empty model reply (stop=${response.stop_reason}, model=${this.config.keys.ANTHROPIC_MODEL})`,
      );
    }

    const finalReply =
      reply ||
      (flightMode && flightsPayload
        ? `Here are live flight options for your route.`
        : flightMode
          ? `I couldn’t find live prices for that month yet — try a specific month (e.g. June 2026) or airport codes like JAI to DEL.`
          : this.fallbackReply(messages));

    const responseBody: ChatResponse = { reply: finalReply };

    if (flightsPayload) {
      flightsPayload.intro = finalReply;
      responseBody.flights = flightsPayload;
    }

    return responseBody;
  }

  private buildFlightPrompt(hasLiveResults: boolean) {
    const lines = [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, and simple. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: FLIGHT SEARCH",
    ];

    if (hasLiveResults) {
      lines.push(
        "Live flight options are shown in cards below your message — do NOT list flights, times, or prices in text.",
        "Write only 1–2 short sentences as an intro (e.g. that you found Economy options for their route).",
        "Keep under 40 words. No bullet lists or markdown headings.",
        "NEVER say you cannot access live flight data, Google Flights, or external booking sites.",
      );
    } else {
      lines.push(
        "Live price cards could not be loaded for this search. Ask for origin and destination as airport codes (e.g. DEL to BKK) and a month if needed.",
        "Do NOT claim you cannot access flight data in general. Do NOT send users to Google Flights or other sites.",
        "Keep under 60 words. No invented prices or flight times.",
      );
    }

    return lines.join("\n");
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
      /packing|pack(ing)? tips|what to pack|pack kya|packign|packin/.test(
        text,
      ) ||
      /list|checklist|items|things to carry|puri list|detail|detailed|full list/.test(
        text,
      )
    );
  }

  private resolveMaxTokens({
    itineraryMode,
    checklistMode,
    flightMode,
    hasFlights,
  }: {
    itineraryMode: boolean;
    checklistMode: boolean;
    flightMode: boolean;
    hasFlights: boolean;
  }) {
    const { keys } = this.config;
    if (itineraryMode) return this.tokenLimit(keys.ANTHROPIC_MAX_TOKENS, 2048);
    if (checklistMode)
      return this.tokenLimit(keys.ANTHROPIC_MAX_TOKENS_CHECKLIST, 900);
    if (flightMode && hasFlights)
      return this.tokenLimit(keys.ANTHROPIC_MAX_TOKENS_FLIGHT, 200);
    return this.tokenLimit(keys.ANTHROPIC_MAX_TOKENS_BRIEF, 400);
  }

  private tokenLimit(raw: string, fallback: number) {
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }

  private fallbackReply(messages: ChatMessage[]) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const text = lastUser?.content.toLowerCase() ?? "";

    if (/^(hi|hello|hey|hola|namaste|howdy)\b/.test(text)) {
      return [
        "Hey! Great to meet you — I'm your travel genius for trips, flights, hotels, food, and local tips.",
        "",
        "Tell me where you want to go or tap Flights / Hotels above. What should we plan first?",
      ].join("\n");
    }

    return "Hey! Tell me your destination, dates, or what you need — flights, hotels, or a full itinerary — and I’ll help.";
  }

  private buildBriefPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, and simple. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: BRIEF (general questions, tips, what can I ask, comparisons, single recommendations).",
      "",
      "GREETINGS (hi, hello, hey): Reply warmly in 2–3 short sentences. Invite them to ask about trips, flights, or hotels. Do not use a generic one-liner.",
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
      "FLIGHTS: If the user asks for flights, tell them to include route (e.g. DEL to BKK) — the app shows live options in cards when the search runs.",
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
