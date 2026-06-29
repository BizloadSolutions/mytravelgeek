import { Module } from "@nestjs/common";
import { FlightsModule } from "../integrations/flights/flights.module";
import { ApiTokenGuard } from "../guards/api-token.guard";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
  imports: [FlightsModule],
  controllers: [ChatController],
  providers: [ChatService, ApiTokenGuard],
})
export class ChatModule {}
