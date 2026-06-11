/** Common city names → primary airport IATA (lowercase keys). */
const CITY_TO_IATA: Record<string, string> = {
  sydney: "SYD",
  brisbane: "BNE",
  melbourne: "MEL",
  perth: "PER",
  adelaide: "ADL",
  canberra: "CBR",
  delhi: "DEL",
  "new delhi": "DEL",
  mumbai: "BOM",
  bombay: "BOM",
  bangalore: "BLR",
  bengaluru: "BLR",
  hyderabad: "HYD",
  chennai: "MAA",
  madras: "MAA",
  kolkata: "CCU",
  calcutta: "CCU",
  jaipur: "JAI",
  goa: "GOI",
  ahmedabad: "AMD",
  pune: "PNQ",
  kochi: "COK",
  cochin: "COK",
  rome: "ROM",
  bali: "DPS",
  "las vegas": "LAS",
  vancouver: "YVR",
  seattle: "SEA",
  dubai: "DXB",
  "abu dhabi": "AUH",
  singapore: "SIN",
  bangkok: "BKK",
  "kuala lumpur": "KUL",
  london: "LON",
  paris: "PAR",
  "new york": "NYC",
  toronto: "YTO",
  "los angeles": "LAX",
  "san francisco": "SFO",
  tokyo: "TYO",
  "hong kong": "HKG",
  amsterdam: "AMS",
  frankfurt: "FRA",
};

export function cityNameToIata(name: string): string | null {
  const key = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ");
  return CITY_TO_IATA[key] ?? null;
}

/** Extract "origin to destination" city pair from free text. */
export function parseRouteCities(query: string): {
  origin?: string;
  destination?: string;
} {
  const text = query.trim();
  const patterns = [
    /\b(?:from|for)\s+([a-z][a-z\s]{1,30}?)\s+to\s+([a-z][a-z\s]{1,30}?)(?=\s+for\s|\s+on\s|\s+\d|\s*$)/i,
    /\b([a-z][a-z\s]{1,30}?)\s+to\s+([a-z][a-z\s]{1,30}?)(?=\s+for\s|\s+on\s|\s+\d|\s*$)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const origin = cityNameToIata(match[1]);
    const destination = cityNameToIata(match[2]);
    if (origin || destination) {
      return {
        origin: origin ?? undefined,
        destination: destination ?? undefined,
      };
    }
  }

  return {};
}
