import { AnthropicService } from "../ai/anthropic.service";
import { ConfigService } from "../config/config.service";
import { FlightsService } from "../integrations/flights/flights.service";
import type { ChatRequest, ChatResponse } from "./chat.types";
export declare class ChatService {
    private readonly anthropic;
    private readonly flightsService;
    private readonly config;
    private readonly logger;
    constructor(anthropic: AnthropicService, flightsService: FlightsService, config: ConfigService);
    createReply(body: ChatRequest): Promise<ChatResponse>;
    private outOfScopeReply;
    private runFlightSearch;
    private buildSystemPrompt;
    private resolveTemperature;
    private resolveMaxTokens;
    private fallbackReply;
    private buildFlightPrompt;
    private buildHotelPrompt;
    private buildPlaceInfoPrompt;
    private buildRestaurantsBarsPrompt;
    private buildTravelSafetyPrompt;
    private buildEstimatedRoutesPrompt;
    private buildTripPlanPrompt;
    private buildBriefPrompt;
    private buildChecklistPrompt;
    private buildItineraryPrompt;
    private normalizeMessages;
}
