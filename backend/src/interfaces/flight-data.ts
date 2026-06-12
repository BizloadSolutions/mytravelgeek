export interface FlightSearchParams {
  intent: "flight_search";
  tripType: "oneway" | "roundtrip";
  origin: string | null;
  destination: string | null;
  departureDate: string | null;
  departureMonth: string | null;
  returnDate: string | null;
  /** YYYY-MM when return month is named without a specific day. */
  returnMonth: string | null;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: "economy" | "premium_economy" | "business" | "first";
  preferredAirline: string | null;
  currency: string | null;
  maxStops: number | null;
  maxPrice: number | null;
}
