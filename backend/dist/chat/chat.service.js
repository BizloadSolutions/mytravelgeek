"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const anthropic_service_1 = require("../ai/anthropic.service");
const config_service_1 = require("../config/config.service");
const flight_intent_1 = require("../integrations/flights/flight-intent");
const flights_service_1 = require("../integrations/flights/flights.service");
const chat_intent_1 = require("./chat-intent");
let ChatService = ChatService_1 = class ChatService {
    constructor(anthropic, flightsService, config) {
        this.anthropic = anthropic;
        this.flightsService = flightsService;
        this.config = config;
        this.logger = new common_1.Logger(ChatService_1.name);
    }
    async createReply(body) {
        const messages = this.normalizeMessages(body.messages);
        if (!messages.some((message) => message.role === "user")) {
            throw new common_1.BadRequestException("Send at least one user message to start the conversation.");
        }
        const classified = (0, chat_intent_1.classifyChatIntentType)(messages);
        this.logger.log(`Chat intent: ${classified.intent} (${classified.confidence}) — ${classified.reason}`);
        if (classified.intent === "out_of_scope") {
            return {
                reply: this.outOfScopeReply(),
                intent: classified.intent,
            };
        }
        let flightsPayload = null;
        if (classified.intent === "flight_search") {
            this.logger.debug("Attempting flight search...");
            flightsPayload = await this.runFlightSearch(messages);
            if (flightsPayload) {
                this.logger.log(`✅ Flights found: ${flightsPayload.flights?.length || 0} options`);
            }
            else {
                this.logger.warn("⚠️ No flights payload returned from search");
            }
        }
        const maxTokens = this.resolveMaxTokens(classified.intent, Boolean(flightsPayload));
        const temperature = this.resolveTemperature(classified.intent);
        const { text: reply } = await this.anthropic.complete({
            max_tokens: maxTokens,
            temperature,
            system: this.buildSystemPrompt(classified.intent, Boolean(flightsPayload)),
            messages,
        });
        const finalReply = reply ||
            this.fallbackReply(classified.intent, messages, Boolean(flightsPayload));
        const responseBody = {
            reply: finalReply,
            intent: classified.intent,
        };
        if (flightsPayload) {
            flightsPayload.intro = flightsPayload.availabilityNote
                ? `${finalReply}\n\n${flightsPayload.availabilityNote}`
                : finalReply;
            responseBody.flights = flightsPayload;
            this.logger.log(`📤 Response includes ${flightsPayload.flights?.length || 0} flights`);
        }
        else {
            this.logger.debug(`📤 Response has no flights (intent: ${classified.intent})`);
        }
        return responseBody;
    }
    outOfScopeReply() {
        return [
            "I can only help with travel topics (flights, itineraries, hotels/stays, restaurants, tours, visas, safety, routes, and local tips).",
            "",
            "Tell me your destination + dates, or ask for flights like: DEL to DXB on 2026-06-10.",
        ].join("\n");
    }
    async runFlightSearch(messages) {
        this.logger.debug(`🔍 Building flight search params from ${messages.length} messages`);
        const params = await (0, flight_intent_1.buildFlightSearchParams)(messages, this.anthropic);
        if (!params) {
            this.logger.warn("⚠️ No flight params extracted");
        }
        else {
            this.logger.debug(`✓ Params extracted: ${params.origin} → ${params.destination}`);
        }
        if (!params) {
            this.logger.warn("🚫 Flight intent detected but missing origin/destination — asking user for clarification");
            return null;
        }
        this.logger.log(`🛫 Executing flight API: ${params.origin} → ${params.destination}, day ${params.departDate}`);
        try {
            const result = await this.flightsService.search(params);
            if (!result.payload || !result.payload.flights?.length) {
                this.logger.warn(`⚠️ Flight API returned no results for ${params.origin}→${params.destination} on ${params.departDate || "any day"}`);
                this.logger.debug("API Response:", JSON.stringify(result.payload));
            }
            else {
                this.logger.log(`✅ Flight API success: ${result.payload.flights.length} flights found`);
            }
            return result.payload;
        }
        catch (error) {
            this.logger.error(`❌ Flight API failed: ${error instanceof Error ? error.message : error}`, error instanceof Error ? error.stack : "");
            return null;
        }
    }
    buildSystemPrompt(intent, hasLiveFlights) {
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
    resolveTemperature(intent) {
        if (intent === "itinerary")
            return 0.65;
        if (intent === "checklist")
            return 0.55;
        return 0.5;
    }
    resolveMaxTokens(intent, hasFlights) {
        const { keys } = this.config;
        switch (intent) {
            case "itinerary":
                return this.anthropic.tokenLimit(keys.ANTHROPIC_MAX_TOKENS, 2048);
            case "checklist":
                return this.anthropic.tokenLimit(keys.ANTHROPIC_MAX_TOKENS_CHECKLIST, 900);
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
    fallbackReply(intent, messages, hasFlights) {
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
    buildFlightPrompt(hasLiveResults) {
        const lines = [
            "You are My Travel Geek — a friendly personal travel genius.",
            "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
            "Always respond in English. Only use another language if the user explicitly asks",
            "Never use slang, casual language (like 'abe', 'haha'), or abusive words. Always be respectful and courteous.",
            "",
            "MODE: FLIGHT SEARCH / BOOKING",
            "The platform runs a live flight search API from the user's message (origin, destination, date).",
            `FLAG: hasLiveResults = ${hasLiveResults}. This MUST guide your response.`,
        ];
        if (hasLiveResults) {
            lines.push("✅ LIVE FLIGHTS AVAILABLE — Real flight cards are shown below.", "Do NOT list flights/times/prices in text — cards have all details.", "Write ONLY 1–2 sentences welcoming the options (e.g. 'Great Economy choices for your route').", "NEVER mention 'cards below' or ask to check—just present the flights.", "Keep under 40 words. No bullet lists or markdown headings.");
        }
        else {
            lines.push("❌ NO LIVE FLIGHTS FOUND — Do NOT mention cards, options, or suggest checking anything below.", "CRITICAL: NEVER suggest flights exist when NO RESULTS were returned.", "In 1–2 sentences: politely say no fares are available for that exact date.", "Then ask ONE follow-up: Are you flexible by ±a few days or another month?", "Do NOT invent flights, prices, or availability. Do NOT mention APIs or systems.", "Keep under 60 words.");
        }
        return lines.join("\n");
    }
    buildHotelPrompt() {
        return [
            "You are My Travel Geek — a friendly personal travel genius.",
            "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
            "Always respond in English. Only use another language if the user explicitly asks",
            "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
            "",
            "MODE: HOTEL / STAY SEARCH",
            "Help with where to stay, areas to book, and what to look for in hotels.",
            "Live hotel price cards are not wired yet — do NOT invent nightly rates or availability.",
            "Ask for: city/area, check-in & check-out dates, budget, and number of guests.",
            "Give 3–5 practical tips or area suggestions in 80–120 words. Plain paragraphs or short bullets.",
        ].join("\n");
    }
    buildPlaceInfoPrompt() {
        return [
            "You are My Travel Geek — a friendly personal travel genius.",
            "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
            "Always respond in English. Only use another language if the user explicitly asks",
            "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
            "",
            "MODE: PLACE / DESTINATION INFORMATION",
            "User wants info about a place — attractions, food, culture, weather, safety, etc.",
            "NOT a full day-by-day itinerary unless they ask to plan the whole trip.",
            "Use Markdown: short ### sections and bullets. 120–200 words.",
            "Be specific with real place names when you know them. No invented prices.",
        ].join("\n");
    }
    buildRestaurantsBarsPrompt() {
        return [
            "You are My Travel Geek — a friendly personal travel genius.",
            "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
            "Always respond in English. Only use another language if the user explicitly asks",
            "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
            "",
            "MODE: RESTAURANTS + BARS",
            "Recommend places to eat/drink with a mix of price points and vibes.",
            "Ask 1–2 quick questions only if needed (city/area, budget, dietary, vibe).",
            "Use Markdown with short ### sections and bullets. 120–200 words.",
            "Do NOT invent live availability. Do not claim you booked anything.",
        ].join("\n");
    }
    buildTravelSafetyPrompt() {
        return [
            "You are My Travel Geek — a friendly personal travel genius.",
            "Sound human, calm, practical, and PROFESSIONAL. Never mention AI, models, or systems.",
            "Always respond in English. Only use another language if the user explicitly asks",
            "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
            "",
            "MODE: TRAVEL SAFETY",
            "Give practical safety guidance: common scams, areas/times to be careful, transport safety, emergency basics.",
            "Avoid medical or legal advice; suggest official sources when needed.",
            "Use Markdown with ### headings and bullets. 140–220 words.",
            "End with one clarifying question (destination + traveler type).",
        ].join("\n");
    }
    buildEstimatedRoutesPrompt() {
        return [
            "You are My Travel Geek — a friendly personal travel genius.",
            "Sound human, warm, clear, and PROFESSIONAL. Never mention AI, models, or systems.",
            "Always respond in English. Only use another language if the user explicitly asks",
            "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
            "MODE: MOST DIRECT ROUTES / HOW TO GET THERE",
            "Explain best route options (flight/train/bus/car) and approximate time ranges.",
            "If you are unsure, give ranges and ask for start/end points and dates.",
            "Use Markdown with ### headings and bullets. 120–200 words.",
            "Do not invent exact timetables or prices.",
        ].join("\n");
    }
    buildTripPlanPrompt() {
        return [
            "You are My Travel Geek — a friendly personal travel genius.",
            "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
            "Always respond in English. Only use another language if the user explicitly asks",
            "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
            "",
            "MODE: TRIP PLANNING (overview, not full day-by-day)",
            "Give a helpful trip overview: best time to visit, how many days, main areas, transport between cities, vibe.",
            "Do NOT write Day 1 / Day 2 unless they asked for a detailed itinerary.",
            "150–250 words. Markdown with ### sections is OK.",
            "If they need flights, mention they can ask with route + date for live prices in the app.",
        ].join("\n");
    }
    buildBriefPrompt() {
        return [
            "You are My Travel Geek — a friendly personal travel genius.",
            "Sound human, warm, simple, and PROFESSIONAL. Never mention AI, models, or systems.",
            "Always respond in English. Only use another language if the user explicitly asks",
            "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
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
    buildChecklistPrompt() {
        return [
            "You are My Travel Geek — a friendly personal travel genius.",
            "Sound human, warm, practical, and PROFESSIONAL. Never mention AI, models, or systems.",
            "Always respond in English. Only use another language if the user explicitly asks",
            "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
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
    buildItineraryPrompt() {
        return [
            "You are My Travel Geek — a friendly personal travel genius.",
            "Sound enthusiastic, human, helpful, and PROFESSIONAL — like a friend who knows the route well. Never mention AI or systems.",
            "Always respond in English. Only use another language if the user explicitly asks",
            "Never use slang, casual language, or abusive words. Always be respectful and courteous.",
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
    normalizeMessages(messages) {
        if (!Array.isArray(messages)) {
            return [];
        }
        return messages
            .filter((message) => {
            if (typeof message !== "object" || message === null) {
                return false;
            }
            const candidate = message;
            return ((candidate.role === "user" || candidate.role === "assistant") &&
                typeof candidate.content === "string" &&
                candidate.content.trim().length > 0);
        })
            .map((message) => ({
            role: message.role,
            content: message.content.trim(),
        }));
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [anthropic_service_1.AnthropicService,
        flights_service_1.FlightsService,
        config_service_1.ConfigService])
], ChatService);
//# sourceMappingURL=chat.service.js.map