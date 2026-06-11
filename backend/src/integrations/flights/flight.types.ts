export type FlightSearchContext = {
  origin: string;
  destination: string;
  departDate?: string;
  departMonth?: string;
  returnDate?: string;
  isReturnFlight?: boolean;
  adults: number;
  children?: number;
  infants?: number;
  direct?: boolean;
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
  return_at?: string;
  value?: number;
  ticket_link?: string;
  currency?: string;
  origin_city_iata?: string;
  origin_country_iata?: string;
  destination_airport_iata?: string;
  destination_city_iata?: string;
  /** Flight duration in minutes (outbound for round-trip). */
  duration?: number;
  main_airline?: string;
  provider?: string;
  number_of_changes?: number;
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
  /** Formatted return date for round-trip cards. */
  returnTravelDate?: string;
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

export type FlightCompensationLink = {
  id: string;
  label: string;
  url: string;
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
  /** Formatted return date for round-trip searches (header/intro). */
  returnTravelDateLabel?: string;
  isRoundTrip?: boolean;
  flights: FlightOptionCard[];
  searchMoreUrl?: string;
  /** Compensair — check eligibility for delay/cancellation compensation. */
  compensationLink?: FlightCompensationLink;
  pagination?: FlightsPagination;
};

export type FlightSearchResult = {
  payload: FlightsChatPayload | null;
  rawCount: number;
  hasMore: boolean;
};
