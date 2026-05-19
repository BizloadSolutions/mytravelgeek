"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildExpediaHotelSearchUrl = buildExpediaHotelSearchUrl;
exports.buildExpediaHotelListingUrl = buildExpediaHotelListingUrl;
const expedia_config_1 = require("./expedia.config");
const EXPEDIA_HOTEL_SEARCH_BASE = "https://www.expedia.com/Hotel-Search";
function buildExpediaHotelSearchUrl(params) {
    const affiliate = (0, expedia_config_1.getExpediaAffiliateConfig)();
    const query = new URLSearchParams({
        destination: params.destination.label,
        startDate: params.checkIn,
        endDate: params.checkOut,
        d1: params.checkIn,
        d2: params.checkOut,
        rooms: String(params.rooms),
        adults: String(params.adults),
        regionId: params.destination.regionId,
        latLong: params.destination.latLong,
        siteid: affiliate.siteid,
        langid: affiliate.langid,
        clickref: affiliate.clickref,
        affcid: affiliate.affcid,
        ref_id: affiliate.refId,
        my_ad: affiliate.myAd,
        afflid: affiliate.afflid,
        affdtl: affiliate.affdtl,
        sort: "RECOMMENDED",
        theme: "",
        userIntent: "",
        semdtl: "",
        categorySearch: "any_option",
        useRewards: "false",
    });
    if (params.children && params.children > 0) {
        query.set("children", String(params.children));
    }
    return `${EXPEDIA_HOTEL_SEARCH_BASE}?${query.toString()}`;
}
function buildExpediaHotelListingUrl(params, hotelName) {
    const url = new URL(buildExpediaHotelSearchUrl(params));
    url.searchParams.set("searchKeyword", hotelName);
    return url.toString();
}
//# sourceMappingURL=expedia.url-builder.js.map