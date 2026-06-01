import type { ChatMessage } from "../../chat/chat.types";
import { AIRPORTS, resolveAirportCode } from "./airport-codes";
import { FLIGHTS_PAGE_SIZE } from "../../helper/constant";
import type { FlightSearchParams } from "./flight.types";

const KNOWN_CODES = new Set(AIRPORTS.map((a) => a.code));

const MONTH_BY_TOKEN: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatMonthStart(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-01`;
}

export function formatDateYmd(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(from: Date, days: number) {
  const d = startOfDay(from);
  d.setDate(d.getDate() + days);
  return d;
}

export type DepartSchedule = {
  departMonth: string;
  departDate: string | null;
};

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

  const d = startOfDay(from);
  const current = d.getDay();
  let daysAhead = target - current;
  if (daysAhead <= 0) daysAhead += 7;
  if (/\bthis\s+/i.test(match[0]) && daysAhead === 7) {
    daysAhead = 0;
  }
  d.setDate(d.getDate() + daysAhead);
  return d;
}

function monthTokenToNumber(token: string): number | null {
  const key = token.toLowerCase().replace(/\./g, "");
  return MONTH_BY_TOKEN[key] ?? MONTH_BY_TOKEN[key.slice(0, 3)] ?? null;
}

function scheduleForDate(date: Date): DepartSchedule {
  const d = startOfDay(date);
  return {
    departMonth: formatMonthStart(d),
    departDate: formatDateYmd(d),
  };
}

function parseMonthOnly(text: string): DepartSchedule | null {
  const lower = text.toLowerCase();

  const yearMonth = text.match(/\b(20\d{2})-(\d{2})\b(?!-\d{2})/);
  if (yearMonth) {
    const year = Number(yearMonth[1]);
    const month = Number(yearMonth[2]);
    if (month >= 1 && month <= 12) {
      return {
        departMonth: `${year}-${pad(month)}-01`,
        departDate: null,
      };
    }
  }

  const monthYear = lower.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s*(20\d{2})\b/,
  );
  if (monthYear && !/\b\d{1,2}\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(lower)) {
    const month = monthTokenToNumber(monthYear[1]);
    if (month) {
      return {
        departMonth: `${Number(monthYear[2])}-${pad(month)}-01`,
        departDate: null,
      };
    }
  }

  const yearMonthName = lower.match(
    /\b(20\d{2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/,
  );
  if (yearMonthName) {
    const month = monthTokenToNumber(yearMonthName[2]);
    if (month) {
      return {
        departMonth: `${Number(yearMonthName[1])}-${pad(month)}-01`,
        departDate: null,
      };
    }
  }

  return null;
}

/**
 * Resolve departure month (API) and optional exact day (filter) from user text.
 * Default when no date is given: tomorrow.
 */
export function parseDepartSchedule(text: string): DepartSchedule {
  const lower = text.toLowerCase();
  const today = startOfDay(new Date());

  const iso = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) {
    return scheduleForDate(
      new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])),
    );
  }

  const dmy = text.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](20\d{2})\b/);
  if (dmy) {
    return scheduleForDate(
      new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])),
    );
  }

  const mdy = text.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})\b/);
  if (mdy) {
    const year = 2000 + Number(mdy[3]);
    return scheduleForDate(
      new Date(year, Number(mdy[1]) - 1, Number(mdy[2])),
    );
  }

  const namedDayFirst = text.match(
    /\b(\d{1,2})(?:st|nd|rd|th)?\s*(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\.?(?:\s*(20\d{2}))?\b/i,
  );
  if (namedDayFirst) {
    const month = monthTokenToNumber(namedDayFirst[2]);
    if (month) {
      const year = namedDayFirst[3]
        ? Number(namedDayFirst[3])
        : today.getFullYear();
      return scheduleForDate(
        new Date(year, month - 1, Number(namedDayFirst[1])),
      );
    }
  }

  const namedMonthFirst = text.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*(20\d{2}))?\b/i,
  );
  if (namedMonthFirst) {
    const month = monthTokenToNumber(namedMonthFirst[1]);
    if (month) {
      const year = namedMonthFirst[3]
        ? Number(namedMonthFirst[3])
        : today.getFullYear();
      return scheduleForDate(
        new Date(year, month - 1, Number(namedMonthFirst[2])),
      );
    }
  }

  if (/\b(day after tomorrow|the day after tomorrow)\b/.test(lower)) {
    return scheduleForDate(addDays(today, 2));
  }

  if (/\btomorrow\b/.test(lower)) {
    return scheduleForDate(addDays(today, 1));
  }

  if (/\b(today|tonight)\b/.test(lower)) {
    return scheduleForDate(today);
  }

  const weekdayDate = nextWeekdayFrom(text, today);
  if (weekdayDate) {
    return scheduleForDate(weekdayDate);
  }

  if (/\bnext week\b/.test(lower)) {
    return scheduleForDate(addDays(today, 7));
  }

  const monthOnly = parseMonthOnly(text);
  if (monthOnly) {
    return monthOnly;
  }

  return scheduleForDate(addDays(today, 1));
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
      /\b(tomorrow|today|tonight|morning|evening|afternoon|next week|day after tomorrow|next\s+monday|upcoming\s+monday|upcomming\s+monday)\b/.test(
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

  const { departMonth, departDate } = parseDepartSchedule(userText);

  return {
    origin,
    destination,
    departMonth,
    ...(departDate ? { departDate } : {}),
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
