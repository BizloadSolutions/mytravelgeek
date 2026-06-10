import axios, { isAxiosError } from "axios";

const backendOrigin =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:3002";

export const api = axios.create({
  baseURL: `${backendOrigin}/api`,
  headers: { "Content-Type": "application/json" },
});

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { error?: string; message?: string | string[] }
      | undefined;

    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message)) return data.message.join(", ");
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
