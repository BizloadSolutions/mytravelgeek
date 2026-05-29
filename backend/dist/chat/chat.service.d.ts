import { ConfigService } from "../config/config.service";
import { FlightsService } from "../integrations/flights/flights.service";
import type { ChatRequest, ChatResponse } from "./chat.types";
export declare class ChatService {
    private readonly flightsService;
    private readonly config;
    private readonly logger;
    private readonly client;
    constructor(flightsService: FlightsService, config: ConfigService);
    createReply(body: ChatRequest): Promise<ChatResponse>;
    private buildFlightPrompt;
    private isItineraryRequest;
    private isChecklistRequest;
    private resolveMaxTokens;
    private tokenLimit;
    private fallbackReply;
    private buildBriefPrompt;
    private buildChecklistPrompt;
    private buildItineraryPrompt;
    private extractText;
    private normalizeMessages;
}
