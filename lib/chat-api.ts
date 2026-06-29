import { api, getApiErrorMessage } from "./api-client";
import type { ChatMessage, ChatResponse } from "./all-types";

export async function sendChatMessage(
  messages: ChatMessage[],
): Promise<ChatResponse> {
  try {
    const { data } = await api.post<ChatResponse>("/chat", {
      messages: messages.map(({ role, content }) => ({ role, content })),
    });

    if (!data || typeof data.reply !== "string") {
      throw new Error("Unexpected response from Travel Geek AI.");
    }

    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Could not reach Travel Geek AI. Is the backend running?",
      ),
    );
  }
}
