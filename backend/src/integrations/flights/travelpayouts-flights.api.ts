import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { GraphqlClientService } from "../common/graphql-client.service";
import type { FlightSearchParams, TravelpayoutsPriceRow } from "./flight.types";

/** Always request prices in USD (Travelpayouts `currency` argument). */
const FLIGHT_SEARCH_CURRENCY = "USD";

const PRICES_ONE_WAY_QUERY = `
  query PricesOneWay($params: ParamsOneWay!, $limit: Int!, $offset: Int!) {
    prices_one_way(
      params: $params
      paging: { limit: $limit, offset: $offset }
      sorting: VALUE_ASC
      grouping: NONE
      currency: "${FLIGHT_SEARCH_CURRENCY}"
    ) {
      departure_at
      value
      ticket_link
      currency
      origin_city_iata
      origin_country_iata
      destination_airport_iata
      destination_city_iata
      duration
      main_airline
      provider
    }
  }
`;

type PricesOneWayResponse = {
  prices_one_way: TravelpayoutsPriceRow[];
};

const PRICES_ROUND_TRIP_QUERY = `
  query PricesRoundTrip($params: ParamsRoundTrip!, $limit: Int!, $offset: Int!) {
    prices_round_trip(
      params: $params
      paging: { limit: $limit, offset: $offset }
      sorting: VALUE_ASC
      currency: "${FLIGHT_SEARCH_CURRENCY}"
    ) {
      departure_at
      return_at
      value
      ticket_link
      currency
      origin_city_iata
      origin_country_iata
      destination_airport_iata
      destination_city_iata
      duration
      main_airline
      provider
    }
  }
`;

type PricesRoundTripResponse = {
  prices_round_trip: TravelpayoutsPriceRow[];
};

@Injectable()
export class TravelpayoutsFlightsApi {
  private readonly logger = new Logger(TravelpayoutsFlightsApi.name);

  constructor(
    private readonly graphql: GraphqlClientService,
    private readonly config: ConfigService,
  ) {}

  private async fetchOneWay(
    token: string,
    variables: {
      limit: number;
      offset: number;
      params: Record<string, unknown>;
    },
  ): Promise<TravelpayoutsPriceRow[]> {
    const data = await this.graphql.post<PricesOneWayResponse>(
      this.config.keys.TRAVELPAYOUTS_GRAPHQL_URL,
      token,
      {
        query: PRICES_ONE_WAY_QUERY,
        variables,
      },
    );

    return Array.isArray(data.prices_one_way) ? data.prices_one_way : [];
  }

  private async fetchRoundTrip(
    token: string,
    variables: {
      limit: number;
      offset: number;
      params: Record<string, unknown>;
    },
  ): Promise<TravelpayoutsPriceRow[]> {
    const data = await this.graphql.post<PricesRoundTripResponse>(
      this.config.keys.TRAVELPAYOUTS_GRAPHQL_URL,
      token,
      {
        query: PRICES_ROUND_TRIP_QUERY,
        variables,
      },
    );

    return Array.isArray(data.prices_round_trip) ? data.prices_round_trip : [];
  }

  async searchOneWay(
    params: FlightSearchParams,
  ): Promise<TravelpayoutsPriceRow[]> {
    const token = this.config.keys.TRAVELPAYOUT_ACCESS_TOKEN;

    if (!token) {
      this.logger.warn("TRAVELPAYOUT_ACCESS_TOKEN is not set.");
      return [];
    }

    if (!params.departDate) {
      this.logger.warn("One-way flight search requires a departure date.");
      return [];
    }

    try {
      this.logger.debug(
        `Travelpayouts GraphQL (${FLIGHT_SEARCH_CURRENCY}): ${JSON.stringify(params)}`,
      );

      const baseParams = {
        origin: params.origin,
        destination: params.destination,
        no_lowcost: true,
        ...(params.tripClass ? { trip_class: params.tripClass } : {}),
        ...(typeof params.direct === "boolean"
          ? { direct: params.direct }
          : {}),
      };

      // 1) Try exact-date query (works in Playground for specific days).
      let rows = await this.fetchOneWay(token, {
        limit: params.limit,
        offset: params.offset,
        params: {
          ...baseParams,
          depart_dates: params.departDate,
        },
      });

      // 2) If empty, fall back to monthly calendar query (many routes only return data this way).
      if (!rows.length) {
        this.logger.debug(
          `Travelpayouts returned 0 rows for depart_dates=${params.departDate}; retrying with depart_months.`,
        );

        rows = await this.fetchOneWay(token, {
          limit: params.limit,
          offset: params.offset,
          params: {
            ...baseParams,
            depart_months: params.departDate,
          },
        });
      }

      this.logger.log(`Travelpayouts returned ${rows.length} flight row(s).`);
      return rows;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Flight search failed.";
      this.logger.error(message);
      throw error;
    }
  }

  async searchRoundTrip(
    params: FlightSearchParams,
  ): Promise<TravelpayoutsPriceRow[]> {
    const token = this.config.keys.TRAVELPAYOUT_ACCESS_TOKEN;

    if (!token) {
      this.logger.warn("TRAVELPAYOUT_ACCESS_TOKEN is not set.");
      return [];
    }

    if (!params.departDate || !params.returnDate) {
      return [];
    }

    try {
      this.logger.debug(
        `Travelpayouts GraphQL (${FLIGHT_SEARCH_CURRENCY}): ${JSON.stringify(params)}`,
      );

      const baseParams = {
        origin: params.origin,
        destination: params.destination,
        depart_date_min: params.departDate,
        return_date_max: params.returnDate,
        no_lowcost: true,
        ...(params.tripClass ? { trip_class: params.tripClass } : {}),
        ...(typeof params.direct === "boolean"
          ? { direct: params.direct }
          : {}),
      };

      const rows = await this.fetchRoundTrip(token, {
        limit: params.limit,
        offset: params.offset,
        params: baseParams,
      });

      this.logger.log(`Travelpayouts returned ${rows.length} flight row(s).`);
      return rows;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Flight search failed.";
      this.logger.error(message);
      throw error;
    }
  }
}
