export declare function isHotelSearchQuery(text: string): boolean;
export declare function parseStayDates(text: string): {
    checkIn: string;
    checkOut: string;
} | null;
export declare function parseGuestCounts(text: string): {
    adults: number;
    rooms: number;
    children: number;
};
export declare function resolveStayDates(text: string): {
    checkIn: string;
    checkOut: string;
};
