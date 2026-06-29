export const isShowMapVIew = false;
export const DEFAULT_SILENCE_MS = 1500;
export const STOP_ON_THANKS_MS = 500;

const TRAILING_THANKS_PATTERN =
  /\b(thank\s+you(?:\s+so\s+much)?|thanks(?:\s+a\s+lot)?|thank\s+u)\s*\.?\s*$/i;

export function hasTrailingThanks(text: string): boolean {
  return TRAILING_THANKS_PATTERN.test(text.trim());
}

export function stripTrailingThanks(text: string): string {
  return text
    .replace(
      /\s*\b(thank\s+you(?:\s+so\s+much)?|thanks(?:\s+a\s+lot)?|thank\s+u)\s*\.?\s*$/i,
      "",
    )
    .trim();
}
