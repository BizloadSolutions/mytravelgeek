/** Common IATA airline codes → display name (extend as needed). */
const AIRLINE_NAMES: Record<string, string> = {
  AI: "Air India",
  "9I": "Alliance Air",
  UK: "Vistara",
  "6E": "IndiGo",
  SG: "SpiceJet",
  G8: "Go First",
  I5: "AirAsia India",
  FD: "Thai AirAsia",
  TG: "Thai Airways",
  WY: "Oman Air",
  EK: "Emirates",
  QR: "Qatar Airways",
};

export function airlineDisplayName(code?: string) {
  if (!code?.trim()) return "Partner airline";
  const key = code.trim().toUpperCase();
  return AIRLINE_NAMES[key] ?? `Airline ${key}`;
}
