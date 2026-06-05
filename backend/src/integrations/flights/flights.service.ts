import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { FLIGHTS_PAGE_SIZE } from "../../helper/constant";
import { getAirlineInfo } from "../../helper/airline";
import type {
  FlightOptionCard,
  FlightSearchContext,
  FlightSearchParams,
  FlightsChatPayload,
  FlightSearchResult,
  TravelpayoutsPriceRow,
} from "./flight.types";
import { TravelpayoutsFlightsApi } from "./travelpayouts-flights.api";
import { getDestinationCityName } from "../../helper/airport";

const FLIGHT_CURRENCY = "USD";
const STATIC_STOPS = "Non-stop";

@Injectable()
export class FlightsService {
  private readonly logger = new Logger(FlightsService.name);

  constructor(
    private readonly travelpayouts: TravelpayoutsFlightsApi,
    private readonly config: ConfigService,
  ) {}

  async search(params: FlightSearchParams): Promise<FlightSearchResult> {
    this.logger.log(
      `Searching flights for ${params.origin}→${params.destination}${params.departDate ? ` on ${params.departDate}` : ""}`,
    );
    const limit = params.limit || FLIGHTS_PAGE_SIZE;
    const offset = params.offset ?? 0;

    // Round-trip: exact date search only.
    if (params.returnDate && params.departDate) {
      const rows = await this.travelpayouts.searchRoundTrip({
        ...params,
        limit,
        offset,
      });
      if (!rows.length) return { payload: null, rawCount: 0, hasMore: false };

      const hasMore = rows.length >= limit;
      const flights = rows.map((row, index) =>
        this.mapRowToCard(row, params, offset + index),
      );

      const travelDateLabel = this.formatTravelDateLabelFromYmd(
        params.departDate,
      );
      const passengersLabel =
        params.adults === 1 ? "1 adult" : `${params.adults} adults`;

      const payload: FlightsChatPayload = {
        routeTitle: `Flights to ${getDestinationCityName(params.destination)}`,
        intro: this.buildIntro(params, passengersLabel, travelDateLabel),
        cabinClass: "Economy",
        passengersLabel,
        originCode: params.origin,
        destinationCode: params.destination,
        travelDateLabel,
        flights,
        pagination: {
          hasMore,
          offset,
          limit,
          search: this.toSearchContext(params),
        },
      };

      return { payload, rawCount: rows.length, hasMore };
    }

    if (!params.departDate) {
      this.logger.warn("One-way flight search requires departDate.");
      return { payload: null, rawCount: 0, hasMore: false };
    }

    if (offset > 0) {
      return this.searchPage(params, limit, offset);
    }

    const departDate = params.departDate;
    const rows = await this.travelpayouts.searchOneWay({
      ...params,
      limit,
      offset: 0,
    });

    const { flights, usedFallback } = this.pickFlightsForDate(
      rows,
      departDate,
      limit,
    );

    if (!flights.length) {
      return { payload: null, rawCount: 0, hasMore: false };
    }

    const hasMore = rows.length >= limit;
    const searchContext = this.toSearchContext(params);
    const travelDateLabel = this.formatTravelDateLabelFromYmd(departDate);
    const passengersLabel =
      params.adults === 1 ? "1 adult" : `${params.adults} adults`;

    const flightCards = flights.map((row, index) =>
      this.mapRowToCard(row, params, offset + index),
    );

    const payload: FlightsChatPayload = {
      routeTitle: `Flights to ${getDestinationCityName(params.destination)}`,
      intro: this.buildIntro(params, passengersLabel, travelDateLabel),
      availabilityNote: usedFallback
        ? `No flights on ${travelDateLabel}; showing the best prices in that month instead.`
        : undefined,
      cabinClass: "Economy",
      passengersLabel,
      originCode: params.origin,
      destinationCode: params.destination,
      travelDateLabel,
      flights: flightCards,
      pagination: {
        hasMore,
        offset: 0,
        limit,
        search: searchContext,
      },
    };

    return { payload, rawCount: rows.length, hasMore };
  }

  private async searchPage(
    params: FlightSearchParams,
    limit: number,
    offset: number,
  ): Promise<FlightSearchResult> {
    if (!params.departDate) {
      return { payload: null, rawCount: 0, hasMore: false };
    }

    let rows = await this.travelpayouts.searchOneWay({
      ...params,
      limit,
      offset,
    });
    const { flights: pageFlights, usedFallback } = this.pickFlightsForDate(
      rows,
      params.departDate,
      limit,
    );

    if (!pageFlights.length) {
      return { payload: null, rawCount: 0, hasMore: false };
    }

    const hasMore = rows.length >= limit;
    const flights = pageFlights.map((row, index) =>
      this.mapRowToCard(row, params, offset + index),
    );

    const travelDateLabel = this.formatTravelDateLabelFromYmd(
      params.departDate,
    );
    const passengersLabel =
      params.adults === 1 ? "1 adult" : `${params.adults} adults`;

    const payload: FlightsChatPayload = {
      routeTitle: `Flights to ${getDestinationCityName(params.destination)}`,
      intro: this.buildIntro(params, passengersLabel, travelDateLabel),
      availabilityNote: usedFallback
        ? `No flights on ${travelDateLabel}; showing the best prices in that month instead.`
        : undefined,
      cabinClass: "Economy",
      passengersLabel,
      originCode: params.origin,
      destinationCode: params.destination,
      travelDateLabel,
      flights,
      pagination: {
        hasMore,
        offset,
        limit,
        search: this.toSearchContext(params),
      },
    };

    return { payload, rawCount: rows.length, hasMore };
  }

  private pickFlightsForDate(
    rows: TravelpayoutsPriceRow[],
    targetDate: string,
    limit: number,
  ): { flights: TravelpayoutsPriceRow[]; usedFallback: boolean } {
    const exact = rows.filter((row) =>
      this.departureMatchesDate(row.departure_at, targetDate),
    );
    if (exact.length) {
      return { flights: exact.slice(0, limit), usedFallback: false };
    }

    // Travelpayouts `depart_months` returns cheapest fares in the month, not a single day.
    return { flights: rows.slice(0, limit), usedFallback: rows.length > 0 };
  }

  private toSearchContext(params: FlightSearchParams): FlightSearchContext {
    return {
      origin: params.origin,
      destination: params.destination,
      departDate: params.departDate,
      adults: params.adults,
      noLowcost: true,
    };
  }

  private departureMatchesDate(iso: string | undefined, targetYmd: string) {
    if (!iso) return false;
    const day = iso.length >= 10 ? iso.slice(0, 10) : iso;
    return day === targetYmd;
  }

  private mapRowToCard(
    row: TravelpayoutsPriceRow,
    params: FlightSearchParams,
    globalIndex: number,
  ): FlightOptionCard {
    const departureAt = row.departure_at ?? new Date().toISOString();
    const durationMin = row.duration;
    const depDate = new Date(departureAt);
    const arrivalDate =
      typeof durationMin === "number"
        ? new Date(depDate.getTime() + durationMin * 60000)
        : null;
    const arrivalTime = arrivalDate ? this.formatTime(arrivalDate) : "—";
    const durationLabel =
      typeof durationMin === "number" ? this.formatDuration(durationMin) : "";

    const originCode = row.origin_city_iata ?? params.origin;
    const destCode =
      row.destination_city_iata ??
      row.destination_airport_iata ??
      params.destination;
    const originCity = originCode;
    const destCity = destCode;
    const routeCode = `${originCode} > ${destCode}`;
    const travelDate = this.formatCardDate(departureAt);
    const reserveUrl = this.buildReserveUrl(row.ticket_link);

    const flightNumber = globalIndex + 1;
    const label =
      globalIndex === 0
        ? `Flight ${flightNumber} – Best`
        : `Flight ${flightNumber}`;

    let badge: string | undefined;
    let badgeVariant: "best" | "cheapest" | undefined;

    if (globalIndex === 0) {
      badge = "BEST";
      badgeVariant = "best";
    } else if (globalIndex === 1) {
      badge = "CHEAPEST";
      badgeVariant = "cheapest";
    }

    const stopsLabel = STATIC_STOPS;
    const offset = params.offset ?? 0;

    // Get airline information
    const airlineIata = row.main_airline?.trim().toUpperCase();
    const airlineInfo = airlineIata
      ? getAirlineInfo(airlineIata)
      : { name: "Unknown Airline", logo: { kiwi: "" } };

    return {
      id: `${originCode}-${destCode}-${offset}-${globalIndex}-${departureAt}`,
      label,
      badge,
      badgeVariant,
      airlineName: airlineInfo.name,
      airlineIata,
      airlineLogoUrl: airlineInfo.logo.kiwi,
      routeCode,
      travelDate,
      departureTime: this.formatTime(depDate),
      arrivalTime,
      durationLabel,
      departureCity: originCity,
      arrivalCity: destCity,
      stopsLabel,
      metaLine: `${airlineInfo.name} • Economy • ${stopsLabel}`,
      totalPrice: this.formatPriceUsd(row.value ?? 0),
      reserveUrl,
    };
  }

  private buildReserveUrl(ticketLink?: string) {
    const base = this.config.keys.AVIASALES_SEARCH_BASE.replace(/\/$/, "");

    if (!ticketLink?.trim()) {
      return `${base}/`;
    }

    const path = ticketLink.startsWith("/") ? ticketLink : `/${ticketLink}`;
    return `${base}${path}`;
  }

  private buildIntro(
    params: FlightSearchParams,
    passengersLabel: string,
    travelDateLabel: string,
  ) {
    const destinationCity = getDestinationCityName(params.destination);
    const originCity = getDestinationCityName(params.origin);
    return `Great Economy options for ${passengersLabel} from ${originCity} to ${destinationCity}${travelDateLabel ? ` on ${travelDateLabel}` : ""}. Pick the flight that works best for you.`;
  }

  private formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  private formatCardDate(iso?: string) {
    if (!iso) return "Dates vary";
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  }

  private formatTravelDateLabelFromYmd(ymd: string) {
    const [year, month, day] = ymd.split("-").map(Number);
    if (!year || !month || !day) return "";
    return this.formatTravelDateLabel(
      new Date(year, month - 1, day).toISOString(),
    );
  }

  private formatTravelDateLabel(iso?: string) {
    if (!iso) return "";
    const date = new Date(iso);
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";
    const month = date.toLocaleDateString("en-US", { month: "long" });
    return `${month} ${day}${suffix}`;
  }

  private formatDuration(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
  }

  private formatPriceUsd(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: FLIGHT_CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
