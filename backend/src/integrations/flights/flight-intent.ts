import path from "node:path";
import type { ChatMessage } from "../../chat/chat.types";
import { FLIGHTS_PAGE_SIZE } from "../../helper/constant";
import type { AnthropicService } from "../../ai/anthropic.service";
import type { FlightSearchParams } from "./flight.types";
import type { FlightSearchParams as ExtractedFlightData } from "../../interfaces/flight-data";
import { parseRouteCities } from "../../helper/city-iata";
import fs from "node:fs";

export async function extractFlightSearchParams(
  message: string,
  anthropic: AnthropicService,
): Promise<ExtractedFlightData | null> {
  try {
    const candidatePaths = [
      path.resolve(__dirname, "../../extractor/flight-data.md"), // ts-node (src/)
      path.resolve(__dirname, "../../../src/extractor/flight-data.md"), // compiled JS (dist/)
      path.resolve(process.cwd(), "src/extractor/flight-data.md"), // fallback
    ];

    const promptTemplatePath = candidatePaths.find((p) => fs.existsSync(p));

    if (!promptTemplatePath) {
      console.error("flight-data.md not found. Tried:", candidatePaths);
      return null;
    }

    const promptTemplate = fs.readFileSync(promptTemplatePath, "utf-8");
    const currentDate = new Date().toISOString().slice(0, 10);

    const prompt = promptTemplate
      .replace("{{CURRENT_DATE}}", currentDate)
      .replace("{{USER_QUERY}}", message);

    const response = await anthropic.complete({
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = response.text.trim();

    // Strip markdown code fences if Claude wraps response in ```json ... ```
    const cleaned = rawText
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "");

    const parsed: ExtractedFlightData = JSON.parse(cleaned);
    console.log(
      "extracted flight data -------------------------------->",
      parsed,
    );
    return fillMissingAirports(parsed, message);
  } catch (error) {
    console.error("extractFlightSearchParams error:", error);
    return null;
  }
}

function fillMissingAirports(
  parsed: ExtractedFlightData,
  query: string,
): ExtractedFlightData {
  const route = parseRouteCities(query);
  const origin = parsed.origin?.trim().toUpperCase() || route.origin || null;
  const destination =
    parsed.destination?.trim().toUpperCase() || route.destination || null;

  if (origin === parsed.origin && destination === parsed.destination) {
    return parsed;
  }

  return { ...parsed, origin, destination };
}

function lastUserText(messages: ChatMessage[]) {
  return [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
}

/** Returns tomorrow's date as YYYY-MM-DD, used as the default departure date. */
function getTomorrowYmd(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

/** Travelpayouts `depart_months` expects the first day of the month (YYYY-MM-01). */
function toDepartMonthsParam(ymOrYmd: string): string {
  const trimmed = ymOrYmd.trim();
  if (/^\d{4}-\d{2}-01$/.test(trimmed)) return trimmed;
  const monthMatch = /^(\d{4})-(\d{2})$/.exec(trimmed);
  if (monthMatch) return `${monthMatch[1]}-${monthMatch[2]}-01`;
  const dayMatch = /^(\d{4})-(\d{2})-\d{2}$/.exec(trimmed);
  if (dayMatch) return `${dayMatch[1]}-${dayMatch[2]}-01`;
  return trimmed;
}

/** Fallback when the LLM omits departureMonth for common month-only phrases. */
function inferDepartureMonthFromQuery(
  query: string,
  referenceYmd: string,
): string | null {
  const lower = query.toLowerCase();
  const ref = new Date(`${referenceYmd}T12:00:00`);

  if (/\bnext month\b/.test(lower)) {
    ref.setMonth(ref.getMonth() + 1);
    return `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, "0")}`;
  }

  if (/\bthis month\b/.test(lower)) {
    return `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, "0")}`;
  }

  return null;
}

function resolveDepartureTiming(
  parsed: ExtractedFlightData,
  query: string,
  referenceYmd: string,
): { departDate?: string; departMonth?: string } {
  if (parsed.departureDate) {
    return { departDate: parsed.departureDate };
  }

  const monthYm =
    parsed.departureMonth?.trim() ||
    inferDepartureMonthFromQuery(query, referenceYmd);

  if (monthYm) {
    return { departMonth: toDepartMonthsParam(monthYm) };
  }

  return { departDate: getTomorrowYmd() };
}

function cabinToTripClass(cabin: ExtractedFlightData["cabinClass"]) {
  switch (cabin) {
    case "business":
      return "C";
    case "first":
      return "F";
    case "premium_economy":
      return "W";
    case "economy":
    default:
      return "Y";
  }
}

export async function buildFlightSearchParams(
  messages: ChatMessage[],
  anthropic: AnthropicService,
): Promise<FlightSearchParams | null> {
  const text = lastUserText(messages).trim();
  if (!text) return null;

  const parsed = await extractFlightSearchParams(text, anthropic);

  if (!parsed?.origin || !parsed.destination) return null;

  const referenceYmd = new Date().toISOString().slice(0, 10);
  const { departDate, departMonth } = resolveDepartureTiming(
    parsed,
    text,
    referenceYmd,
  );

  const direct = parsed.maxStops === 0 ? true : undefined;

  return {
    origin: parsed.origin,
    destination: parsed.destination,
    departDate,
    departMonth,
    returnDate:
      parsed.tripType === "roundtrip"
        ? (parsed.returnDate ?? undefined)
        : undefined,
    adults: parsed.passengers?.adults ?? 1,
    direct,
    tripClass: cabinToTripClass(parsed.cabinClass),
    limit: FLIGHTS_PAGE_SIZE,
    offset: 0,
  };
}
