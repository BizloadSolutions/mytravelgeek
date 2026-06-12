type AviasalesSearchInput = {
  origin?: string;
  destination?: string;
  departDate?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
};

export function buildAviasalesSearchUrl(
  input: AviasalesSearchInput,
  options: { marker: string; baseUrl?: string },
): string {
  const base = (options.baseUrl ?? "https://www.aviasales.com").replace(
    /\/$/,
    "",
  );
  const marker = options.marker.trim();
  const origin = input.origin?.trim().toUpperCase() ?? "";
  const destination = input.destination?.trim().toUpperCase() ?? "";
  const adults = Math.min(9, Math.max(1, input.adults ?? 1));
  const children = Math.min(9, Math.max(0, input.children ?? 0));
  const infants = Math.min(9, Math.max(0, input.infants ?? 0));
  const pax = `${adults}${children}${infants}`;

  let params = destination || origin || "DEL";
  if (origin && destination && input.departDate) {
    const [, month, day] = input.departDate.split("-");
    if (month && day) {
      const dd = day.padStart(2, "0");
      const mm = month.padStart(2, "0");
      params = `${origin}${dd}${mm}${destination}`;
      if (input.returnDate) {
        const [, retMonth, retDay] = input.returnDate.split("-");
        if (retMonth && retDay) {
          params += `${retDay.padStart(2, "0")}${retMonth.padStart(2, "0")}`;
        }
      }
    }
  }
  params += pax;

  const url = new URL(`${base}/`);
  if (marker) url.searchParams.set("marker", marker);
  url.searchParams.set("params", params);
  return url.toString();
}

export function buildAviasalesMarkerUrl(marker: string): string {
  return buildAviasalesSearchUrl({}, { marker });
}
