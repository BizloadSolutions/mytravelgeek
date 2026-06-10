import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { AnthropicService } from "../ai/anthropic.service";
import { ConfigService } from "../config/config.service";
import { buildFlightSearchParams } from "../integrations/flights/flight-intent";
import type { FlightsChatPayload } from "../integrations/flights/flight.types";
import { FlightsService } from "../integrations/flights/flights.service";
import type { FlightSearchParams } from "../integrations/flights/flight.types";
import {
  buildTravelLinks,
  resolveTravelServices,
  TRAVEL_ASSISTANT_RULES,
  type TravelLink,
} from "../helper/travel-affiliates";
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
    const lastUserText = classified.lastUserText;
    const travelServices = resolveTravelServices(
      lastUserText,
      classified.intent,
    );
    this.logger.log(
      `Chat intent: ${classified.intent} (${classified.confidence}) — ${classified.reason}`,
    );
    if (travelServices.length) {
      this.logger.debug(`Travel services: ${travelServices.join(", ")}`);
    }

    if (classified.intent === "out_of_scope") {
      return {
        reply: this.outOfScopeReply(),
        intent: classified.intent,
      } satisfies ChatResponse;
    }

    let flightsPayload: FlightsChatPayload | null = null;
    let flightSearchParams: FlightSearchParams | null = null;

    if (classified.intent === "flight_search") {
      this.logger.debug("Attempting flight search...");
      const searchResult = await this.runFlightSearch(messages);
      flightsPayload = searchResult.payload;
      flightSearchParams = searchResult.params;
      if (flightsPayload?.flights?.length) {
        this.logger.log(
          `✅ Flights found: ${flightsPayload.flights.length} options`,
        );
      } else {
        this.logger.warn("⚠️ No flights payload returned from search");
      }
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

    const travelLinks = this.buildResponseTravelLinks(
      travelServices,
      flightSearchParams,
    );

    const responseBody: ChatResponse = {
      reply: finalReply,
      intent: classified.intent,
    };

    if (travelLinks.length) {
      responseBody.travelLinks = travelLinks;
    }

    if (flightsPayload?.flights?.length) {
      flightsPayload.intro = finalReply;
      responseBody.flights = flightsPayload;
      this.logger.log(
        `📤 Response includes ${flightsPayload.flights.length} flights`,
      );
    } else if (
      classified.intent === "flight_search" &&
      travelServices.includes("flights")
    ) {
      const aviasalesLink = travelLinks.find((l) => l.id === "aviasales");
      if (aviasalesLink) {
        responseBody.flightFallback = { searchUrl: aviasalesLink.url };
        responseBody.reply =
          "I couldn't find any flights matching your search right now. You can explore more routes, airlines, and flexible dates using the options below.";
      }
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

  private async runFlightSearch(messages: ChatMessage[]): Promise<{
    payload: FlightsChatPayload | null;
    params: FlightSearchParams | null;
  }> {
    this.logger.debug(
      `🔍 Building flight search params from ${messages.length} messages`,
    );

    const params = await buildFlightSearchParams(messages, this.anthropic);

    if (!params) {
      this.logger.warn("⚠️ No flight params extracted");
    } else {
      this.logger.debug(
        `✓ Params extracted: ${params.origin} → ${params.destination}`,
      );
    }

    if (!params) {
      this.logger.warn(
        "🚫 Flight intent detected but missing origin/destination — asking user for clarification",
      );
      return { payload: null, params: null };
    }

    this.logger.log(
      `🛫 Executing flight API: ${params.origin} → ${params.destination}, day ${params.departDate}`,
    );

    try {
      const result = await this.flightsService.search(params);
      if (!result.payload || !result.payload.flights?.length) {
        this.logger.warn(
          `⚠️ Flight API returned no results for ${params.origin}→${params.destination} on ${params.departDate || "any day"}`,
        );
        this.logger.debug("API Response:", JSON.stringify(result.payload));
      } else {
        this.logger.log(
          `✅ Flight API success: ${result.payload.flights.length} flights found`,
        );
      }
      return { payload: result.payload, params };
    } catch (error) {
      this.logger.error(
        `❌ Flight API failed: ${error instanceof Error ? error.message : error}`,
        error instanceof Error ? error.stack : "",
      );
      return { payload: null, params };
    }
  }

  private buildResponseTravelLinks(
    services: ReturnType<typeof resolveTravelServices>,
    flightParams: FlightSearchParams | null,
  ): TravelLink[] {
    if (!services.length) return [];

    const marker = this.config.keys.AVIASALES_MARKER?.trim();
    const urls = {
      kkday: this.config.keys.KKDAY_URL,
      wegotrip: this.config.keys.WEGOTRIP_URL,
      getrentacar: this.config.keys.GETRENTACAR_URL,
      kiwiTaxi: this.config.keys.KIWI_TAXI_URL,
      yesim: this.config.keys.YESIM_URL,
    };

    return buildTravelLinks(services, {
      urls: Object.fromEntries(
        Object.entries(urls).filter(([, value]) => Boolean(value)),
      ),
      flightParams,
      aviasalesMarker: marker,
      includeOptionalKkdayForFlights: true,
    });
  }

  private buildSystemPrompt(intent: ChatIntentType, hasLiveFlights: boolean) {
    switch (intent) {
      case "flight_search":
        return this.buildFlightPrompt(hasLiveFlights);
      case "hotel_search":
        return this.buildHotelPrompt();
      case "esim":
        return this.buildEsimPrompt();
      case "activities":
        return this.buildActivitiesPrompt();
      case "car_rental":
        return this.buildCarRentalPrompt();
      case "airport_transfer":
        return this.buildAirportTransferPrompt();
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
      case "esim":
      case "activities":
      case "car_rental":
      case "airport_transfer":
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
      "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language (like 'abe', 'haha'), or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
      "",
      "MODE: FLIGHT SEARCH / BOOKING",
      "The platform runs a live flight search via TravelPayouts from the user's message (origin, destination, date, passengers, cabin).",
      `FLAG: hasLiveResults = ${hasLiveResults}. This MUST guide your response.`,
      "Relevant booking links (Aviasales, KKDay) are shown in the UI — do NOT paste URLs in your reply.",
    ];

    if (hasLiveResults) {
      lines.push(
        "✅ LIVE FLIGHTS AVAILABLE — Real flight cards are shown below.",
        "Do NOT list flights/times/prices in text — cards have all details.",
        "Write ONLY 1–2 sentences welcoming the options (e.g. 'Great Economy choices for your route').",
        "NEVER mention 'cards below' or ask to check—just present the flights.",
        "Keep under 40 words. No bullet lists or markdown headings.",
      );
    } else {
      lines.push(
        "❌ NO LIVE FLIGHTS FOUND — Do NOT mention cards, options, or suggest checking anything below.",
        "CRITICAL: NEVER suggest flights exist when NO RESULTS were returned.",
        "In 1–2 sentences: politely say no fares are available for that exact date.",
        "Then ask ONE follow-up: Are you flexible by ±a few days or another month?",
        "Do NOT invent flights, prices, or availability. Do NOT mention APIs or systems.",
        "Keep under 60 words.",
      );
    }

    return lines.join("\n");
  }

  private buildHotelPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
      "",
      "MODE: HOTEL / STAY GUIDANCE",
      "TravelGeek does NOT have hotel booking APIs — never search hotels or invent rates, availability, or hotel listings.",
      "Provide helpful hotel guidance: areas to stay, what to look for, budget tips, and neighborhood advice.",
      "Ask for: city/area, check-in & check-out dates, budget, and number of guests when helpful.",
      "A KKDay booking link is shown in the UI — do NOT paste URLs in your reply.",
      "Give 3–5 practical tips or area suggestions in 80–120 words. Plain paragraphs or short bullets.",
    ].join("\n");
  }

  private buildEsimPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
      "",
      "MODE: TRAVEL eSIM / MOBILE DATA",
      "TravelGeek does NOT have eSIM APIs — never invent plans, prices, or availability.",
      "Give practical guidance: data needs, eSIM vs physical SIM, device compatibility, and tips for the destination.",
      "A Yesim booking link is shown in the UI — do NOT paste URLs in your reply.",
      "Do NOT mention flights unless the user asked about flights in this same message.",
      "80–120 words. Plain paragraphs or short bullets.",
    ].join("\n");
  }

  private buildActivitiesPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
      "",
      "MODE: ACTIVITIES / TOURS / ATTRACTIONS",
      "TravelGeek does NOT have activity booking APIs — never invent tour prices, tickets, or availability.",
      "Give destination guidance: what to see, best areas, timing tips, and what to book ahead.",
      "KKDay and WeGoTrip links are shown in the UI when relevant — do NOT paste URLs in your reply.",
      "120–180 words. Markdown with short ### sections is OK.",
    ].join("\n");
  }

  private buildCarRentalPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
      "",
      "MODE: CAR / VEHICLE RENTAL",
      "TravelGeek does NOT have rental APIs — never search rentals or invent rates or availability.",
      "Give practical guidance: license/ID requirements, insurance basics, city vs self-drive tips, and what to check before booking.",
      "A GetRentacar link is shown in the UI — do NOT paste URLs in your reply.",
      "80–120 words. Plain paragraphs or short bullets.",
    ].join("\n");
  }

  private buildAirportTransferPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
      "",
      "MODE: AIRPORT / HOTEL TRANSFERS",
      "TravelGeek does NOT have transfer APIs — never invent prices, drivers, or live availability.",
      "Give practical guidance: private vs shared transfer, typical pickup process, and what details to confirm (flight number, terminal, passengers, luggage).",
      "A Kiwi Taxi link is shown in the UI — do NOT paste URLs in your reply.",
      "80–120 words. Plain paragraphs or short bullets.",
    ].join("\n");
  }

  private buildPlaceInfoPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
      "",
      "MODE: PLACE / DESTINATION INFORMATION",
      "User wants info about a place — attractions, food, culture, weather, safety, etc.",
      "NOT a full day-by-day itinerary unless they ask to plan the whole trip.",
      "For tours, activities, museums, or tickets: give destination guidance first; booking links (KKDay, WeGoTrip) appear in the UI when relevant — do NOT paste URLs.",
      "Use Markdown: short ### sections and bullets. 120–200 words.",
      "Be specific with real place names when you know them. No invented prices.",
    ].join("\n");
  }

  private buildRestaurantsBarsPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
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
      "Sound human, calm, practical, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
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
      "Sound human, warm, clear, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
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
      "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
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
      "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
      "",
      "MODE: GENERAL TRAVEL CHAT",
      "",
      "Help the user choose what they need:",
      "- Flights: live prices when they give route + date (e.g. Jaipur to Delhi, 5 July)",
      "- Hotels: guidance and area tips (no live hotel search — booking links appear in UI when relevant)",
      "- Activities & tours: destination guidance; KKDay / WeGoTrip links in UI when relevant",
      "- Car rental, airport transfers, eSIM: guidance only; relevant partner links appear in UI",
      "- Full itinerary: day-by-day plan",
      "- Place info: things to do, food, culture in a destination",
      "",
      "GREETINGS: Warm 2–3 sentences, invite them to pick flights, hotels, or planning.",
      "OTHER: 40–80 words, plain paragraphs. One closing question.",
      "Do not invent prices or bookings. Do not paste partner URLs — they are shown as buttons in the UI.",
    ].join("\n");
  }

  private buildChecklistPrompt() {
    return [
      "You are My Travel Geek — a friendly personal travel genius.",
      "Sound human, warm, practical, and PROFESSIONAL. Never mention AI, models, or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
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
      "Sound enthusiastic, human, helpful, and PROFESSIONAL — like a friend who knows the route well. Never mention AI or systems.",
      "Always respond in English. Only use another language if the user explicitly asks",
      "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
      "",
      TRAVEL_ASSISTANT_RULES,
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
