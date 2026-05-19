"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHotelsForDestination = getHotelsForDestination;
exports.buildHotelSearchResult = buildHotelSearchResult;
const expedia_url_builder_1 = require("./expedia.url-builder");
const CATALOG = {
    jaipur: [
        {
            id: "rambagh-palace",
            name: "Rambagh Palace, Jaipur",
            rating: 4.9,
            starRating: 5,
            neighborhood: "Bhawani Singh Road",
            priceFrom: "₹42,500",
            priceNote: "per night · taxes may apply on Expedia",
            image: "/images/banner.png",
            badge: "BEST",
        },
        {
            id: "itc-rajputana",
            name: "ITC Rajputana, a Luxury Collection Hotel",
            rating: 4.7,
            starRating: 5,
            neighborhood: "Palace Road",
            priceFrom: "₹9,800",
            priceNote: "per night · member deals on Expedia",
            image: "/images/banner.png",
            badge: "POPULAR",
        },
        {
            id: "holiday-inn-jaipur",
            name: "Holiday Inn Jaipur City Centre by IHG",
            rating: 4.5,
            starRating: 4,
            neighborhood: "Commercial Colony",
            priceFrom: "₹5,200",
            priceNote: "per night · free cancellation options",
            image: "/images/banner.png",
        },
        {
            id: "lemon-tree-jaipur",
            name: "Lemon Tree Premier, Jaipur",
            rating: 4.4,
            starRating: 4,
            neighborhood: "MI Road",
            priceFrom: "₹4,650",
            priceNote: "per night · breakfast available",
            image: "/images/banner.png",
            badge: "CHEAPEST",
        },
        {
            id: "hilton-jaipur",
            name: "Hilton Jaipur",
            rating: 4.6,
            starRating: 5,
            neighborhood: "Ashram Marg",
            priceFrom: "₹7,900",
            priceNote: "per night · pool & spa",
            image: "/images/banner.png",
        },
    ],
};
function getHotelsForDestination(destination, params) {
    const catalog = CATALOG[destination.slug] ?? [];
    return catalog.map((hotel) => ({
        ...hotel,
        platform: "expedia",
        affiliateUrl: (0, expedia_url_builder_1.buildExpediaHotelListingUrl)(params, hotel.name),
    }));
}
function buildHotelSearchResult(destination, params) {
    const searchUrl = (0, expedia_url_builder_1.buildExpediaHotelSearchUrl)(params);
    const hotels = getHotelsForDestination(destination, params);
    return {
        platform: "expedia",
        destination: destination.label,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        rooms: params.rooms,
        adults: params.adults,
        searchUrl,
        hotels,
    };
}
//# sourceMappingURL=hotel-catalog.js.map