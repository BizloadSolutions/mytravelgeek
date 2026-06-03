import path from "node:path";
import type { ChatMessage } from "../../chat/chat.types";
import { FLIGHTS_PAGE_SIZE } from "../../helper/constant";
import type { AnthropicService } from "../../ai/anthropic.service";
import type { FlightSearchParams } from "./flight.types";
import type { FlightSearchParams as ExtractedFlightData } from "../../interfaces/flight-data";
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
    return parsed;
  } catch (error) {
    console.error("extractFlightSearchParams error:", error);
    return null;
  }
}

function lastUserText(messages: ChatMessage[]) {
  return [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
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

export function buildAlternateDepartMonths(primaryMonth: string) {
  const m = /^(\d{4})-(\d{2})-01$/.exec(primaryMonth);
  if (!m) return [primaryMonth];

  const year = Number(m[1]);
  const month = Number(m[2]);
  if (!year || month < 1 || month > 12) return [primaryMonth];

  const out: string[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = month - 1 + i;
    const y = year + Math.floor(idx / 12);
    const mm = String((idx % 12) + 1).padStart(2, "0");
    out.push(`${y}-${mm}-01`);
  }
  return out;
}

export async function buildFlightSearchParams(
  messages: ChatMessage[],
  anthropic: AnthropicService,
): Promise<FlightSearchParams | null> {
  const text = lastUserText(messages).trim();
  if (!text) return null;

  console.log("Just before extractFlightSearchParams....------------> ", text);

  const parsed = await extractFlightSearchParams(text, anthropic);
  console.log("After extractFlightSearchParams....------------> ", parsed);

  if (!parsed?.origin || !parsed.destination) return null;
  if (!parsed.departureDate) return null;

  const departMonth = `${parsed.departureDate.slice(0, 7)}-01`;
  const direct = parsed.maxStops === 0 ? true : undefined;
  const noLowcost = false;

  return {
    origin: parsed.origin,
    destination: parsed.destination,
    departMonth,
    departDate: parsed.departureDate,
    returnDate:
      parsed.tripType === "roundtrip"
        ? (parsed.returnDate ?? undefined)
        : undefined,
    adults: parsed.passengers?.adults ?? 1,
    noLowcost,
    direct,
    tripClass: cabinToTripClass(parsed.cabinClass),
    limit: FLIGHTS_PAGE_SIZE,
    offset: 0,
  };
}
