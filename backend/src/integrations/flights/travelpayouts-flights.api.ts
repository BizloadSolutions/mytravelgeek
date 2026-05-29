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

@Injectable()
export class TravelpayoutsFlightsApi {
  private readonly logger = new Logger(TravelpayoutsFlightsApi.name);

  constructor(
    private readonly graphql: GraphqlClientService,
    private readonly config: ConfigService,
  ) {}

  async searchOneWay(
    params: FlightSearchParams,
  ): Promise<TravelpayoutsPriceRow[]> {
    const token = this.config.keys.TRAVELPAYOUT_ACCESS_TOKEN;

    if (!token) {
      this.logger.warn("TRAVELPAYOUT_ACCESS_TOKEN is not set.");
      return [];
    }

    try {
      this.logger.debug(
        `Travelpayouts GraphQL (${FLIGHT_SEARCH_CURRENCY}): ${params.origin}→${params.destination}, month=${params.departMonth}`,
      );

      console.log("PRICES_ONE_WAY_QUERY ------------->", PRICES_ONE_WAY_QUERY);

      const data = await this.graphql.post<PricesOneWayResponse>(
        this.config.keys.TRAVELPAYOUTS_GRAPHQL_URL,
        token,
        {
          query: PRICES_ONE_WAY_QUERY,
          variables: {
            limit: params.limit,
            offset: params.offset,
            params: {
              origin: params.origin,
              destination: params.destination,
              depart_months: params.departMonth,
              no_lowcost: params.noLowcost,
            },
          },
        },
      );
      console.log("Original data ------------->", data);

      const rows = Array.isArray(data.prices_one_way)
        ? data.prices_one_way
        : [];
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
