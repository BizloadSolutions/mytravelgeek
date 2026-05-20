import type { ChatRequest } from "./chat.types";
export declare class ChatService {
    private readonly client;
    constructor();
    createReply(body: ChatRequest): Promise<{
        reply: string;
    }>;
    private isItineraryRequest;
    private isChecklistRequest;
    private resolveMaxTokens;
    private buildBriefPrompt;
    private buildChecklistPrompt;
    private buildItineraryPrompt;
    private extractText;
    private normalizeMessages;
}
