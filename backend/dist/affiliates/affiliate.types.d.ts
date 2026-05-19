export type AffiliatePlatformId = "expedia";
export type AffiliateDestination = {
    slug: string;
    label: string;
    regionId: string;
    latLong: string;
};
export type HotelSearchParams = {
    destination: AffiliateDestination;
    checkIn: string;
    checkOut: string;
    rooms: number;
    adults: number;
    children?: number;
};
export type AffiliateHotelListing = {
    id: string;
    name: string;
    rating?: number;
    starRating?: number;
    neighborhood?: string;
    priceFrom: string;
    priceNote?: string;
    image: string;
    badge?: "BEST" | "CHEAPEST" | "POPULAR";
    affiliateUrl: string;
    platform: AffiliatePlatformId;
};
export type AffiliateHotelSearchResult = {
    platform: AffiliatePlatformId;
    destination: string;
    checkIn: string;
    checkOut: string;
    rooms: number;
    adults: number;
    searchUrl: string;
    hotels: AffiliateHotelListing[];
};
