import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { GraphqlClientService } from "../common/graphql-client.service";
import type { FlightSearchParams, TravelpayoutsPriceRow } from "./flight.types";

type PricesOneWayResponse = {
  prices_one_way: TravelpayoutsPriceRow[];
};

type PricesRoundTripResponse = {
  prices_round_trip: TravelpayoutsPriceRow[];
};

/** All TravelPayouts flight searches use USD. */
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

    if (!params.departDate && !params.departMonth) {
      this.logger.warn(
        "One-way flight search requires departDate or departMonth.",
      );
      return [];
    }

    try {
      this.logger.debug(
        `Travelpayouts GraphQL (USD): ${JSON.stringify(params)}`,
      );

      const baseParams = {
        origin: params.origin,
        destination: params.destination,
        ...(params.tripClass ? { trip_class: params.tripClass } : {}),
        ...(typeof params.direct === "boolean"
          ? { direct: params.direct }
          : {}),
      };

      const dateParams = params.departMonth
        ? { depart_months: params.departMonth }
        : { depart_dates: params.departDate };

      const rows = await this.fetchOneWay(token, {
        limit: params.limit,
        offset: params.offset,
        params: {
          ...baseParams,
          ...dateParams,
        },
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
        `Travelpayouts GraphQL (USD): ${JSON.stringify(params)}`,
      );

      const baseParams = {
        origin: params.origin,
        destination: params.destination,
        depart_date_min: params.departDate,
        return_date_max: params.returnDate,
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
