export const OPEN_CHAT_EVENT = "travelgeek:open-chat";

export type OpenChatDetail = { query?: string };

export function requestOpenChatModal(query = "") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<OpenChatDetail>(OPEN_CHAT_EVENT, {
      detail: { query },
    }),
  );
}
