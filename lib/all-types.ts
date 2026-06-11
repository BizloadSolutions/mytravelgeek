import type { FlightsChatPayload } from "./flight-types";

export type ChatRole = "user" | "assistant";

export type FlightSearchFallback = {
  searchUrl: string;
};

export type TravelLink = {
  id: string;
  label: string;
  url: string;
};

export type ChatMessage = {
  role: ChatRole;
  content: string;
  flights?: FlightsChatPayload;
  flightFallback?: FlightSearchFallback;
  travelLinks?: TravelLink[];
};

export type ChatRequest = {
  messages: ChatMessage[];
};

export type ChatIntentType =
  | "flight_search"
  | "flight_insurance"
  | "hotel_search"
  | "esim"
  | "activities"
  | "car_rental"
  | "airport_transfer"
  | "itinerary"
  | "checklist"
  | "place_info"
  | "trip_plan"
  | "general";

export type ChatResponse = {
  reply: string;
  intent?: ChatIntentType;
  flights?: FlightsChatPayload;
  flightFallback?: FlightSearchFallback;
  travelLinks?: TravelLink[];
};
