import type { ChatMessage, ChatResponse } from "./chat-types";

type ChatErrorBody = {
  error?: string;
  message?: string | string[];
};

function parseErrorMessage(data: ChatErrorBody | undefined, fallback: string) {
  if (!data) return fallback;
  if (typeof data.error === "string" && data.error.trim()) return data.error;
  if (typeof data.message === "string") return data.message;
  if (Array.isArray(data.message)) return data.message.join(", ");
  return fallback;
}

export async function sendChatMessage(
  messages: ChatMessage[],
): Promise<ChatResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = (await response.json().catch(() => ({}))) as
    | ChatResponse
    | ChatErrorBody;

  if (!response.ok) {
    throw new Error(
      parseErrorMessage(
        data as ChatErrorBody,
        "Could not reach Travel Geek AI. Is the backend running?",
      ),
    );
  }

  if (!data || typeof (data as ChatResponse).reply !== "string") {
    throw new Error("Unexpected response from Travel Geek AI.");
  }

  return data as ChatResponse;
}
