export type FlightStopSegment = {
  airlineName: string;
  /** IATA airline code for logo + name lookup on the frontend. */
  airlineIata?: string;
  airlineLogoUrl?: string;
  connectionNote?: string;
  departureTime: string;
  departureCity: string;
  arrivalTime: string;
  arrivalCity: string;
};

export type FlightOptionCard = {
  id: string;
  label: string;
  badge?: string;
  badgeVariant?: "best" | "cheapest";
  airlineName: string;
  /** IATA airline code for logo + name lookup on the frontend. */
  airlineIata?: string;
  airlineLogoUrl?: string;
  routeCode: string;
  travelDate: string;
  departureTime: string;
  departureCity: string;
  arrivalTime: string;
  arrivalCity: string;
  stopsLabel: string;
  metaLine: string;
  totalPrice: string;
  reserveUrl: string;
  stops?: FlightStopSegment[];
};

export type FlightSearchContext = {
  origin: string;
  destination: string;
  departMonth: string;
  departDate?: string;
  adults: number;
  noLowcost: boolean;
};

export type FlightsPagination = {
  hasMore: boolean;
  offset: number;
  limit: number;
  search: FlightSearchContext;
};

export type FlightsChatPayload = {
  routeTitle?: string;
  intro: string;
  cabinClass?: string;
  passengersLabel?: string;
  originCode?: string;
  destinationCode?: string;
  travelDateLabel?: string;
  flights: FlightOptionCard[];
  pagination?: FlightsPagination;
};

export type FlightSearchResponse = {
  payload: FlightsChatPayload | null;
  rawCount: number;
  hasMore: boolean;
};
