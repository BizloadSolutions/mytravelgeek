import { Module } from "@nestjs/common";
import { GraphqlClientService } from "../common/graphql-client.service";
import { FlightsController } from "./flights.controller";
import { FlightsService } from "./flights.service";
import { TravelpayoutsFlightsApi } from "./travelpayouts-flights.api";

@Module({
  controllers: [FlightsController],
  providers: [GraphqlClientService, TravelpayoutsFlightsApi, FlightsService],
  exports: [FlightsService],
})
export class FlightsModule {}
