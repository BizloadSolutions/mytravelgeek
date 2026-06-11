import type { ChatIntentType } from "../chat/chat.types";
import type { FlightSearchParams } from "../integrations/flights/flight.types";
import {
  buildAviasalesMarkerUrl,
  buildAviasalesSearchUrl,
} from "./aviasales-url";

/** Default Aviasales marker URL — primary flight affiliate link. */
export const DEFAULT_AVIASALES_MARKER =
  "731063.Zz943a5344757846d987ba5de-731063";

export type TravelServiceType =
  | "flights"
  | "flight_insurance"
  | "hotels"
  | "activities"
  | "car_rental"
  | "airport_transfer"
  | "esim";

export type TravelLink = {
  id: string;
  label: string;
  url: string;
};

export type TravelAffiliateUrls = {
  aviasalesMarker: string;
  compensair: string;
  kkday: string;
  wegotrip: string;
  getrentacar: string;
  kiwiTaxi: string;
  yesim: string;
};

/** Compensair — EU flight delay/cancellation compensation (up to €600). */
export const DEFAULT_COMPENSAIR_URL = "https://compensair.tpm.lv/naYYi34N";

export const DEFAULT_TRAVEL_AFFILIATE_URLS: TravelAffiliateUrls = {
  aviasalesMarker: `https://www.aviasales.com/?marker=${DEFAULT_AVIASALES_MARKER}`,
  compensair: DEFAULT_COMPENSAIR_URL,
  kkday: "https://kkday.tpm.lv/5WnQK1ZT",
  wegotrip: "https://wegotrip.com",
  getrentacar: "https://getrentacar.com",
  kiwiTaxi: "https://kiwitaxi.com",
  yesim: "https://yesim.app",
};

/**
 * Detect travel services from the latest user message only.
 * Prior messages are ignored so a follow-up like "buy an eSIM" is not treated as a flight search.
 */
export function detectTravelServices(message: string): TravelServiceType[] {
  const text = message.trim();
  if (!text) return [];

  const services: TravelServiceType[] = [];

  if (isFlightServiceRequest(text)) services.push("flights");
  if (isFlightInsuranceServiceRequest(text)) services.push("flight_insurance");
  if (isHotelServiceRequest(text)) services.push("hotels");
  if (isActivitiesServiceRequest(text)) services.push("activities");
  if (isCarRentalServiceRequest(text)) services.push("car_rental");
  if (isAirportTransferServiceRequest(text)) services.push("airport_transfer");
  if (isEsimServiceRequest(text)) services.push("esim");

  return services;
}

/** Map classified chat intent to bookable travel services (affiliate CTAs). */
export function travelServicesForIntent(
  intent: ChatIntentType,
): TravelServiceType[] {
  switch (intent) {
    case "flight_search":
      return ["flights", "flight_insurance"];
    case "flight_insurance":
      return ["flight_insurance"];
    case "hotel_search":
      return ["hotels"];
    case "esim":
      return ["esim"];
    case "activities":
      return ["activities"];
    case "car_rental":
      return ["car_rental"];
    case "airport_transfer":
      return ["airport_transfer"];
    default:
      return [];
  }
}

/**
 * Services for affiliate buttons: keyword detection on the latest message,
 * plus the classified intent so every service query gets the right CTA.
 */
export function resolveTravelServices(
  message: string,
  intent: ChatIntentType,
): TravelServiceType[] {
  const services = [
    ...new Set([
      ...detectTravelServices(message),
      ...travelServicesForIntent(intent),
    ]),
  ];

  if (intent === "flight_insurance") {
    return services.filter((s) => s === "flight_insurance");
  }

  return services;
}

/** User wants to search or book flights (not a disruption/compensation question). */
export function isFlightBookingRequest(message: string): boolean {
  const text = message.toLowerCase();
  if (/\b[A-Z]{3}\s*(?:to|->|→|–|-)\s*[A-Z]{3}\b/i.test(message)) return true;
  if (/\bfrom\s+\w+.*\bto\s+\w+\b/i.test(text)) return true;
  return /\b(find|search|book|show\s+me|looking\s+for|need\s+(a\s+)?flight|cheapest|round[\s-]?trip|return\s+flight|flights?\s+from|flights?\s+to|fly\s+from|fly\s+to|airfare|one[- ]way)\b/i.test(
    text,
  );
}

/**
 * Compensair — claim compensation for delayed/cancelled flights, missed
 * connections, or denied boarding (EU, Turkey, Canada rules).
 */
export function isFlightInsuranceServiceRequest(message: string): boolean {
  const text = message.toLowerCase();

  if (
    /\b(flight\s+insurance|travel\s+insurance|trip\s+insurance|flight\s+protection|compensair|eu\s*261|up\s+to\s+€?\s*600)\b/i.test(
      text,
    )
  ) {
    return true;
  }

  if (
    /\b(flight\s+was\s+(cancelled|canceled|delayed)|flight\s+(got\s+)?(cancelled|canceled|delayed)|my\s+flight\s+was)\b/i.test(
      text,
    )
  ) {
    return true;
  }

  if (
    /\b(cancelled|canceled|delayed|denied\s+boarding|missed\s+connection)\b/i.test(
      text,
    ) &&
    /\b(flight|airline|plane|boarding)\b/i.test(text)
  ) {
    return true;
  }

  if (
    /\b(compensation|claim|refund|owed|entitled)\b/i.test(text) &&
    /\b(flight|airline|cancelled|canceled|delayed|boarding)\b/i.test(text)
  ) {
    return true;
  }

  return /\b(flight\s+compensation|compensation\s+for|delayed\s+flight|cancelled\s+flight|canceled\s+flight|denied\s+boarding|missed\s+connection|claim\s+compensation)\b/i.test(
    text,
  );
}

export function buildCompensairLink(urls: TravelAffiliateUrls): TravelLink {
  return {
    id: "compensair",
    label: "Check flight compensation",
    url: urls.compensair,
  };
}

export function isFlightServiceRequest(message: string): boolean {
  if (
    isFlightInsuranceServiceRequest(message) &&
    !isFlightBookingRequest(message)
  ) {
    return false;
  }

  const text = message.toLowerCase();
  if (/\b[A-Z]{3}\s*(?:to|->|→|–|-)\s*[A-Z]{3}\b/i.test(message)) return true;
  if (/\bfrom\s+\w+.*\bto\s+\w+\b/i.test(text)) return true;
  return (
    /\b(flight|flights|fly|flying|airfare|airline|airways|book\s+a\s+flight|cheapest\s+flight|one[- ]way|round\s*trip|cabin\s+class|business\s+class|economy\s+class|first\s+class|non[- ]stop|nonstop|direct\s+flight|layover|stopover|departure)\b/i.test(
      text,
    ) ||
    /\b(flight\s+ticket|airline\s+ticket|plane\s+ticket|air\s+ticket)\b/i.test(
      text,
    )
  );
}

export function isHotelServiceRequest(message: string): boolean {
  return /\b(hotel|hotels|hostel|hostels|resort|resorts|accommodation|accommodations|stay|staying|lodging|room|rooms|airbnb|vacation\s+rental|book\s+a\s+room|where\s+to\s+stay|check[- ]?in|check[- ]?out)\b/i.test(
    message,
  );
}

export function isActivitiesServiceRequest(message: string): boolean {
  return /\b(attraction|attractions|tour|tours|sightseeing|activit(?:y|ies)|museum|museums|zoo|(?:tour|activity|museum|zoo)\s+tickets?|experiences?|things\s+to\s+do|day\s+trip|excursion)\b/i.test(
    message,
  );
}

export function isCarRentalServiceRequest(message: string): boolean {
  const text = message.toLowerCase();
  if (
    /\b(uber|lyft|taxi|cab|rideshare|ride[\s-]?share|airport\s+transfer|shuttle\s+service)\b/i.test(
      text,
    )
  ) {
    return false;
  }
  return (
    /\b(car\s+rental|rental\s+car|car\s+hire|bike\s+rental|vehicle\s+hire|scooter\s+rental|rent\s+a\s+car|hire\s+a\s+car|rent\s+a\s+bike|hire\s+a\s+vehicle)\b/i.test(
      text,
    ) ||
    /\b(rent|hire|book|lease)\s+(a\s+)?(car|vehicle|bike|scooter)\b/i.test(
      text,
    ) ||
    /\b(renting|hiring)\s+(a\s+)?(car|vehicle|bike|scooter)\b/i.test(text) ||
    /\b(need|want|get|find|looking\s+for)\s+(a\s+)?(car|vehicle)\b/i.test(text)
  );
}

export function isAirportTransferServiceRequest(message: string): boolean {
  return /\b(airport\s+pickup|airport\s+transfer|hotel\s+transfer|transfer\s+from\s+(the\s+)?airport|transportation\s+from\s+(the\s+)?airport|airport\s+shuttle|private\s+transfer|pickup\s+from\s+(the\s+)?airport|drop\s+off\s+at\s+(the\s+)?airport)\b/i.test(
    message,
  );
}

export function isEsimServiceRequest(message: string): boolean {
  return /\b(e-?sim|sim\s+card|mobile\s+data|travel\s+internet|roaming\s+data|data\s+plan\s+abroad|purchase\s+(an?\s+)?e-?sim|buy\s+(an?\s+)?e-?sim)\b/i.test(
    message,
  );
}

export function buildAviasalesLink(
  urls: TravelAffiliateUrls,
  params: FlightSearchParams | null | undefined,
  envMarker?: string,
): TravelLink {
  const marker = envMarker?.trim() || DEFAULT_AVIASALES_MARKER;

  if (params?.origin && params.destination) {
    return {
      id: "aviasales",
      label: "Search flights on Aviasales",
      url: buildAviasalesSearchUrl(
        {
          origin: params.origin,
          destination: params.destination,
          departDate: params.departDate,
          returnDate: params.returnDate,
          adults: params.adults,
        },
        { marker },
      ),
    };
  }

  return {
    id: "aviasales",
    label: "Search flights on Aviasales",
    url: marker ? buildAviasalesMarkerUrl(marker) : urls.aviasalesMarker,
  };
}

/**
 * Build context-aware travel resource links in affiliate priority order.
 * Aviasales is always first when flights are relevant.
 */
export function buildTravelLinks(
  services: TravelServiceType[],
  options: {
    urls?: Partial<TravelAffiliateUrls>;
    flightParams?: FlightSearchParams | null;
    aviasalesMarker?: string;
    includeOptionalKkdayForFlights?: boolean;
  } = {},
): TravelLink[] {
  if (!services.length) return [];

  const urls: TravelAffiliateUrls = {
    ...DEFAULT_TRAVEL_AFFILIATE_URLS,
    ...options.urls,
  };
  const links: TravelLink[] = [];
  const seen = new Set<string>();

  const push = (link: TravelLink) => {
    if (seen.has(link.id)) return;
    seen.add(link.id);
    links.push(link);
  };

  if (services.includes("flights")) {
    push(
      buildAviasalesLink(urls, options.flightParams, options.aviasalesMarker),
    );
    push(buildCompensairLink(urls));
    if (options.includeOptionalKkdayForFlights !== false) {
      push({
        id: "kkday",
        label: "Explore travel packages on KKDay",
        url: urls.kkday,
      });
    }
  }

  if (services.includes("flight_insurance") && !services.includes("flights")) {
    push(buildCompensairLink(urls));
  }

  if (services.includes("hotels")) {
    push({
      id: "kkday",
      label: "Find stays and packages on KKDay",
      url: urls.kkday,
    });
  }

  if (services.includes("activities")) {
    push({
      id: "kkday",
      label: "Book tours and activities on KKDay",
      url: urls.kkday,
    });
    push({
      id: "wegotrip",
      label: "Discover audio tours on WeGoTrip",
      url: urls.wegotrip,
    });
  }

  if (services.includes("car_rental")) {
    push({
      id: "getrentacar",
      label: "Compare car rentals on GetRentacar",
      url: urls.getrentacar,
    });
  }

  if (services.includes("airport_transfer")) {
    push({
      id: "kiwi_taxi",
      label: "Book airport transfers on Kiwi Taxi",
      url: urls.kiwiTaxi,
    });
  }

  if (services.includes("esim")) {
    push({
      id: "yesim",
      label: "Get travel eSIM on Yesim",
      url: urls.yesim,
    });
  }

  return links;
}

/** Shared system-prompt rules for affiliate and competitor behavior. */
export const TRAVEL_ASSISTANT_RULES = [
  "Be a helpful travel assistant first — answer the question fully before suggesting booking options.",
  "Never mention affiliate, referral, sponsored, or commission.",
  "Never proactively recommend competitor booking platforms (Booking.com, Expedia, Agoda, Airbnb, Viator, etc.).",
  "Never include competitor links or competitor booking CTAs.",
  "Only discuss competitors when the user explicitly asks for a comparison — keep it informational, no links.",
].join("\n");
