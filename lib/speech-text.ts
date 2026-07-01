const EMOJI_PATTERN =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{1F1E6}-\u{1F1FF}]/gu;

const CHUNK_MAX = 400;

/** Strip markdown and return plain text safe for TTS. */
export function markdownToSpeechText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\|[^|\n]+\|/g, " ")
    .replace(EMOJI_PATTERN, "")
    .replace(/[★☆✓✔✕✖→←↑↓•●○◆◇▪▫]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/&/g, " and ")
    .replace(/---+/g, ". ")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitSpeechText(
  text: string,
  maxLen = CHUNK_MAX,
): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxLen) {
    const slice = remaining.slice(0, maxLen);
    let splitAt = Math.max(
      slice.lastIndexOf(". "),
      slice.lastIndexOf("! "),
      slice.lastIndexOf("? "),
      slice.lastIndexOf(" "),
    );
    if (splitAt <= 0) splitAt = maxLen;

    const chunk = remaining.slice(0, splitAt).trim();
    if (chunk) chunks.push(chunk);
    remaining = remaining.slice(splitAt).trim();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

export function isLikelyMp3(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 128) return false;
  const bytes = new Uint8Array(buffer);
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return true;
  return bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
}
