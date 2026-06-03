import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:3002";

function toErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "Something went wrong.";
  }
  const record = data as { error?: string; message?: string | string[] };
  if (typeof record.error === "string" && record.error.trim()) {
    return record.error;
  }
  if (typeof record.message === "string") return record.message;
  if (Array.isArray(record.message)) return record.message.join(", ");
  return "Something went wrong.";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: toErrorMessage(data) },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        error:
          "Travel Geek backend is unreachable. Please ensure it is running and accessible.",
      },
      { status: 503 },
    );
  }
}
