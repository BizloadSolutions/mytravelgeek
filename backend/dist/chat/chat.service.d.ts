import type { ChatRequest } from "./chat.types";
export declare class ChatService {
    private readonly client;
    constructor();
    createReply(body: ChatRequest): Promise<{
        reply: string;
    }>;
    private buildSystemPrompt;
    private extractText;
    private normalizeMessages;
}
