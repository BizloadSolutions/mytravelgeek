"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelsService = void 0;
const common_1 = require("@nestjs/common");
const hotel_catalog_1 = require("../affiliates/hotel-catalog");
const destinations_data_1 = require("../affiliates/destinations.data");
const hotel_intent_1 = require("../affiliates/hotel-intent");
let HotelsService = class HotelsService {
    searchFromUserMessage(userMessage) {
        if (!(0, hotel_intent_1.isHotelSearchQuery)(userMessage)) {
            return null;
        }
        const destination = (0, destinations_data_1.findDestinationFromText)(userMessage);
        if (!destination) {
            return null;
        }
        const { checkIn, checkOut } = (0, hotel_intent_1.resolveStayDates)(userMessage);
        const { adults, rooms, children } = (0, hotel_intent_1.parseGuestCounts)(userMessage);
        return (0, hotel_catalog_1.buildHotelSearchResult)(destination, {
            destination,
            checkIn,
            checkOut,
            rooms,
            adults,
            children,
        });
    }
};
exports.HotelsService = HotelsService;
exports.HotelsService = HotelsService = __decorate([
    (0, common_1.Injectable)()
], HotelsService);
//# sourceMappingURL=hotels.service.js.map