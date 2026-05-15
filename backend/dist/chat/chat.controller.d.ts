import { ChatService } from "./chat.service";
import type { ChatRequest } from "./chat.types";
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createReply(body: ChatRequest): Promise<{
        reply: string;
    }>;
}
