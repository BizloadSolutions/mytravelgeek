/** Travelpayouts / Aviasales airline logos by IATA code (free CDN). */
const AVS_LOGO_CDN = "https://pics.avs.io";

/**
 * @see https://support.travelpayouts.com — pics.avs.io logos by airline IATA
 * @param size Width/height in pixels (default 64 for chat avatars)
 */
export function airlineLogoUrl(
  iataCode?: string,
  size = 128,
): string | undefined {
  if (!iataCode?.trim()) return undefined;

  const code = iataCode.trim().toUpperCase();
  if (!/^[A-Z0-9]{2,3}$/.test(code)) return undefined;

  return `${AVS_LOGO_CDN}/${size}/${size}/${code}.png`;
}
