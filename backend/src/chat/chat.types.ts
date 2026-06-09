export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  messages?: unknown;
};

export type ChatIntentType =
  | "flight_search"
  | "hotel_search"
  | "itinerary"
  | "restaurants_bars"
  | "travel_safety"
  | "checklist"
  | "place_info"
  | "trip_plan"
  | "estimated_routes_to_visit"
  | "out_of_scope"
  | "general";

export type { FlightsChatPayload } from "../integrations/flights/flight.types";

export type FlightSearchFallback = {
  searchUrl: string;
};

export type ChatResponse = {
  reply: string;
  /** What we understood the user wants (helps UI / debugging). */
  intent?: ChatIntentType;
  flights?: import("../integrations/flights/flight.types").FlightsChatPayload;
  flightFallback?: FlightSearchFallback;
};
