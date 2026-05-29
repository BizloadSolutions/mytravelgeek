import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { airlineDisplayName } from "./airline-names";
import { airlineLogoUrl } from "./airline-logo";
import { cityNameForCode } from "./airport-codes";
import { FLIGHTS_PAGE_SIZE } from "../../helper/constant";
import { addDepartMonths } from "./flight-intent";
import type {
  FlightOptionCard,
  FlightSearchContext,
  FlightSearchParams,
  FlightsChatPayload,
  FlightSearchResult,
  TravelpayoutsPriceRow,
} from "./flight.types";
import { TravelpayoutsFlightsApi } from "./travelpayouts-flights.api";

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
    const limit = params.limit || FLIGHTS_PAGE_SIZE;
    const offset = params.offset ?? 0;
    let searchParams: FlightSearchParams = { ...params, limit, offset };

    let rows = await this.travelpayouts.searchOneWay(searchParams);

    if (!rows.length && offset === 0) {
      const nextMonth = addDepartMonths(params.departMonth, 1);
      if (nextMonth !== params.departMonth) {
        this.logger.log(
          `No flights for ${params.departMonth}; retrying ${nextMonth}`,
        );
        searchParams = { ...searchParams, departMonth: nextMonth };
        rows = await this.travelpayouts.searchOneWay(searchParams);
      }
    }

    if (!rows.length) {
      return { payload: null, rawCount: 0, hasMore: false };
    }

    const hasMore = rows.length >= limit;
    const searchContext = this.toSearchContext(searchParams);
    const flights = rows.map((row, index) =>
      this.mapRowToCard(row, searchParams, offset + index),
    );

    const travelDateLabel = this.formatTravelDateLabel(rows[0]?.departure_at);
    const passengersLabel =
      searchParams.adults === 1 ? "1 adult" : `${searchParams.adults} adults`;

    const payload: FlightsChatPayload = {
      routeTitle: cityNameForCode(searchParams.destination),
      intro: this.buildIntro(searchParams, passengersLabel, travelDateLabel),
      cabinClass: "Economy",
      passengersLabel,
      originCode: searchParams.origin,
      destinationCode: searchParams.destination,
      travelDateLabel,
      flights,
      pagination: {
        hasMore,
        offset,
        limit,
        search: searchContext,
      },
    };

    return { payload, rawCount: rows.length, hasMore };
  }

  private toSearchContext(params: FlightSearchParams): FlightSearchContext {
    return {
      origin: params.origin,
      destination: params.destination,
      departMonth: params.departMonth,
      adults: params.adults,
      noLowcost: params.noLowcost,
    };
  }

  private mapRowToCard(
    row: TravelpayoutsPriceRow,
    params: FlightSearchParams,
    globalIndex: number,
  ): FlightOptionCard {
    const departureAt = row.departure_at ?? new Date().toISOString();
    const durationMin =
      row.duration && row.duration > 0
        ? row.duration
        : this.estimateDurationMinutes(params.origin, params.destination);

    const depDate = new Date(departureAt);
    const arrDate = new Date(depDate.getTime() + durationMin * 60_000);

    const originCode = row.origin_city_iata ?? params.origin;
    const destCode =
      row.destination_city_iata ??
      row.destination_airport_iata ??
      params.destination;
    const originCity = cityNameForCode(originCode);
    const destCity = cityNameForCode(destCode);
    const routeCode = `${originCode} > ${destCode}`;
    const airlineName = airlineDisplayName(row.main_airline);
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

    const durationLabel = this.formatDuration(durationMin);
    const stopsLabel = STATIC_STOPS;
    const offset = params.offset ?? 0;

    return {
      id: `${originCode}-${destCode}-${offset}-${globalIndex}-${departureAt}`,
      label,
      badge,
      badgeVariant,
      airlineName,
      airlineIata: row.main_airline?.trim().toUpperCase(),
      airlineLogoUrl: airlineLogoUrl(row.main_airline),
      routeCode,
      travelDate,
      departureTime: this.formatTime(depDate),
      departureCity: originCity,
      arrivalTime: this.formatTime(arrDate),
      arrivalCity: destCity,
      stopsLabel,
      metaLine: `${airlineName} • Economy • ${stopsLabel} • ${durationLabel}`,
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
    return `I found the following flights in Economy class for ${passengersLabel} from ${params.origin} to ${params.destination}${travelDateLabel ? ` on ${travelDateLabel}` : ""}:`;
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

  private estimateDurationMinutes(origin: string, destination: string) {
    const domestic = new Set([
      "DEL",
      "BOM",
      "BLR",
      "MAA",
      "CCU",
      "HYD",
      "GOI",
      "JAI",
    ]);
    if (domestic.has(origin) && domestic.has(destination)) return 150;
    return 360;
  }
}
