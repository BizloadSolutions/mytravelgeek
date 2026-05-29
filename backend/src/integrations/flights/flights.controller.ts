import { Body, Controller, Post } from "@nestjs/common";
import type { FlightSearchParams } from "./flight.types";
import { FlightsService } from "./flights.service";

@Controller("flights")
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post("search")
  search(@Body() body: FlightSearchParams) {
    return this.flightsService.search(body);
  }
}
