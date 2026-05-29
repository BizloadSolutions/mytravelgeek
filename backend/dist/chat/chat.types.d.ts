export type ChatRole = "user" | "assistant";
export type ChatMessage = {
    role: ChatRole;
    content: string;
};
export type ChatRequest = {
    messages?: unknown;
};
export type { FlightsChatPayload } from "../integrations/flights/flight.types";
export type ChatResponse = {
    reply: string;
    flights?: import("../integrations/flights/flight.types").FlightsChatPayload;
};
