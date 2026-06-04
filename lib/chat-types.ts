import type { FlightsChatPayload } from "./flight-types";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
  flights?: FlightsChatPayload;
};

export type ChatRequest = {
  messages: ChatMessage[];
};

export type ChatIntentType =
  | "flight_search"
  | "hotel_search"
  | "itinerary"
  | "checklist"
  | "place_info"
  | "trip_plan"
  | "general";

export type ChatResponse = {
  reply: string;
  intent?: ChatIntentType;
  flights?: FlightsChatPayload;
};
