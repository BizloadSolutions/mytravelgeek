"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHotelSearchQuery = isHotelSearchQuery;
exports.parseStayDates = parseStayDates;
exports.parseGuestCounts = parseGuestCounts;
exports.resolveStayDates = resolveStayDates;
const HOTEL_PATTERN = /\b(hotels?|accommodations?|places?\s+to\s+stay|where\s+to\s+stay|lodging|resorts?|book\s+a\s+room|stay\s+in)\b/i;
function isHotelSearchQuery(text) {
    return HOTEL_PATTERN.test(text);
}
function parseStayDates(text) {
    const isoRange = text.match(/(\d{4}-\d{2}-\d{2})\s*(?:to|until|through|-)\s*(\d{4}-\d{2}-\d{2})/i);
    if (isoRange) {
        return { checkIn: isoRange[1], checkOut: isoRange[2] };
    }
    const slashRange = text.match(/(\d{1,2}\/\d{1,2}\/\d{4})\s*(?:to|until|through|-)\s*(\d{1,2}\/\d{1,2}\/\d{4})/i);
    if (slashRange) {
        return {
            checkIn: toIsoDate(slashRange[1]),
            checkOut: toIsoDate(slashRange[2]),
        };
    }
    const monthRange = text.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:,?\s*(\d{4}))?\s*(?:to|until|through|-)\s*(\d{1,2})(?:,?\s*(\d{4}))?/i);
    if (monthRange) {
        const yearStart = monthRange[3] ?? String(new Date().getFullYear());
        const yearEnd = monthRange[5] ?? yearStart;
        const checkIn = toIsoFromParts(monthRange[1], monthRange[2], yearStart);
        const checkOut = toIsoFromParts(monthRange[1], monthRange[4], yearEnd);
        return { checkIn, checkOut };
    }
    return null;
}
function parseGuestCounts(text) {
    const adultsMatch = text.match(/(\d+)\s+adults?/i);
    const roomsMatch = text.match(/(\d+)\s+rooms?/i);
    const childrenMatch = text.match(/(\d+)\s+children?/i);
    return {
        adults: adultsMatch ? Math.max(1, Number(adultsMatch[1])) : 2,
        rooms: roomsMatch ? Math.max(1, Number(roomsMatch[1])) : 1,
        children: childrenMatch ? Math.max(0, Number(childrenMatch[1])) : 0,
    };
}
function defaultStayDates() {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 14);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 1);
    return {
        checkIn: formatIso(checkIn),
        checkOut: formatIso(checkOut),
    };
}
function resolveStayDates(text) {
    return parseStayDates(text) ?? defaultStayDates();
}
function formatIso(date) {
    return date.toISOString().slice(0, 10);
}
function toIsoDate(value) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return defaultStayDates().checkIn;
    }
    return formatIso(parsed);
}
const MONTHS = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
};
function toIsoFromParts(month, day, year) {
    const monthIndex = MONTHS[month.toLowerCase()];
    const date = new Date(Number(year), monthIndex, Number(day));
    return formatIso(date);
}
//# sourceMappingURL=hotel-intent.js.map