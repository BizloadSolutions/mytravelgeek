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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const common_1 = require("@nestjs/common");
const flight_intent_1 = require("../integrations/flights/flight-intent");
const config_service_1 = require("../config/config.service");
const flights_service_1 = require("../integrations/flights/flights.service");
let ChatService = ChatService_1 = class ChatService {
    constructor(flightsService, config) {
        this.flightsService = flightsService;
        this.config = config;
        this.logger = new common_1.Logger(ChatService_1.name);
        const apiKey = this.config.keys.SECRET;
        if (!apiKey) {
            throw new common_1.InternalServerErrorException("Missing Anthropic API key in SECRET.");
        }
        this.client = new sdk_1.default({ apiKey });
    }
    async createReply(body) {
        const messages = this.normalizeMessages(body.messages);
        if (!messages.some((message) => message.role === "user")) {
            throw new common_1.BadRequestException("Send at least one user message to start the conversation.");
        }
        const itineraryMode = this.isItineraryRequest(messages);
        const checklistMode = !itineraryMode && this.isChecklistRequest(messages);
        const flightMode = !itineraryMode && !checklistMode && (0, flight_intent_1.isFlightSearchRequest)(messages);
        let flightsPayload = null;
        if (flightMode) {
            const params = (0, flight_intent_1.buildFlightSearchParams)(messages);
            if (params) {
                this.logger.log(`Flight search: ${params.origin} → ${params.destination}, month ${params.departMonth}`);
                try {
                    const result = await this.flightsService.search(params);
                    flightsPayload = result.payload;
                    if (!flightsPayload) {
                        this.logger.warn(`Flight search returned no results for ${params.origin}→${params.destination}`);
                    }
                }
                catch (error) {
                    this.logger.warn(`Flight search failed: ${error instanceof Error ? error.message : error}`);
                }
            }
            else {
                this.logger.warn("Flight mode active but could not parse origin/destination from messages.");
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
            messages: messages,
        });
        const reply = this.extractText(response.content);
        if (!reply) {
            this.logger.warn(`Empty model reply (stop=${response.stop_reason}, model=${this.config.keys.ANTHROPIC_MODEL})`);
        }
        const finalReply = reply ||
            (flightMode && flightsPayload
                ? `Here are live flight options for your route.`
                : flightMode
                    ? `I couldn’t find live prices for that month yet — try a specific month (e.g. June 2026) or airport codes like JAI to DEL.`
                    : this.fallbackReply(messages));
        const responseBody = { reply: finalReply };
        if (flightsPayload) {
            flightsPayload.intro = finalReply;
            responseBody.flights = flightsPayload;
        }
        return responseBody;
    }
    buildFlightPrompt(hasLiveResults) {
        const lines = [
            "You are My Travel Geek — a friendly personal travel genius.",
            "Sound human, warm, and simple. Never mention AI, models, or systems.",
            "Reply in the user's language and tone (Hindi/Hinglish if they write that way).",
            "",
            "MODE: FLIGHT SEARCH",
        ];
        if (hasLiveResults) {
            lines.push("Live flight options are shown in cards below your message — do NOT list flights, times, or prices in text.", "Write only 1–2 short sentences as an intro (e.g. that you found Economy options for their route).", "Keep under 40 words. No bullet lists or markdown headings.", "NEVER say you cannot access live flight data, Google Flights, or external booking sites.");
        }
        else {
            lines.push("Live price cards could not be loaded for this search. Ask for origin and destination as airport codes (e.g. DEL to BKK) and a month if needed.", "Do NOT claim you cannot access flight data in general. Do NOT send users to Google Flights or other sites.", "Keep under 60 words. No invented prices or flight times.");
        }
        return lines.join("\n");
    }
    isItineraryRequest(messages) {
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        const text = lastUser?.content.toLowerCase() ?? "";
        return (/itinerar|itenar|itinerary|trip plan|plan me|plan a\b|plan our|plan the/.test(text) ||
            /road trip|day[- ]?by[- ]?day|full plan|custom plan/.test(text) ||
            /(\d+)\s*days?\s+(trip|in|to|from)/.test(text) ||
            (/jaipur|udaipur|from .+ to .+|to udaipur|to jaipur/.test(text) &&
                /plan|trip|itinerar|itenar|going|group|friends/.test(text)));
    }
    isChecklistRequest(messages) {
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        const text = lastUser?.content.toLowerCase() ?? "";
        return (/packing|pack(ing)? tips|what to pack|pack kya|packign|packin/.test(text) ||
            /list|checklist|items|things to carry|puri list|detail|detailed|full list/.test(text));
    }
    resolveMaxTokens({ itineraryMode, checklistMode, flightMode, hasFlights, }) {
        const { keys } = this.config;
        if (itineraryMode)
            return this.tokenLimit(keys.ANTHROPIC_MAX_TOKENS, 2048);
        if (checklistMode)
            return this.tokenLimit(keys.ANTHROPIC_MAX_TOKENS_CHECKLIST, 900);
        if (flightMode && hasFlights)
            return this.tokenLimit(keys.ANTHROPIC_MAX_TOKENS_FLIGHT, 200);
        return this.tokenLimit(keys.ANTHROPIC_MAX_TOKENS_BRIEF, 400);
    }
    tokenLimit(raw, fallback) {
        const n = Number(raw);
        return Number.isFinite(n) && n > 0 ? n : fallback;
    }
    fallbackReply(messages) {
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
    buildBriefPrompt() {
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
    buildChecklistPrompt() {
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
    buildItineraryPrompt() {
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
    extractText(content) {
        return content
            .filter((block) => block.type === "text" && typeof block.text === "string")
            .map((block) => block.text ?? "")
            .join("")
            .trim();
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
    __metadata("design:paramtypes", [flights_service_1.FlightsService,
        config_service_1.ConfigService])
], ChatService);
//# sourceMappingURL=chat.service.js.map