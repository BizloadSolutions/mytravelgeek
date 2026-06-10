import type { ChatIntentType, ChatMessage } from "./chat.types";
import {
  isActivitiesServiceRequest,
  isAirportTransferServiceRequest,
  isCarRentalServiceRequest,
  isEsimServiceRequest,
  isFlightServiceRequest,
  isHotelServiceRequest,
} from "../helper/travel-affiliates";

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

/** @deprecated Use isFlightServiceRequest from travel-affiliates */
export function isFlightSearchRequest(message: string): boolean {
  return isFlightServiceRequest(message);
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

  const travelKw =
    /\b(travel|trip|vacation|holiday|tour|itinerary|hotel|hostel|resort|flight|flights|airfare|airport|visa|passport|restaurant|bar|cafe|food|things\s+to\s+do|attractions|sightseeing|local\s+customs|weather|safety|best\s+time\s+to\s+visit|e-?sim|sim\s+card)\b/i;
  const hasTravel = travelKw.test(t);
  if (hasTravel) return false;

  const nonTravelKw =
    /\b(code|coding|programming|bug|error|stack\s*trace|typescript|javascript|python|java|react|nestjs|database|sql|mongodb|docker|kubernetes|linux|windows|macos|resume|cv|cover\s+letter|math|physics|chemistry|stock|crypto|trading|investment|relationship|girlfriend|boyfriend|medical|diagnosis|lawyer|legal)\b/i;

  return nonTravelKw.test(t);
}

/**
 * Classify the user's goal from the latest message.
 * Earlier turns are not used for flight/hotel/eSIM/etc. so follow-ups stay on-topic.
 */
export function classifyChatIntentType(
  messages: ChatMessage[],
): ClassifiedChatIntentType {
  const lastUser = lastUserMessage(messages).trim();
  const text = lastUser.toLowerCase();
  const fullText = combinedUserText(messages).toLowerCase();

  if (isFlightServiceRequest(lastUser)) {
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

  if (isEsimServiceRequest(lastUser)) {
    return {
      intent: "esim",
      confidence: "high",
      reason: "eSIM / mobile data request",
      lastUserText: lastUser,
    };
  }

  if (isHotelServiceRequest(lastUser)) {
    return {
      intent: "hotel_search",
      confidence: "high",
      reason: "hotel / stay search",
      lastUserText: lastUser,
    };
  }

  if (isCarRentalServiceRequest(lastUser)) {
    return {
      intent: "car_rental",
      confidence: "high",
      reason: "car / vehicle rental",
      lastUserText: lastUser,
    };
  }

  if (isAirportTransferServiceRequest(lastUser)) {
    return {
      intent: "airport_transfer",
      confidence: "high",
      reason: "airport / hotel transfer",
      lastUserText: lastUser,
    };
  }

  if (isActivitiesServiceRequest(lastUser)) {
    return {
      intent: "activities",
      confidence: "high",
      reason: "tours / activities / attractions",
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
