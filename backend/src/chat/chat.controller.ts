import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTokenGuard } from "../guards/api-token.guard";
import { ChatService } from "./chat.service";
import type { ChatRequest } from "./chat.types";

@Controller("chat")
@UseGuards(ApiTokenGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createReply(@Body() body: ChatRequest) {
    return this.chatService.createReply(body);
  }
}
