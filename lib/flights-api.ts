import { api, getApiErrorMessage } from "./api-client";
import type { FlightSearchContext, FlightSearchResponse } from "./flight-types";

export async function fetchFlightPage(
  search: FlightSearchContext,
  options: { limit: number; offset: number },
): Promise<FlightSearchResponse> {
  try {
    const { data } = await api.post<FlightSearchResponse>("/flights/search", {
      ...search,
      limit: options.limit,
      offset: options.offset,
    });

    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Could not load more flights."));
  }
}
