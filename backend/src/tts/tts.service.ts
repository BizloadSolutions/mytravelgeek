import { BadRequestException, Injectable } from "@nestjs/common";
import { MsEdgeTTS, OUTPUT_FORMAT, VOLUME } from "msedge-tts";
import type { Readable } from "stream";

const VOICE = "en-IN-NeerjaNeural";

/** msedge-tts returns empty audio for "&" and some symbols. */
function sanitizeForTts(text: string): string {
  return text
    .replace(/&/g, " and ")
    .replace(/---+/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

@Injectable()
export class TtsService {
  private streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });
  }

  async synthesize(rawText: string): Promise<Buffer> {
    const text = sanitizeForTts(rawText);
    if (!text) {
      throw new BadRequestException("Text is required for speech synthesis.");
    }

    const tts = new MsEdgeTTS();
    try {
      await tts.setMetadata(
        VOICE,
        OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,
      );

      const { audioStream } = tts.toStream(text, {
        rate: "-4%",
        pitch: "+2Hz",
        volume: VOLUME.SOFT,
      });

      const audio = await this.streamToBuffer(audioStream);
      if (audio.byteLength < 128) {
        throw new BadRequestException("Speech synthesis returned invalid audio.");
      }

      return audio;
    } finally {
      tts.close();
    }
  }
}
