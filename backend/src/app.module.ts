import { Module } from "@nestjs/common";
import { AnthropicModule } from "./ai/anthropic.module";
import { AppConfigModule } from "./config/config.module";
import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [AppConfigModule, AnthropicModule, ChatModule],
})
export class AppModule {}
