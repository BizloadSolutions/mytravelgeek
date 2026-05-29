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

export type ChatResponse = {
  reply: string;
  flights?: FlightsChatPayload;
};
