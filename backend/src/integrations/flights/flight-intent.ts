import type { ChatMessage } from "../../chat/chat.types";
import { AIRPORTS, resolveAirportCode } from "./airport-codes";
import { FLIGHTS_PAGE_SIZE } from "../../helper/constant";
import type { FlightSearchParams } from "./flight.types";

const KNOWN_CODES = new Set(AIRPORTS.map((a) => a.code));

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatMonthStart(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-01`;
}

const WEEKDAY_INDEX: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

/** Next occurrence of a weekday strictly in the future (e.g. "next Monday"). */
function nextWeekdayFrom(text: string, from = new Date()): Date | null {
  const match = text.match(
    /\b(?:next|upcoming|upcomming|this)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  );
  if (!match) return null;

  const key = match[1].slice(0, 3).toLowerCase();
  const target = WEEKDAY_INDEX[key];
  if (target === undefined) return null;

  const d = new Date(from);
  const current = d.getDay();
  let daysAhead = target - current;
  if (daysAhead <= 0) daysAhead += 7;
  if (/\bthis\s+/i.test(match[0]) && daysAhead === 7) {
    daysAhead = 0;
  }
  d.setDate(d.getDate() + daysAhead);
  return d;
}

export function addDepartMonths(monthStart: string, months: number): string {
  const [year, month] = monthStart.split("-").map(Number);
  const d = new Date(year, month - 1 + months, 1);
  return formatMonthStart(d);
}

function combinedUserText(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");
}

function isKnownIata(code: string) {
  return KNOWN_CODES.has(code.toUpperCase());
}

/** Collect IATA codes in order of appearance (known airports only). */
export function findAirportCodesInText(text: string): string[] {
  const upper = text.toUpperCase();
  const found: string[] = [];
  const seen = new Set<string>();

  const arrow =
    upper.match(/\b([A-Z]{3})\s*(?:→|->|–|—|-)\s*([A-Z]{3})\b/) ??
    upper.match(/\b([A-Z]{3})\s+TO\s+([A-Z]{3})\b/);

  if (arrow) {
    for (const code of [arrow[1], arrow[2]]) {
      if (isKnownIata(code) && !seen.has(code)) {
        seen.add(code);
        found.push(code);
      }
    }
    if (found.length === 2) return found;
  }

  for (const match of upper.matchAll(/\b([A-Z]{3})\b/g)) {
    const code = match[1];
    if (isKnownIata(code) && !seen.has(code)) {
      seen.add(code);
      found.push(code);
    }
  }

  return found;
}

export function extractRouteFromText(text: string): {
  origin: string | null;
  destination: string | null;
} {
  const codes = findAirportCodesInText(text);
  if (codes.length >= 2) {
    return { origin: codes[0], destination: codes[1] };
  }

  const fromTo =
    text.match(
      /\bfrom\s+([a-zA-Z\s]+?)\s+to\s+([a-zA-Z\s]+?)(?:\s+on|\s+for|,|\.|$)/i,
    ) ??
    text.match(
      /\bflight\s+([a-zA-Z\s]+?)\s+to\s+([a-zA-Z\s]+?)(?:\s+for|\s+on|\s+next|\s+upcoming|\s+upcomming|,|\.|$)/i,
    ) ??
    text.match(
      /\b([a-zA-Z][a-zA-Z\s]{1,30}?)\s+to\s+([a-zA-Z][a-zA-Z\s]{1,30}?)(?:\s+for|\s+on|\s+next|\s+upcoming|\s+upcomming|,|\.|$|\s+tomorrow|\s+today)/i,
    );
  if (fromTo) {
    const origin = resolveAirportCode(fromTo[1]);
    const destination = resolveAirportCode(fromTo[2]);
    if (origin && destination) return { origin, destination };
  }

  if (codes.length === 1) {
    return { origin: null, destination: codes[0] };
  }

  const origin = resolveAirportCode(text.split(/\bto\b/i)[0] ?? text);
  const afterTo = text.split(/\bto\b/i)[1];
  const destination = afterTo ? resolveAirportCode(afterTo) : null;

  return { origin, destination };
}

function parseDepartMonth(text: string): string {
  const lower = text.toLowerCase();

  const weekdayDate = nextWeekdayFrom(text);
  if (weekdayDate) {
    return formatMonthStart(weekdayDate);
  }

  if (/\bnext week\b/.test(lower)) {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return formatMonthStart(d);
  }

  if (/\btomorrow\b/.test(lower)) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatMonthStart(d);
  }

  if (/\btoday\b/.test(lower)) {
    return formatMonthStart(new Date());
  }

  const iso = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) return `${iso[1]}-${iso[2]}-01`;

  const dmy = text.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](20\d{2})\b/);
  if (dmy) return `${dmy[3]}-${pad(Number(dmy[2]))}-01`;

  const named = text.match(
    /\b(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*(20\d{2})?\b/i,
  );
  if (named) {
    const months: Record<string, number> = {
      jan: 1,
      feb: 2,
      mar: 3,
      apr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      aug: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dec: 12,
    };
    const month = months[named[2].slice(0, 3).toLowerCase()] ?? 1;
    const year = named[3] ? Number(named[3]) : new Date().getFullYear();
    return `${year}-${pad(month)}-01`;
  }

  return formatMonthStart(new Date());
}

function parseAdults(text: string) {
  const m = text.match(/(\d+)\s*adults?/i);
  if (m) return Math.min(Number(m[1]), 9);
  if (/\bcouple\b/i.test(text)) return 2;
  return 1;
}

export function isFlightSearchRequest(messages: ChatMessage[]) {
  const text = combinedUserText(messages).toLowerCase();

  const hasFlightKeyword =
    /\b(flight|flights|airfare|air fare|plane ticket|fly|flying|airline)\b/.test(
      text,
    );

  const hasRoutePattern =
    /\b[a-z]{3}\s*(?:→|->|–|—|-|to)\s*[a-z]{3}\b/i.test(text) ||
    findAirportCodesInText(text).length >= 2;

  const hasSearchIntent =
    /\b(search|find|compare|book|show|need|want|looking|options|cheapest|best|help)\b/.test(
      text,
    ) || /\bfrom\b.*\bto\b/.test(text);

  if (hasFlightKeyword && (hasSearchIntent || hasRoutePattern)) {
    return true;
  }

  if (hasRoutePattern && hasSearchIntent) {
    return true;
  }

  if (hasRoutePattern && hasFlightKeyword) {
    return true;
  }

  if (hasRoutePattern) {
    const hasTravelTiming =
      /\b(tomorrow|today|tonight|morning|evening|afternoon|next week|next\s+monday|upcoming\s+monday|upcomming\s+monday)\b/.test(
        text,
      ) ||
      /\b(?:next|upcoming|upcomming)\s+(?:mon|tue|wed|thu|fri|sat|sun)/.test(
        text,
      ) ||
      /\b(20\d{2}|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/.test(
        text,
      );
    if (hasTravelTiming || hasFlightKeyword) {
      return true;
    }
  }

  return (
    hasFlightKeyword &&
    findAirportCodesInText(text).length >= 1 &&
    hasSearchIntent
  );
}

export function buildFlightSearchParams(
  messages: ChatMessage[],
): FlightSearchParams | null {
  const userText = combinedUserText(messages);
  const { origin, destination } = extractRouteFromText(userText);

  if (!origin || !destination || origin === destination) {
    return null;
  }

  return {
    origin,
    destination,
    departMonth: parseDepartMonth(userText),
    adults: parseAdults(userText),
    noLowcost: !/\blow[- ]?cost\b/i.test(userText),
    limit: FLIGHTS_PAGE_SIZE,
    offset: 0,
  };
}

export function isLoadMoreFlightsRequest(messages: ChatMessage[]) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = lastUser?.content.toLowerCase() ?? "";
  return /\b(show|see|load|get|find)\s+(me\s+)?(more|another|additional)\s+(flight|flights|options)\b/.test(
    text,
  );
}
