import type { AffiliateDestination, AffiliateHotelListing, HotelSearchParams } from "./affiliate.types";
export declare function getHotelsForDestination(destination: AffiliateDestination, params: HotelSearchParams): AffiliateHotelListing[];
export declare function buildHotelSearchResult(destination: AffiliateDestination, params: HotelSearchParams): {
    platform: "expedia";
    destination: string;
    checkIn: string;
    checkOut: string;
    rooms: number;
    adults: number;
    searchUrl: string;
    hotels: AffiliateHotelListing[];
};
