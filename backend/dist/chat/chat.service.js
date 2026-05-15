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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const common_1 = require("@nestjs/common");
let ChatService = class ChatService {
    constructor() {
        const apiKey = process.env.SECRET ?? process.env.ANTHROPIC_API_KEY ?? process.env.KEY;
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
        const response = await this.client.messages.create({
            model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
            max_tokens: 500,
            system: this.buildSystemPrompt(),
            messages: messages,
        });
        const reply = this.extractText(response.content);
        return {
            reply: reply || "I’m ready to help with the next step of your trip.",
        };
    }
    buildSystemPrompt() {
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
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ChatService);
//# sourceMappingURL=chat.service.js.map