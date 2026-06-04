import type { FlightSearchContext, FlightSearchResponse } from "./flight-types";

export async function fetchFlightPage(
  search: FlightSearchContext,
  options: { limit: number; offset: number },
): Promise<FlightSearchResponse> {
  const response = await fetch("/api/flights/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...search,
      limit: options.limit,
      offset: options.offset,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as
    | FlightSearchResponse
    | { error?: string; message?: string };

  if (!response.ok) {
    const err = data as { error?: string; message?: string };
    throw new Error(err.error || err.message || "Could not load more flights.");
  }

  return data as FlightSearchResponse;
}
