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
      path.resolve(__dirname, "../../extractor/flight-data.md"),
      path.resolve(__dirname, "../../../src/extractor/flight-data.md"),
      path.resolve(process.cwd(), "src/extractor/flight-data.md"),
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
    const cleaned = rawText
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "");

    const parsed: ExtractedFlightData = JSON.parse(cleaned);
    console.log(
      "extracted flight data -------------------------------->",
      parsed,
    );
    return normalizeExtractedFlightData(
      fillMissingAirports(parsed, message),
      message,
      currentDate,
    );
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

function getTomorrowYmd(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function addDaysYmd(ymd: string, days: number): string {
  const date = new Date(`${ymd}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function toDepartMonthsParam(ymOrYmd: string): string {
  const trimmed = ymOrYmd.trim();
  if (/^\d{4}-\d{2}-01$/.test(trimmed)) return trimmed;
  const monthMatch = /^(\d{4})-(\d{2})$/.exec(trimmed);
  if (monthMatch) return `${monthMatch[1]}-${monthMatch[2]}-01`;
  const dayMatch = /^(\d{4})-(\d{2})-\d{2}$/.exec(trimmed);
  if (dayMatch) return `${dayMatch[1]}-${dayMatch[2]}-01`;
  return trimmed;
}

function lastDayOfMonthYm(ym: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(ym.trim());
  if (!match) return ym;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const last = new Date(year, month, 0);
  return last.toISOString().slice(0, 10);
}

function inferRoundTrip(query: string): boolean {
  return /\b(return|round[\s-]?trip|there and back|and back|return journey|onward and return|come back|flying to .+ and (?:back|return))\b/i.test(
    query,
  );
}

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

function nextWeekendRange(referenceYmd: string): {
  depart: string;
  ret: string;
} {
  const ref = new Date(`${referenceYmd}T12:00:00`);
  const day = ref.getDay();
  const daysUntilNextSaturday = (6 - day + 7) % 7 || 7;
  const saturday = new Date(ref);
  saturday.setDate(ref.getDate() + daysUntilNextSaturday);
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  return {
    depart: saturday.toISOString().slice(0, 10),
    ret: sunday.toISOString().slice(0, 10),
  };
}

function nextFridaySunday(referenceYmd: string): {
  depart: string;
  ret: string;
} {
  const ref = new Date(`${referenceYmd}T12:00:00`);
  const day = ref.getDay();
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const friday = new Date(ref);
  friday.setDate(ref.getDate() + daysUntilFriday);
  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);
  return {
    depart: friday.toISOString().slice(0, 10),
    ret: sunday.toISOString().slice(0, 10),
  };
}

function normalizePassengers(
  parsed: ExtractedFlightData,
  query: string,
): ExtractedFlightData["passengers"] {
  let adults = Math.min(9, Math.max(1, parsed.passengers?.adults ?? 1));
  let children = Math.min(9, Math.max(0, parsed.passengers?.children ?? 0));
  let infants = Math.min(9, Math.max(0, parsed.passengers?.infants ?? 0));
  const lower = query.toLowerCase();

  if (
    /\b(myself and my|me and my)\s+(wife|husband|partner)\b/i.test(query) ||
    /\bmy wife\b|\bmy husband\b/i.test(lower)
  ) {
    adults = Math.max(adults, 2);
  }

  if (/\bmy parents\b/i.test(lower)) {
    adults = Math.max(adults, 2);
  }

  const familyOf = /\bfamily of\s+(\d+)\b/i.exec(query);
  if (familyOf) {
    adults = Math.min(9, Number(familyOf[1]));
  }

  const passengersCount = /\b(\d+)\s+passengers?\b/i.exec(query);
  if (passengersCount && adults === 1 && children === 0 && infants === 0) {
    adults = Math.min(9, Number(passengersCount[1]));
  }

  const travelersCount = /\b(\d+)\s+travelers?\b/i.exec(query);
  if (travelersCount && adults === 1 && children === 0 && infants === 0) {
    adults = Math.min(9, Number(travelersCount[1]));
  }

  if (/\bone traveler\b|\bone passenger\b/i.test(lower)) {
    adults = 1;
    children = 0;
    infants = 0;
  }

  if (/\ba couple\b/i.test(lower)) {
    adults = 2;
  }

  return { adults, children, infants };
}

function normalizeExtractedFlightData(
  parsed: ExtractedFlightData,
  query: string,
  referenceYmd: string,
): ExtractedFlightData {
  const tripType =
    parsed.tripType === "roundtrip" || inferRoundTrip(query)
      ? "roundtrip"
      : "oneway";

  let departureDate = parsed.departureDate;
  let departureMonth = parsed.departureMonth;
  let returnDate = parsed.returnDate;
  let returnMonth = parsed.returnMonth;

  if (/\bnext weekend\b/i.test(query) && tripType === "roundtrip") {
    const range = nextWeekendRange(referenceYmd);
    departureDate = departureDate ?? range.depart;
    returnDate = returnDate ?? range.ret;
  }

  if (
    /\bdeparting\s+friday\b.*\breturning\s+sunday\b/i.test(query) ||
    /\bfriday\b.*\breturn(?:ing)?\s+sunday\b/i.test(query)
  ) {
    const range = nextFridaySunday(referenceYmd);
    departureDate = departureDate ?? range.depart;
    returnDate = returnDate ?? range.ret;
  }

  const afterDays = /\b(?:return|come back)\s+after\s+(\d+)\s+days?\b/i.exec(
    query,
  );
  const forDays = /\bfor\s+(\d+)\s+days?\b/i.exec(query);

  if (!departureDate && !departureMonth) {
    departureMonth =
      departureMonth ?? inferDepartureMonthFromQuery(query, referenceYmd);
    if (!departureMonth) {
      departureDate = getTomorrowYmd();
    }
  }

  if (tripType === "roundtrip") {
    if (afterDays && departureDate) {
      returnDate =
        returnDate ?? addDaysYmd(departureDate, Number(afterDays[1]));
    } else if (forDays && departureDate) {
      returnDate = returnDate ?? addDaysYmd(departureDate, Number(forDays[1]));
    } else if (/\breturn the same week\b/i.test(query) && departureDate) {
      returnDate = returnDate ?? addDaysYmd(departureDate, 4);
    } else if (
      !returnDate &&
      !returnMonth &&
      (departureMonth || inferDepartureMonthFromQuery(query, referenceYmd))
    ) {
      const ym =
        departureMonth ??
        inferDepartureMonthFromQuery(query, referenceYmd) ??
        undefined;
      if (ym) {
        returnMonth = ym;
        departureMonth = departureMonth ?? ym;
      }
    } else if (!returnDate && departureDate) {
      returnDate = addDaysYmd(departureDate, 7);
    }
  }

  return {
    ...parsed,
    tripType,
    departureDate,
    departureMonth,
    returnDate,
    returnMonth,
    passengers: normalizePassengers(parsed, query),
  };
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

function resolveReturnDate(
  parsed: ExtractedFlightData,
  departDate?: string,
): string | undefined {
  if (parsed.tripType !== "roundtrip") return undefined;
  if (parsed.returnDate) return parsed.returnDate;

  if (parsed.returnMonth) {
    return lastDayOfMonthYm(parsed.returnMonth);
  }

  if (departDate) {
    return addDaysYmd(departDate, 7);
  }

  return undefined;
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
  let { departDate, departMonth } = resolveDepartureTiming(
    parsed,
    text,
    referenceYmd,
  );

  const isReturnFlight = parsed.tripType === "roundtrip";
  let returnDate = resolveReturnDate(parsed, departDate);

  if (isReturnFlight && departMonth && !departDate) {
    departDate = departMonth;
    if (!returnDate && parsed.returnMonth) {
      returnDate = lastDayOfMonthYm(parsed.returnMonth);
    } else if (!returnDate) {
      returnDate = lastDayOfMonthYm(
        parsed.departureMonth ??
          inferDepartureMonthFromQuery(text, referenceYmd) ??
          departMonth.slice(0, 7),
      );
    }
  }

  const direct = parsed.maxStops === 0 ? true : undefined;
  const passengers = parsed.passengers ?? {
    adults: 1,
    children: 0,
    infants: 0,
  };

  return {
    origin: parsed.origin,
    destination: parsed.destination,
    departDate,
    departMonth: departDate ? undefined : departMonth,
    returnDate: isReturnFlight ? returnDate : undefined,
    isReturnFlight,
    adults: passengers.adults,
    children: passengers.children,
    infants: passengers.infants,
    direct,
    tripClass: cabinToTripClass(parsed.cabinClass),
    limit: FLIGHTS_PAGE_SIZE,
    offset: 0,
  };
}
