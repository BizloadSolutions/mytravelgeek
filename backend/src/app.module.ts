import { Module } from "@nestjs/common";
import { AppConfigModule } from "./config/config.module";
import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [AppConfigModule, ChatModule],
})
export class AppModule {}
