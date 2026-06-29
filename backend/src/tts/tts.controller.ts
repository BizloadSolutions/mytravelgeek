import { Body, Controller, Post, StreamableFile } from "@nestjs/common";
import { TtsService } from "./tts.service";

type TtsRequestBody = {
  text?: string;
};

@Controller("tts")
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post()
  async synthesize(@Body() body: TtsRequestBody): Promise<StreamableFile> {
    const audio = await this.ttsService.synthesize(body.text ?? "");
    return new StreamableFile(audio, {
      type: "audio/mpeg",
      disposition: "inline",
    });
  }
}
