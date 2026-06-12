// Airport utilities
export {
  getAirportInfo,
  getAirportCity,
  getAirportDisplayName,
  getFlightRouteDisplay,
  type AirportInfo,
} from "./airports";

// Airline utilities - 
export {
  getAirlineInfo,
  getAirlineName,
  getAirlineLogoUrl,
  type AirlineInfo,
} from "./airlines";

// Chat types and APIs
export type { ChatMessage, ChatResponse, ChatRequest } from "./all-types";
export { api } from "./api-client";
export { sendChatMessage } from "./chat-api";

// Flight types and APIs
export type {
  FlightSearchContext,
  FlightsPagination,
  FlightOptionCard,
  FlightsChatPayload,
  FlightSearchResponse,
  FlightStopSegment,
} from "./flight-types";
export { fetchFlightPage } from "./flights-api";
