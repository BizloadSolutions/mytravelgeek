/** Travelpayouts / Aviasales airline logos by IATA code. */
const AVS_LOGO_CDN = "https://pics.avs.io";

export function airlineLogoUrl(
  iataCode?: string,
  size = 64,
): string | undefined {
  if (!iataCode?.trim()) return undefined;

  const code = iataCode.trim().toUpperCase();
  if (!/^[A-Z0-9]{2,3}$/.test(code)) return undefined;

  return `${AVS_LOGO_CDN}/${size}/${size}/${code}.png`;
}
