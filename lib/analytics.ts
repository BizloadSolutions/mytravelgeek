export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-3PH559VFVN";

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", eventName, params);
}

/** Orange send button on the home hero search bar. */
export function trackHeroSearchSubmit(query: string) {
  const trimmed = query.trim();
  trackEvent("hero_search_submit", {
    event_category: "engagement",
    event_label: "home_hero_send_button",
    has_query: trimmed.length > 0,
    query_length: trimmed.length,
  });
}
