"use client";

import React, { useEffect, useState } from "react";
import { fetchFlightPage } from "@/lib/flights-api";
import type {
  FlightOptionCard,
  FlightsChatPayload,
  FlightStopSegment,
  FlightsPagination,
} from "@/lib/flight-types";

const DEFAULT_FLIGHTS: FlightOptionCard[] = [
  {
    id: "demo-1",
    label: "Flight 1 – Best",
    badge: "BEST",
    badgeVariant: "best",
    airlineName: "AirAsia",
    routeCode: "DEL > BKK",
    travelDate: "May 30, 26",
    departureTime: "8:55 PM",
    departureCity: "Delhi",
    arrivalTime: "2:40 AM",
    arrivalCity: "Bangkok",
    stopsLabel: "Non-stop",
    metaLine: "AirAsia • Economy • Non-stop • 4h 15m",
    totalPrice: "₹28,245",
    reserveUrl: "https://www.aviasales.com/",
  },
  {
    id: "demo-2",
    label: "Flight 2",
    badge: "CHEAPEST",
    badgeVariant: "cheapest",
    airlineName: "Thai Airways",
    routeCode: "DEL > BKK",
    travelDate: "May 30, 26",
    departureTime: "6:10 AM",
    departureCity: "Delhi",
    arrivalTime: "11:45 AM",
    arrivalCity: "Bangkok",
    stopsLabel: "1 stop",
    metaLine: "Thai Airways • Economy • 1 stop • 5h 35m",
    totalPrice: "₹31,120",
    reserveUrl: "https://www.aviasales.com/",
    stops: [
      {
        airlineName: "Thai Airways",
        connectionNote: "2h connect in airport",
        departureTime: "6:10 AM",
        departureCity: "Delhi",
        arrivalTime: "8:30 AM",
        arrivalCity: "Singapore",
      },
      {
        airlineName: "Thai Airways",
        departureTime: "10:30 AM",
        departureCity: "Singapore",
        arrivalTime: "11:45 AM",
        arrivalCity: "Bangkok",
      },
    ],
  },
];

const DEFAULT_PAYLOAD: FlightsChatPayload = {
  routeTitle: "Bangkok",
  intro:
    "I found the following flights in Economy class for 2 adults from DEL to BKK on May 30th:",
  cabinClass: "Economy",
  passengersLabel: "2 adults",
  originCode: "DEL",
  destinationCode: "BKK",
  travelDateLabel: "May 30th",
  flights: DEFAULT_FLIGHTS,
};

type Props = Partial<FlightsChatPayload>;

function FlightPathGraphic({ stopsLabel }: { stopsLabel: string }) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5">
      <svg
        width="70"
        height="12"
        viewBox="0 0 70 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <line y1="6" x2="70" y2="6" stroke="#E5E7EB" strokeDasharray="3 3" />
        <path
          d="M33.8737 1.125H33.2498C33.1871 1.12502 33.1254 1.14076 33.0703 1.17077C33.0153 1.20078 32.9687 1.24412 32.9347 1.29681C32.9007 1.3495 32.8805 1.40986 32.8759 1.47238C32.8713 1.5349 32.8824 1.59758 32.9083 1.65469L34.4191 4.98867L32.1505 5.03906L31.3232 4.03664C31.1655 3.83836 31.0396 3.75 30.7185 3.75H30.2985C30.232 3.74786 30.166 3.76178 30.106 3.79059C30.046 3.81939 29.9939 3.86223 29.954 3.91547C29.8982 3.9907 29.8434 4.1182 29.8968 4.30008L30.3613 5.96414C30.3648 5.97656 30.3691 5.98898 30.3737 6.00117C30.374 6.00233 30.374 6.00353 30.3737 6.00469C30.3689 6.01687 30.3648 6.02931 30.3613 6.04195L29.8963 7.71656C29.8459 7.89492 29.901 8.01961 29.9563 8.09297C29.9935 8.14225 30.0417 8.18214 30.097 8.20941C30.1524 8.23668 30.2134 8.25058 30.2751 8.25H30.7185C30.9583 8.25 31.191 8.14242 31.3279 7.96875L32.1381 6.9832L34.4191 7.01695L32.9087 10.3451C32.8828 10.4022 32.8717 10.4648 32.8762 10.5273C32.8808 10.5899 32.901 10.6502 32.9349 10.7029C32.9688 10.7556 33.0154 10.799 33.0704 10.8291C33.1254 10.8591 33.1871 10.8749 33.2498 10.875H33.8805C33.9685 10.8732 34.0549 10.8517 34.1334 10.8119C34.2119 10.7721 34.2805 10.7152 34.334 10.6453L37.2648 7.08281L38.6188 7.11844C38.718 7.12383 38.9927 7.1257 39.0562 7.1257C40.3513 7.125 41.1248 6.70453 41.1248 6C41.1248 5.77828 41.0362 5.36719 40.4434 5.10563C40.0935 4.95094 39.6266 4.87266 39.0557 4.87266C38.9929 4.87266 38.7189 4.87453 38.6184 4.87992L37.2646 4.91602L34.3265 1.35352C34.2729 1.28394 34.2045 1.22728 34.1261 1.18772C34.0477 1.14817 33.9614 1.12673 33.8737 1.125Z"
          fill="#D1D5DB"
        />
      </svg>
      <span className="relative z-[1] bg-neutral-50 px-0.5 text-xs font-light text-zinc-600">
        {stopsLabel}
      </span>
    </div>
  );
}

function AirlineAvatar({ name, logoUrl }: { name: string; logoUrl?: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-400 text-[10px] font-bold text-white">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="size-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}

function StopsPanel({ stops }: { stops: FlightStopSegment[] }) {
  return (
    <div className="flex flex-col gap-2.5 self-stretch">
      {stops.map((stop, index) => (
        <div
          key={`${stop.departureCity}-${index}`}
          className="flex flex-col gap-2.5 self-stretch rounded-xl border border-solid border-gray-200 p-3"
        >
          <div className="flex items-center gap-2 self-stretch">
            <AirlineAvatar
              name={stop.airlineName}
              logoUrl={stop.airlineLogoUrl}
            />
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
              <span className="text-sm font-semibold">{stop.airlineName}</span>
              {stop.connectionNote ? (
                <span className="text-xs font-normal text-zinc-600">
                  {stop.connectionNote}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex items-stretch gap-2.5 self-stretch">
            <div className="flex flex-col items-center py-0.5">
              <span className="size-2 shrink-0 rounded-full border border-zinc-300 bg-white" />
              <span className="min-h-8 w-px flex-1 border-l border-dashed border-zinc-300" />
              <span className="size-2 shrink-0 rounded-full border border-zinc-300 bg-white" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
              <div className="flex items-center justify-between gap-2 self-stretch">
                <span className="text-sm font-medium">
                  {stop.departureTime}
                </span>
                <span className="text-xs font-normal text-zinc-600">
                  {stop.departureCity}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 self-stretch">
                <span className="text-sm font-medium">{stop.arrivalTime}</span>
                <span className="text-xs font-normal text-zinc-600">
                  {stop.arrivalCity}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FlightCard({ flight }: { flight: FlightOptionCard }) {
  const [stopsOpen, setStopsOpen] = useState(false);
  const hasStops = Boolean(flight.stops?.length);

  const badgeClass =
    flight.badgeVariant === "cheapest"
      ? "border-green-100 bg-green-50 text-green-600"
      : "border-[#fcdacf] bg-[var(--primary-50)] text-[#f26537]";

  return (
    <div className="flex flex-col gap-1">
      {flight.label ? (
        <span className="text-sm font-bold text-[var(--main-primary)]">
          {flight.label}
        </span>
      ) : null}
      <article className="flex flex-col self-stretch overflow-hidden rounded-lg bg-white">
        <div className="flex flex-col gap-3.5 px-3.5 py-3">
          <div className="flex items-center gap-2.5 self-stretch">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <AirlineAvatar
                name={flight.airlineName}
                logoUrl={flight.airlineLogoUrl}
              />
              <div className="flex min-w-0 flex-col justify-center gap-0.5">
                <span className="text-sm font-semibold">
                  {flight.airlineName}
                </span>
                <span className="text-xs font-normal text-zinc-600">
                  {flight.routeCode} &bull; {flight.travelDate}
                </span>
              </div>
            </div>
            {flight.badge ? (
              <span
                className={`shrink-0 rounded-[59px] border border-solid px-3 py-1 text-xs font-medium ${badgeClass}`}
              >
                {flight.badge}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2.5 self-stretch rounded-xl bg-neutral-50 px-2.5 py-2">
            <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-center">
              <span className="text-sm font-extrabold">
                {flight.departureTime}
              </span>
              <span className="text-xs font-normal text-zinc-600">
                {flight.departureCity}
              </span>
            </div>
            <FlightPathGraphic stopsLabel={flight.stopsLabel} />
            <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-center">
              <span className="text-sm font-extrabold">
                {flight.arrivalTime}
              </span>
              <span className="text-xs font-normal text-zinc-600">
                {flight.arrivalCity}
              </span>
            </div>
          </div>
          <p className="m-0 text-xs font-normal text-zinc-600">
            {flight.metaLine}
          </p>
          {hasStops ? (
            <>
              <button
                type="button"
                onClick={() => setStopsOpen((open) => !open)}
                className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-xs font-semibold text-[#f26537]"
                aria-expanded={stopsOpen}
              >
                <span>{stopsOpen ? "Hide Stops" : "View Stops"}</span>
                <i
                  className={`ti ti-chevron-down text-sm leading-none transition-transform ${stopsOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {stopsOpen && flight.stops ? (
                <StopsPanel stops={flight.stops} />
              ) : null}
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-2.5 self-stretch bg-[#0f3a5d] px-3.5 py-1.5">
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5">
            <p className="m-0 w-full text-xs font-normal text-white">
              Total Price
            </p>
            <p className="m-0 w-full text-sm font-extrabold text-white">
              {flight.totalPrice}
            </p>
          </div>
          <a
            href={flight.reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 shrink-0 items-center justify-center rounded-[10px] bg-[#f26537] px-[15px] text-sm font-semibold text-white transition hover:opacity-90"
          >
            Reserve Now
          </a>
        </div>
      </article>
    </div>
  );
}

const FlightsOptionInSideChat = (props: Props) => {
  const intro = props.intro?.trim() || DEFAULT_PAYLOAD.intro;
  const routeTitle = props.routeTitle ?? DEFAULT_PAYLOAD.routeTitle;

  const [flights, setFlights] = useState<FlightOptionCard[]>(
    () => props.flights ?? DEFAULT_PAYLOAD.flights,
  );
  const [pagination, setPagination] = useState<FlightsPagination | undefined>(
    () => props.pagination,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (props.flights?.length) {
      setFlights(props.flights);
    }
    setPagination(props.pagination);
    setLoadError(null);
  }, [props.flights, props.pagination]);

  const handleShowMore = async () => {
    if (!pagination?.hasMore || loadingMore) return;

    setLoadingMore(true);
    setLoadError(null);

    try {
      const nextOffset = pagination.offset + pagination.limit;
      const result = await fetchFlightPage(pagination.search, {
        limit: pagination.limit,
        offset: nextOffset,
      });

      if (!result.payload?.flights.length) {
        setPagination((prev) => (prev ? { ...prev, hasMore: false } : prev));
        return;
      }

      setFlights((prev) => [...prev, ...result.payload!.flights]);
      setPagination(
        result.payload.pagination ?? {
          ...pagination,
          offset: nextOffset,
          hasMore: result.hasMore,
        },
      );
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Could not load more flights.",
      );
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="flex w-full lg:max-w-[80%] max-w-[90%] flex-col gap-3.5 self-stretch rounded-br-lg rounded-tl-lg rounded-tr-lg bg-[var(--primary-50)] p-3">
      <div className="flex flex-col gap-1">
        {routeTitle ? (
          <b className="text-base text-[var(--main-primary)]">{routeTitle}</b>
        ) : null}
        <p className="m-0 text-sm font-normal">{intro}</p>
      </div>
      <div className="flex flex-col gap-2.5 self-stretch">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
      {pagination?.hasMore ? (
        <button
          type="button"
          onClick={() => void handleShowMore()}
          disabled={loadingMore}
          className="flex h-10 w-full items-center justify-center rounded-lg border border-solid border-[#f26537]/30 bg-white text-sm font-semibold text-[#f26537] transition hover:bg-[#fff5f2] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingMore ? "Loading more flights…" : "Show more flights"}
        </button>
      ) : null}
      {loadError ? (
        <p className="m-0 text-center text-xs text-red-600">{loadError}</p>
      ) : null}
    </div>
  );
};

export default FlightsOptionInSideChat;
