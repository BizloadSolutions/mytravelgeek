import { Body, Controller, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import type { ChatRequest } from "./chat.types";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createReply(@Body() body: ChatRequest) {
    return this.chatService.createReply(body);
  }
}
