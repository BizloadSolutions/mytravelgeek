"use client";

/**
 * Filters hydration-mismatch warnings caused by browser extensions
 * (Bitdefender `bis_skin_checked`, Grammarly `data-gr-*`, ColorZilla
 * `cz-shortcut-listen`, etc.) that inject attributes into the DOM
 * before React hydrates. These warnings are noise — the attributes
 * are added by the user's browser, not by our code, and they only
 * appear in development.
 *
 * Also filters console noise emitted from within third-party widget
 * scripts (e.g. the Travelpayouts `tpembars.com` embed, which logs
 * "config is not valid") — errors we neither cause nor can fix.
 */

const EXTENSION_ATTR_SIGNATURES = [
  "bis_skin_checked",
  "bis_register",
  "__processed_",
  "data-bis-",
  "data-gr-",
  "data-new-gr-",
  "data-gramm",
  "cz-shortcut",
];

const HYDRATION_MSG_SIGNATURES = [
  "hydrated but some attributes",
  "server rendered HTML didn't match",
  "Hydration failed because",
];

// Third-party scripts whose internal console noise we suppress. Detected
// by inspecting the call stack, so only errors originating *inside* these
// scripts are filtered — never our own code.
const THIRD_PARTY_NOISE_SOURCES = ["tpembars.com"];

function isThirdPartyScriptNoise(): boolean {
  const stack = new Error().stack ?? "";
  return THIRD_PARTY_NOISE_SOURCES.some((s) => stack.includes(s));
}

function isExtensionHydrationWarning(args: unknown[]): boolean {
  const joined = args
    .map((a) => (typeof a === "string" ? a : ""))
    .join(" ");
  if (!joined) return false;
  const looksLikeHydration = HYDRATION_MSG_SIGNATURES.some((s) =>
    joined.includes(s)
  );
  if (!looksLikeHydration) return false;
  return EXTENSION_ATTR_SIGNATURES.some((s) => joined.includes(s));
}

if (typeof window !== "undefined") {
  const w = window as unknown as { __extHydrationFilterInstalled?: boolean };
  if (!w.__extHydrationFilterInstalled) {
    w.__extHydrationFilterInstalled = true;
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      if (isExtensionHydrationWarning(args)) return;
      if (isThirdPartyScriptNoise()) return;
      originalError.apply(console, args as []);
    };
  }
}

export default function SuppressExtensionHydrationWarning() {
  return null;
}
