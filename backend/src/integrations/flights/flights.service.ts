import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { FLIGHTS_PAGE_SIZE } from "../../helper/constant";
import { buildAlternateDepartMonths } from "./flight-intent";
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
    this.logger.log(
      `Searching flights for ${params.origin}→${params.destination} on ${params.departMonth}${params.departDate ? ` on ${params.departDate}` : ""}`,
    );
    const limit = params.limit || FLIGHTS_PAGE_SIZE;
    const offset = params.offset ?? 0;

    // Round-trip: exact date search only (no month probing).
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
        routeTitle: params.destination,
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

    if (offset > 0) {
      return this.searchPage(params, limit, offset);
    }

    // If user provided an exact date, do NOT probe other months.
    // Otherwise it looks like we're "searching multiple dates" even though we're only trying months.
    const monthsToTry = params.departDate
      ? [params.departMonth]
      : buildAlternateDepartMonths(params.departMonth);
    let rows: TravelpayoutsPriceRow[] = [];
    let usedMonth = params.departMonth;
    let availabilityNote: string | undefined;

    for (const month of monthsToTry) {
      const monthParams = { ...params, departMonth: month, limit, offset: 0 };
      const raw = await this.travelpayouts.searchOneWay(monthParams);
      const filtered = this.applyDepartDateFilter(
        raw,
        params.departDate,
        limit,
      );

      if (filtered.length > 0) {
        rows = filtered;
        usedMonth = month;
        if (month !== params.departMonth) {
          availabilityNote = `Live prices for ${this.formatMonthYearLabel(params.departMonth)} are not available yet — showing ${this.formatMonthYearLabel(month)} options instead.`;
        }
        break;
      }

      this.logger.debug(
        `No flights for ${params.origin}→${params.destination}${params.departDate ? ` on ${params.departDate}` : ""} in month ${month} (raw=${raw.length})`,
      );
    }

    if (!rows.length) {
      return { payload: null, rawCount: 0, hasMore: false };
    }

    const searchParams: FlightSearchParams = {
      ...params,
      departMonth: usedMonth,
      limit,
      offset: 0,
    };

    const hasMore = rows.length >= limit;
    const searchContext = this.toSearchContext(searchParams);
    const flights = rows.map((row, index) =>
      this.mapRowToCard(row, searchParams, index),
    );

    const travelDateLabel = params.departDate
      ? this.formatTravelDateLabelFromYmd(params.departDate)
      : this.formatTravelDateLabel(rows[0]?.departure_at);

    const passengersLabel =
      searchParams.adults === 1 ? "1 adult" : `${searchParams.adults} adults`;

    const payload: FlightsChatPayload = {
      routeTitle: searchParams.destination,
      intro: this.buildIntro(searchParams, passengersLabel, travelDateLabel),
      availabilityNote,
      cabinClass: "Economy",
      passengersLabel,
      originCode: searchParams.origin,
      destinationCode: searchParams.destination,
      travelDateLabel,
      flights,
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
    let rows = await this.travelpayouts.searchOneWay({
      ...params,
      limit,
      offset,
    });
    rows = this.applyDepartDateFilter(rows, params.departDate, limit);

    if (!rows.length) {
      return { payload: null, rawCount: 0, hasMore: false };
    }

    const hasMore = rows.length >= limit;
    const flights = rows.map((row, index) =>
      this.mapRowToCard(row, params, offset + index),
    );

    const travelDateLabel = params.departDate
      ? this.formatTravelDateLabelFromYmd(params.departDate)
      : this.formatTravelDateLabel(rows[0]?.departure_at);

    const passengersLabel =
      params.adults === 1 ? "1 adult" : `${params.adults} adults`;

    const payload: FlightsChatPayload = {
      routeTitle: params.destination,
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

  private toSearchContext(params: FlightSearchParams): FlightSearchContext {
    return {
      origin: params.origin,
      destination: params.destination,
      departMonth: params.departMonth,
      departDate: params.departDate,
      adults: params.adults,
      noLowcost: params.noLowcost,
    };
  }

  /**
   * Day filter:
   * - If the user provided an exact `departDate`, prefer flights on that day.
   * - If none exist (common with month-based price feeds), fall back to the closest dates
   *   so the UI can still show live options instead of "no flights".
   */
  private applyDepartDateFilter(
    rows: TravelpayoutsPriceRow[],
    departDate: string | undefined,
    limit: number,
  ): TravelpayoutsPriceRow[] {
    if (!departDate || !rows.length) return rows;

    const exact = rows.filter((row) =>
      this.departureMatchesDate(row.departure_at, departDate),
    );
    if (exact.length > 0) return exact.slice(0, limit);

    // Fallback: closest available dates in the returned month feed.
    return this.sortByProximityToDate(rows, departDate).slice(0, limit);
  }

  private sortByProximityToDate(
    rows: TravelpayoutsPriceRow[],
    targetYmd: string,
  ): TravelpayoutsPriceRow[] {
    const target = new Date(`${targetYmd}T12:00:00`).getTime();
    return [...rows].sort((a, b) => {
      const ta = new Date(a.departure_at ?? 0).getTime();
      const tb = new Date(b.departure_at ?? 0).getTime();
      return Math.abs(ta - target) - Math.abs(tb - target);
    });
  }

  private departureMatchesDate(iso: string | undefined, targetYmd: string) {
    if (!iso) return false;
    const day = iso.length >= 10 ? iso.slice(0, 10) : iso;
    return day === targetYmd;
  }

  private formatMonthYearLabel(monthStart: string) {
    const [year, month] = monthStart.split("-").map(Number);
    const label = new Date(year, month - 1, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    return label;
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
    const originCity = originCode;
    const destCity = destCode;
    const routeCode = `${originCode} > ${destCode}`;
    const airlineName = row.main_airline;
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
      airlineName: "Test Airline Name",
      airlineIata: row.main_airline?.trim().toUpperCase(),
      airlineLogoUrl: "https://images.kiwi.com/airlines/64/6E.png",
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
