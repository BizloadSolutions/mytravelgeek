export type AirportEntry = {
  code: string;
  city: string;
  country?: string;
};

/** Common IATA codes — extend as needed. */
export const AIRPORTS: AirportEntry[] = [
  { code: "DEL", city: "delhi", country: "IN" },
  { code: "BOM", city: "mumbai", country: "IN" },
  { code: "BLR", city: "bangalore", country: "IN" },
  { code: "BKK", city: "bangkok", country: "TH" },
  { code: "DXB", city: "dubai", country: "AE" },
  { code: "JAI", city: "jaipur", country: "IN" },
  { code: "GOI", city: "goa", country: "IN" },
  { code: "MAA", city: "chennai", country: "IN" },
  { code: "CCU", city: "kolkata", country: "IN" },
  { code: "HYD", city: "hyderabad", country: "IN" },
  { code: "JFK", city: "new york", country: "US" },
  { code: "MAD", city: "madrid", country: "ES" },
  { code: "LON", city: "london", country: "GB" },
  { code: "LHR", city: "london heathrow", country: "GB" },
  { code: "SIN", city: "singapore", country: "SG" },
  { code: "DMK", city: "don mueang", country: "TH" },
];

const ALIASES: Record<string, string> = {
  bengaluru: "bangalore",
  "new delhi": "delhi",
  nyc: "new york",
  "mumbai bom": "mumbai",
};

export function resolveAirportCode(text: string): string | null {
  const lower = text.toLowerCase();

  for (const [alias, target] of Object.entries(ALIASES)) {
    if (lower.includes(alias)) {
      const entry = AIRPORTS.find((a) => a.city === target);
      if (entry) return entry.code;
    }
  }

  for (const entry of AIRPORTS) {
    if (lower.includes(entry.city)) return entry.code;
  }

  const iata = lower.match(/\b([a-z]{3})\b/gi);
  if (iata) {
    const code = iata.find((c) =>
      AIRPORTS.some((a) => a.code === c.toUpperCase()),
    );
    if (code) return code.toUpperCase();
  }

  return null;
}

export function cityNameForCode(code: string) {
  const entry = AIRPORTS.find((a) => a.code === code);
  if (!entry) return code;
  return entry.city.replace(/\b\w/g, (c) => c.toUpperCase());
}
