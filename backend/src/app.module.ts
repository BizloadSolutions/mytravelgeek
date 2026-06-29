import { Module } from "@nestjs/common";
import { AnthropicModule } from "./ai/anthropic.module";
import { AppConfigModule } from "./config/config.module";
import { ChatModule } from "./chat/chat.module";
import { TtsModule } from "./tts/tts.module";

@Module({
  imports: [AppConfigModule, AnthropicModule, ChatModule, TtsModule],
})
export class AppModule {}
