export type TicketPassengers = {
  adults: number;
  children: number;
  infants: number;
};

/** Aviasales booking codes encode pax as 3 single digits: adult, child, infant (0–9 each). */
function clampPaxCount(n: number): number {
  return Math.min(9, Math.max(0, Math.round(n)));
}

function formatPaxSegment(passengers: TicketPassengers): string {
  return `${clampPaxCount(passengers.adults)}${clampPaxCount(passengers.children)}${clampPaxCount(passengers.infants)}`;
}

/** YYYY-MM-DD → DDMM for Aviasales booking codes. */
export function ymdToBookingDdMm(ymd: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!match) return null;
  return `${match[3]}${match[2]}`;
}

export function parseBookingCode(ticketLink: string): {
  bookingCode: string;
  query: string;
} | null {
  const trimmed = ticketLink.trim();
  if (!trimmed) return null;

  const path = trimmed.split("?")[0] ?? "";
  const query = trimmed.includes("?")
    ? trimmed.split("?").slice(1).join("?")
    : "";
  const bookingCode = path.replace(/^\//, "");
  if (bookingCode.length < 10) return null;

  return { bookingCode, query };
}

/** Round-trip codes are longer than one-way (extra DDMM return segment). */
export function isRoundTripBookingCode(bookingCode: string): boolean {
  return bookingCode.length > 13;
}

/**
 * Inject passenger counts (and optional return date) into a Travelpayouts ticket_link path.
 * Format: ORIGIN(3) + DEP_DDMM(4) + DEST(3) + [RET_DDMM(4)] + ADULT + CHILD + INFANT
 */
export function applySearchContextToTicketLink(
  ticketLink: string | undefined,
  options: {
    passengers: TicketPassengers;
    returnDate?: string;
    forceRoundTrip?: boolean;
  },
): string | undefined {
  if (!ticketLink?.trim()) return ticketLink;

  const parsed = parseBookingCode(ticketLink);
  if (!parsed) return ticketLink;

  const { bookingCode, query } = parsed;
  const pax = formatPaxSegment(options.passengers);
  const isReturn =
    options.forceRoundTrip ||
    isRoundTripBookingCode(bookingCode) ||
    Boolean(options.returnDate);

  let route = bookingCode.slice(0, 10);
  if (route.length < 10) return ticketLink;

  if (isReturn) {
    const returnDdMm =
      (options.returnDate && ymdToBookingDdMm(options.returnDate)) ||
      bookingCode.slice(10, 14);
    if (!returnDdMm || returnDdMm.length !== 4) return ticketLink;
    route = `${route}${returnDdMm}`;
  }

  const suffixStart = isReturn ? 14 : 10;
  const suffix =
    bookingCode.length > suffixStart + 3
      ? bookingCode.slice(suffixStart + 3)
      : "";

  const newCode = `${route}${pax}${suffix}`;
  const path = `/${newCode}`;
  return query ? `${path}?${query}` : path;
}
