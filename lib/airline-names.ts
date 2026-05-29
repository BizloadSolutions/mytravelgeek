/**
 * Airline names from IATA codes (frontend only).
 * Dataset: OpenFlights-style airlines list (same approach as `airportdb/airlines.json` / `aircodes`).
 */
import airlinesData from "./data/airlines.json";

type AirlineRecord = {
  iata?: string | null;
  name?: string;
};

const airlines = airlinesData as AirlineRecord[];

const byIata = new Map<string, string>();

for (const airline of airlines) {
  const code = airline.iata?.trim().toUpperCase();
  if (code && airline.name) {
    byIata.set(code, airline.name);
  }
}

/** Lookup airline name by IATA code (e.g. AI → Air India Limited). */
export function getAirlineNameByIata(
  iata?: string,
  fallback = "Partner airline",
): string {
  if (!iata?.trim()) return fallback;
  return byIata.get(iata.trim().toUpperCase()) ?? fallback;
}

/**
 * Prefer database name on the frontend; fall back to API-provided label.
 */
export function resolveAirlineDisplayName(
  iata?: string,
  serverName?: string,
): string {
  if (iata?.trim()) {
    const fromDb = byIata.get(iata.trim().toUpperCase());
    if (fromDb) return fromDb;
  }
  return serverName?.trim() || "Partner airline";
}

/** Replace the first segment of the meta line with the resolved airline name. */
export function formatFlightMetaLine(
  metaLine: string,
  displayName: string,
): string {
  const parts = metaLine.split("•").map((part) => part.trim());
  if (parts.length > 1) {
    parts[0] = displayName;
    return parts.join(" • ");
  }
  return displayName;
}
