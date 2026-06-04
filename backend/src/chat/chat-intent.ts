import type { ChatIntentType, ChatMessage } from "./chat.types";

export type ClassifiedChatIntentType = {
  intent: ChatIntentType;
  confidence: "high" | "medium" | "low";
  /** Short label for logs / debugging */
  reason: string;
  lastUserText: string;
};

function lastUserMessage(messages: ChatMessage[]) {
  return [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
}

function combinedUserText(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");
}

export function isFlightSearchRequest(message: string): boolean {
  // Keep this classifier consistent with the rest of this file:
  // it should work on the user's natural language (last message), not the raw message array.
  const text = message.toLowerCase();

  // Strong "route" patterns (IATA or "from X to Y") imply a flight query even if keyword is missing.
  if (/\b[A-Z]{3}\s*(?:to|->|→|–|-)\s*[A-Z]{3}\b/i.test(message)) return true;
  if (/\bfrom\s+\w+.*\bto\s+\w+\b/i.test(text)) return true;

  // General flight keywords
  return /\b(flight|flights|fly|flying|airfare|airline|airways|ticket|book\s+a\s+flight|cheapest\s+flight|one[- ]way|round\s*trip|cabin\s+class|business\s+class|economy\s+class|first\s+class|non[- ]stop|nonstop|direct\s+flight|layover|stopover|departure)\b/i.test(
    text,
  );
}

function isHotelRequest(text: string, fullText: string) {
  const hotelKw =
    /\b(hotel|hotels|hostel|hostels|resort|resorts|accommodation|accommodations|stay|staying|lodging|room|rooms|airbnb|vacation\s+rental|book\s+a\s+room|where\s+to\s+stay|check[- ]?in|check[- ]?out)\b/i;
  return hotelKw.test(text) || hotelKw.test(fullText);
}

function isDetailedItineraryRequest(text: string, fullText: string) {
  const t = text || fullText;
  return (
    /itinerar|itenar|itinerary|day[- ]?by[- ]?day|full\s+plan|custom\s+plan|complete\s+plan/.test(
      t,
    ) ||
    /road\s+trip/.test(t) ||
    /(\d+)\s*days?\s+(trip|itinerar|itinerary|in|to|from)/.test(t) ||
    (/plan\s+(me\s+)?(a\s+)?(trip|itinerar|itinerary)/.test(t) &&
      /day\s*\d|daily|schedule/.test(t))
  );
}

function isRestaurantsBarsRequest(text: string, fullText: string) {
  const t = `${text}\n${fullText}`;
  return (
    /\b(restaurant|restaurants|bar|bars|pub|nightlife|club|clubs|cafe|cafes|coffee|brunch|food|street\s+food|where\s+to\s+eat|best\s+food|best\s+restaurants?)\b/i.test(
      t,
    ) && !/\b(pack|packing|checklist|visa|passport)\b/i.test(t)
  );
}

function isTravelSafetyRequest(text: string, fullText: string) {
  const t = `${text}\n${fullText}`;
  return /\b(safety|safe|scam|scams|pickpocket|crime|avoid|danger|emergency|insurance|health\s+advice|vaccin|covid|solo\s+travel|women\s+travel|night\s+safety)\b/i.test(
    t,
  );
}

function isEstimatedRoutesRequest(text: string, fullText: string) {
  const t = `${text}\n${fullText}`;
  return /\b(route|routes|most\s+direct|fastest|how\s+to\s+get|how\s+do\s+i\s+reach|travel\s+time|distance|km|hours?|by\s+train|by\s+bus|by\s+car|drive|driving|road\s+route)\b/i.test(
    t,
  );
}

export function isChecklistRequest(text: string) {
  return (
    /packing|pack(ing)?\s+tips|what\s+to\s+pack|pack\s+kya|packign|packin/.test(
      text,
    ) ||
    /checklist|things\s+to\s+carry|puri\s+list|what\s+should\s+i\s+pack/.test(
      text,
    ) ||
    (/list|items/.test(text) &&
      /pack|carry|bring|essentials|toiletries/.test(text))
  );
}

function isPlaceInfoRequest(text: string) {
  return (
    /\b(things\s+to\s+do|what\s+to\s+do|places\s+to\s+visit|places\s+to\s+see|sightseeing|attractions|must\s+see|best\s+time\s+to\s+visit)\b/i.test(
      text,
    ) ||
    /\b(tell\s+me\s+about|about\s+[a-z]|information\s+about|info\s+on|guide\s+to|travel\s+guide)\b/i.test(
      text,
    ) ||
    /\b(best\s+(restaurants?|cafes?|food|beaches?|areas?|neighborhoods?)|where\s+to\s+eat|local\s+food|nightlife\s+in|weather\s+in|culture\s+of)\b/i.test(
      text,
    ) ||
    /\b(currency|language|visa|safety)\s+(in|for)\b/i.test(text)
  );
}

function isTripPlanRequest(text: string, fullText: string) {
  const t = text || fullText;
  if (isDetailedItineraryRequest(text, fullText)) return false;
  if (isPlaceInfoRequest(text) && !/plan|trip|itinerar/.test(text))
    return false;

  return (
    /\b(plan\s+(a\s+)?trip|trip\s+plan|plan\s+my\s+trip|plan\s+our\s+trip|help\s+me\s+plan|suggest\s+a\s+trip|weekend\s+in|vacation\s+in)\b/i.test(
      t,
    ) ||
    (/\b(plan|trip|travel|visit|going\s+to)\b/i.test(t) &&
      /\b(from\b.*\bto\b|for\s+\d+\s+days?)\b/i.test(t))
  );
}

function isOutOfScopeNonTravel(text: string, fullText: string) {
  const t = `${text}\n${fullText}`.toLowerCase();

  // Positive travel signals
  const travelKw =
    /\b(travel|trip|vacation|holiday|tour|itinerary|hotel|hostel|resort|flight|flights|airfare|airport|visa|passport|restaurant|bar|cafe|food|things\s+to\s+do|attractions|sightseeing|local\s+customs|weather|safety|best\s+time\s+to\s+visit)\b/i;
  const hasTravel = travelKw.test(t);
  if (hasTravel) return false;

  // Very common non-travel asks
  const nonTravelKw =
    /\b(code|coding|programming|bug|error|stack\s*trace|typescript|javascript|python|java|react|nestjs|database|sql|mongodb|docker|kubernetes|linux|windows|macos|resume|cv|cover\s+letter|math|physics|chemistry|stock|crypto|trading|investment|relationship|girlfriend|boyfriend|medical|diagnosis|lawyer|legal)\b/i;

  // If user is asking for something clearly unrelated and we have no travel signals, refuse.
  return nonTravelKw.test(t);
}

/**
 * Classify the user's goal from the full conversation (not only the last line).
 * Priority: flight → hotel → itinerary → checklist → place info → trip plan → general
 */
export function classifyChatIntentType(
  messages: ChatMessage[],
): ClassifiedChatIntentType {
  const lastUser = lastUserMessage(messages).trim();
  const text = lastUser.toLowerCase();
  const fullText = combinedUserText(messages).toLowerCase();

  if (isFlightSearchRequest(lastUser) || isFlightSearchRequest(fullText)) {
    const routePresent = /\b[A-Z]{3}\s*(?:to|->|→|–|-)\s*[A-Z]{3}\b/i.test(
      lastUser,
    );
    return {
      intent: "flight_search",
      confidence: routePresent ? "high" : "medium",
      reason: routePresent
        ? "flight route detected"
        : "flight keywords detected",
      lastUserText: lastUser,
    };
  }

  if (isHotelRequest(text, fullText)) {
    return {
      intent: "hotel_search",
      confidence: "high",
      reason: "hotel / stay search",
      lastUserText: lastUser,
    };
  }

  if (isRestaurantsBarsRequest(text, fullText)) {
    return {
      intent: "restaurants_bars",
      confidence: "high",
      reason: "restaurants / bars / nightlife",
      lastUserText: lastUser,
    };
  }

  if (isTravelSafetyRequest(text, fullText)) {
    return {
      intent: "travel_safety",
      confidence: "high",
      reason: "safety / scams / emergency",
      lastUserText: lastUser,
    };
  }

  if (isDetailedItineraryRequest(text, fullText)) {
    return {
      intent: "itinerary",
      confidence: "high",
      reason: "detailed day-by-day itinerary",
      lastUserText: lastUser,
    };
  }

  if (isChecklistRequest(text)) {
    return {
      intent: "checklist",
      confidence: "high",
      reason: "packing / checklist",
      lastUserText: lastUser,
    };
  }

  if (isPlaceInfoRequest(text)) {
    return {
      intent: "place_info",
      confidence: "high",
      reason: "place / destination information",
      lastUserText: lastUser,
    };
  }

  if (isTripPlanRequest(text, fullText)) {
    return {
      intent: "trip_plan",
      confidence: "medium",
      reason: "general trip planning",
      lastUserText: lastUser,
    };
  }

  if (isEstimatedRoutesRequest(text, fullText)) {
    return {
      intent: "estimated_routes_to_visit",
      confidence: "medium",
      reason: "routes / transport / travel time",
      lastUserText: lastUser,
    };
  }

  if (isOutOfScopeNonTravel(text, fullText)) {
    return {
      intent: "out_of_scope",
      confidence: "high",
      reason: "non-travel request detected",
      lastUserText: lastUser,
    };
  }

  return {
    intent: "general",
    confidence: "low",
    reason: "general travel chat",
    lastUserText: lastUser,
  };
}
