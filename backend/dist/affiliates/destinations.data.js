"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AFFILIATE_DESTINATIONS = void 0;
exports.findDestinationFromText = findDestinationFromText;
exports.AFFILIATE_DESTINATIONS = [
    {
        slug: "jaipur",
        label: "Jaipur, Rajasthan, India",
        regionId: "1669",
        latLong: "26.915458,75.818982",
    },
    {
        slug: "new-york",
        label: "New York, New York, United States of America",
        regionId: "178293",
        latLong: "40.7127753,-74.0059728",
    },
    {
        slug: "paris",
        label: "Paris, France",
        regionId: "2734",
        latLong: "48.856614,2.3522219",
    },
    {
        slug: "london",
        label: "London, United Kingdom",
        regionId: "2114",
        latLong: "51.5073509,-0.1277583",
    },
    {
        slug: "dubai",
        label: "Dubai, United Arab Emirates",
        regionId: "6053839",
        latLong: "25.2048493,55.2707828",
    },
];
function findDestinationFromText(text) {
    const normalized = text.toLowerCase();
    for (const destination of exports.AFFILIATE_DESTINATIONS) {
        const city = destination.slug.replace(/-/g, " ");
        if (normalized.includes(destination.slug) ||
            normalized.includes(city) ||
            normalized.includes(destination.label.toLowerCase())) {
            return destination;
        }
    }
    const inMatch = text.match(/\b(?:in|at|near|around)\s+([A-Za-z][A-Za-z\s,]{1,40}?)(?:\?|\.|,|$|\s+for|\s+from|\s+on)/i);
    if (inMatch?.[1]) {
        const guess = inMatch[1].trim().toLowerCase();
        return (exports.AFFILIATE_DESTINATIONS.find((d) => guess.includes(d.slug.replace(/-/g, " ")) ||
            d.label.toLowerCase().includes(guess)) ?? null);
    }
    return null;
}
//# sourceMappingURL=destinations.data.js.map