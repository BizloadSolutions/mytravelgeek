export type FlightSearchContext = {
  origin: string;
  destination: string;
  /** When set, only flights departing on this calendar day (YYYY-MM-DD) are returned. */
  departDate?: string;
  /** When set, use round-trip search with exact return date (YYYY-MM-DD). */
  returnDate?: string;
  adults: number;
  noLowcost: boolean;
  /** If true, request direct flights only (when supported by API). */
  direct?: boolean;
  /** Cabin class for Travelpayouts GraphQL (e.g. Y/C/F/W). */
  tripClass?: string;
};

export type FlightSearchParams = FlightSearchContext & {
  limit: number;
  offset: number;
};

export type FlightsPagination = {
  hasMore: boolean;
  offset: number;
  limit: number;
  search: FlightSearchContext;
};

export type TravelpayoutsPriceRow = {
  departure_at?: string;
  value?: number;
  ticket_link?: string;
  currency?: string;
  origin_city_iata?: string;
  origin_country_iata?: string;
  destination_airport_iata?: string;
  destination_city_iata?: string;
  /** Flight duration in minutes. */
  duration?: number;
  main_airline?: string;
  provider?: string;
};

export type FlightStopSegment = {
  airlineName: string;
  airlineIata?: string;
  airlineLogoUrl?: string;
  connectionNote?: string;
  departureTime: string;
  departureCity: string;
  arrivalCity: string;
};

export type FlightOptionCard = {
  id: string;
  label: string;
  badge?: string;
  badgeVariant?: "best" | "cheapest";
  airlineName: string;
  airlineIata?: string;
  airlineLogoUrl?: string;
  routeCode: string;
  travelDate: string;
  departureTime: string;
  /** Arrival time, derived from departure + duration. */
  arrivalTime: string;
  /** Total trip duration, e.g. "1h 5m". Empty when unknown. */
  durationLabel: string;
  departureCity: string;
  arrivalCity: string;
  stopsLabel: string;
  metaLine: string;
  totalPrice: string;
  reserveUrl: string;
  stops?: FlightStopSegment[];
};

export type FlightsChatPayload = {
  routeTitle?: string;
  intro: string;
  /** Shown when results are from a different month than requested. */
  availabilityNote?: string;
  cabinClass: string;
  passengersLabel: string;
  originCode: string;
  destinationCode: string;
  travelDateLabel: string;
  flights: FlightOptionCard[];
  pagination?: FlightsPagination;
};

export type FlightSearchResult = {
  payload: FlightsChatPayload | null;
  rawCount: number;
  hasMore: boolean;
};
