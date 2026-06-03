import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { AnthropicService } from "../ai/anthropic.service";
import { ConfigService } from "../config/config.service";
import { buildFlightSearchParams } from "../integrations/flights/flight-intent";
import type { FlightsChatPayload } from "../integrations/flights/flight.types";
import { FlightsService } from "../integrations/flights/flights.service";
import type {
  ChatIntentType,
  ChatMessage,
  ChatRequest,
  ChatResponse,
} from "./chat.types";
import { classifyChatIntentType } from "./chat-intent";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly anthropic: AnthropicService,
    private readonly flightsService: FlightsService,
    private readonly config: ConfigService,
  ) {}

  async createReply(body: ChatRequest) {
    const messages = this.normalizeMessages(body.messages);

    if (!messages.some((message) => message.role === "user")) {
      throw new BadRequestException(
        "Send at least one user message to start the conversation.",
      );
    }

    const classified = classifyChatIntentType(messages);
    this.logger.log(
      `Chat intent: ${classified.intent} (${classified.confidence}) — ${classified.reason}`,
    );

    if (classified.intent === "out_of_scope") {
      return {
        reply: this.outOfScopeReply(),
        intent: classified.intent,
      } satisfies ChatResponse;
    }

    let flightsPayload: FlightsChatPayload | null = null;

    if (classified.intent === "flight_search") {
      flightsPayload = await this.runFlightSearch(messages);
    }

    const maxTokens = this.resolveMaxTokens(
      classified.intent,
      Boolean(flightsPayload),
    );
    const temperature = this.resolveTemperature(classified.intent);

    const { text: reply } = await this.anthropic.complete({
      max_tokens: maxTokens,
      temperature,
      system: this.buildSystemPrompt(
        classified.intent,
        Boolean(flightsPayload),
      ),
      messages,
    });

    const finalReply =
      reply ||
      this.fallbackReply(classified.intent, messages, Boolean(flightsPayload));

    const responseBody: ChatResponse = {
      reply: finalReply,
      intent: classified.intent,
    };

    if (flightsPayload) {
      flightsPayload.intro = flightsPayload.availabilityNote
        ? `${finalReply}\n\n${flightsPayload.availabilityNote}`
        : finalReply;
      responseBody.flights = flightsPayload;
    }

    return responseBody;
  }

  private outOfScopeReply() {
    return [
      "I can only help with travel topics (flights, itineraries, hotels/stays, restaurants, tours, visas, safety, routes, and local tips).",
      "",
      "Tell me your destination + dates, or ask for flights like: DEL to DXB on 2026-06-10.",
    ].join("\n");
  }

  private async runFlightSearch(
    messages: ChatMessage[],
  ): Promise<FlightsChatPayload | null> {
    console.log(
      "Just before buildFlightSearchParams....------------> ",
      messages,
    );

    const params = await buildFlightSearchParams(messages, this.anthropic);
    console.log("After buildFlightSearchParams....------------> ", params);

    if (!params) {
      this.logger.warn(
        "Flight intent but missing origin/destination — ask user in reply.",
      );
      return null;
    }

    this.logger.log(
      `Executing flight API: ${params.origin} → ${params.destination}, month ${params.departMonth}${params.departDate ? `, day ${params.departDate}` : ""}`,
    );

    try {
      const result = await this.flightsService.search(params);
      if (!result.payload) {
        this.logger.warn(
          `Flight API returned no results for ${params.origin}→${params.destination}`,
        );
      }
      return result.payload;
    } catch (error) {
      this.logger.warn(
        `Flight API failed: ${error instanceof Error ? error.message : error}`,
      );
      return null;
    }
  }

  private buildSystemPrompt(intent: ChatIntentType, hasLiveFlights: boolean) {
    switch (intent) {
      case "flight_search":
        return this.buildFlightPrompt(hasLiveFlights);
      case "hotel_search":
        return this.buildHotelPrompt();
      case "itinerary":
        return this.buildItineraryPrompt();
      case "restaurants_bars":
        return this.buildRestaurantsBarsPrompt();
      case "travel_safety":
        return this.buildTravelSafetyPrompt();
      case "checklist":
        return this.buildChecklistPrompt();
      case "place_info":
        return this.buildPlaceInfoPrompt();
      case "trip_plan":
        return this.buildTripPlanPrompt();
      case "estimated_routes_to_visit":
        return this.buildEstimatedRoutesPrompt();
      case "out_of_scope":
        return this.buildBriefPrompt();
      default:
        return this.buildBriefPrompt();
    }
  }

  private resolveTemperature(intent: ChatIntentType) {
    if (intent === "itinerary") return 0.65;
    if (intent === "checklist") return 0.55;
    return 0.5;
  }

  private resolveMaxTokens(intent: ChatIntentType, hasFlights: boolean) {
    const { keys } = this.config;
    switch (intent) {
      case "itinerary":
        return this.anthropic.tokenLimit(keys.ANTHROPIC_MAX_TOKENS, 2048);
      case "checklist":
        return this.anthropic.tokenLimit(
          keys.ANTHROPIC_MAX_TOKENS_CHECKLIST,
          900,
        );
      case "flight_search":
        return hasFlights
          ? this.anthropic.tokenLimit(keys.ANTHROPIC_MAX_TOKENS_FLIGHT, 200)
          : this.anthropic.tokenLimit(keys.ANTHROPIC_MAX_TOKENS_BRIEF, 350);
      case "hotel_search":
      case "trip_plan":
        return this.anthropic.tokenLimit(keys.ANTHROPIC_MAX_TOKENS, 1200);
      case "place_info":
        return this.anthropic.tokenLimit(keys.ANTHROPIC_MAX_TOKENS_BRIEF, 600);
      default:
        return this.anthropic.tokenLimit(keys.ANTHROPIC_MAX_TOKENS_BRIEF, 400);
    }
  }

  private fallbackReply(
    intent: ChatIntentType,
    messages: ChatMessage[],
    hasFlights: boolean,
  ) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const text = lastUser?.content.toLowerCase() ?? "";

    if (intent === "flight_search" && hasFlights) {
      return "Here are live flight options for your route.";
    }

    if (intent === "flight_search") {
      return "Share your origin and destination (e.g. JAI to DEL) and travel date — I’ll pull live flight prices for you.";
    }

    if (/^(hi|hello|hey|hola|namaste|howdy)\b/.test(text)) {
      return [
        "Hey! I’m your travel genius — flights, hotels, itineraries, and local tips.",
        "",
        "Tell me where you want to go, or ask for flights with route and date (e.g. Jaipur to Delhi, 5 July).",
      ].join("\n");
    }

    return "Tell me your destination, dates, or what you need — flights, hotels, a full itinerary, or tips about a place.";
  }

  private buildFlightPrompt(hasLiveResults: boolean) {
    const lines = [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, and simple. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: FLIGHT SEARCH / BOOKING",
      "The platform runs a live flight search API from the user's message (origin, destination, date).",
    ];

    if (hasLiveResults) {
      lines.push(
        "Live flight options are shown in cards below your message — do NOT list flights, times, or prices in text.",
        "Write only 1–2 short sentences as an intro (e.g. Economy options for their route).",
        "Keep under 40 words. No bullet lists or markdown headings.",
        "NEVER say you cannot access live flight data or send users to Google Flights.",
      );
    } else {
      lines.push(
        "No live flight cards were returned by our flight search for the user's exact request (route/date).",
        "Do NOT say you lack live access. We DO have a flight search API; it just returned no rows for that exact date.",
        "Do NOT ask irrelevant follow-ups (e.g. different Bangkok airports) unless the user asked that explicitly.",
        "In 1–2 short sentences: say you couldn't find live fares for that exact date yet.",
        "Then ask ONE question: are they flexible by +/- a few days or another month?",
        "Keep under 60 words. No invented prices or flight times.",
      );
    }

    return lines.join("\n");
  }

  private buildHotelPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, and simple. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: HOTEL / STAY SEARCH",
      "Help with where to stay, areas to book, and what to look for in hotels.",
      "Live hotel price cards are not wired yet — do NOT invent nightly rates or availability.",
      "Ask for: city/area, check-in & check-out dates, budget, and number of guests.",
      "Give 3–5 practical tips or area suggestions in 80–120 words. Plain paragraphs or short bullets.",
    ].join("\n");
  }

  private buildPlaceInfoPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, and simple. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: PLACE / DESTINATION INFORMATION",
      "User wants info about a place — attractions, food, culture, weather, safety, etc.",
      "NOT a full day-by-day itinerary unless they ask to plan the whole trip.",
      "Use Markdown: short ### sections and bullets. 120–200 words.",
      "Be specific with real place names when you know them. No invented prices.",
    ].join("\n");
  }

  private buildRestaurantsBarsPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, and simple. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: RESTAURANTS + BARS",
      "Recommend places to eat/drink with a mix of price points and vibes.",
      "Ask 1–2 quick questions only if needed (city/area, budget, dietary, vibe).",
      "Use Markdown with short ### sections and bullets. 120–200 words.",
      "Do NOT invent live availability. Do not claim you booked anything.",
    ].join("\n");
  }

  private buildTravelSafetyPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, calm, and practical. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: TRAVEL SAFETY",
      "Give practical safety guidance: common scams, areas/times to be careful, transport safety, emergency basics.",
      "Avoid medical or legal advice; suggest official sources when needed.",
      "Use Markdown with ### headings and bullets. 140–220 words.",
      "End with one clarifying question (destination + traveler type).",
    ].join("\n");
  }

  private buildEstimatedRoutesPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, and clear. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: MOST DIRECT ROUTES / HOW TO GET THERE",
      "Explain best route options (flight/train/bus/car) and approximate time ranges.",
      "If you are unsure, give ranges and ask for start/end points and dates.",
      "Use Markdown with ### headings and bullets. 120–200 words.",
      "Do not invent exact timetables or prices.",
    ].join("\n");
  }

  private buildTripPlanPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, and simple. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: TRIP PLANNING (overview, not full day-by-day)",
      "Give a helpful trip overview: best time to visit, how many days, main areas, transport between cities, vibe.",
      "Do NOT write Day 1 / Day 2 unless they asked for a detailed itinerary.",
      "150–250 words. Markdown with ### sections is OK.",
      "If they need flights, mention they can ask with route + date for live prices in the app.",
    ].join("\n");
  }

  private buildBriefPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, and simple. Never mention AI, models, or systems.",
      "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
      "",
      "MODE: GENERAL TRAVEL CHAT",
      "",
      "Help the user choose what they need:",
      "- Flights: live prices when they give route + date (e.g. Jaipur to Delhi, 5 July)",
      "- Hotels: areas and tips (live hotel search coming soon)",
      "- Full itinerary: day-by-day plan",
      "- Place info: things to do, food, culture in a destination",
      "",
      "GREETINGS: Warm 2–3 sentences, invite them to pick flights, hotels, or planning.",
      "OTHER: 40–80 words, plain paragraphs. One closing question.",
      "Do not invent prices or bookings.",
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
      "MODE: DETAILED ITINERARY (day-by-day schedule)",
      "Give a complete, practical plan they can follow.",
      "",
      "OPENING (2–3 sentences): Echo trip details and sound excited.",
      "",
      "DAILY SECTIONS — for each day:",
      "### Day N: [Title]",
      "- Times, real place names, 📍 before notable stops, meals, downtime.",
      "",
      "CLOSING: One sentence on vibe + one follow-up question.",
      "Rough length: 250–450 words for a multi-day trip.",
      "FACTS: No invented live prices or booking confirmations.",
    ].join("\n");
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
