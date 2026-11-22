import type { CurrencyCode } from "@/config/product";

export const CURRENCY_COOKIE_NAME = "cg_currency_pref";

const GBP_COUNTRIES = new Set(["GB", "GG", "JE", "IM", "GI"]);
const GBP_TIMEZONES = new Set([
  "Europe/London",
  "Europe/Belfast",
  "Europe/Guernsey",
  "Europe/Jersey",
  "Europe/Isle_of_Man",
]);

export function parseCurrencyCode(
  value?: string | null
): CurrencyCode | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "gbp" || normalized === "usd") {
    return normalized;
  }
  return null;
}

/**
 * Maps an ISO 3166-1 alpha-2 country header (e.g. from Vercel/Cloudflare) to GBP or USD.
 */
export function currencyFromCountryCode(
  countryCode?: string | null
): CurrencyCode | null {
  if (!countryCode) return null;
  const code = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || code === "XX" || code === "T1") {
    return null;
  }
  return GBP_COUNTRIES.has(code) ? "gbp" : "usd";
}

/**
 * Infers GBP or USD when the primary Accept-Language header explicitly specifies a region.
 */
export function currencyFromAcceptLanguage(
  acceptLanguage?: string | null
): CurrencyCode | null {
  if (!acceptLanguage) return null;
  const primary = acceptLanguage
    .split(",")[0]
    ?.split(";")[0]
    ?.trim()
    .toLowerCase();
  if (!primary) return null;

  if (
    primary === "en-gb" ||
    primary.endsWith("-gb") ||
    primary.endsWith("_gb")
  ) {
    return "gbp";
  }

  if (
    primary === "en-us" ||
    primary.endsWith("-us") ||
    primary.endsWith("_us") ||
    primary === "en-ca" ||
    primary.endsWith("-ca") ||
    primary.endsWith("_ca") ||
    primary === "en-au" ||
    primary.endsWith("-au") ||
    primary.endsWith("_au")
  ) {
    return "usd";
  }

  return null;
}

/**
 * Maps an IANA browser timezone (e.g. "Europe/London" vs "America/New_York") to GBP or USD.
 */
export function currencyFromTimezone(
  timeZone?: string | null
): CurrencyCode | null {
  if (!timeZone) return null;
  const cleaned = timeZone.trim();
  if (!cleaned) return null;
  return GBP_TIMEZONES.has(cleaned) ? "gbp" : "usd";
}

/**
 * Reads a manually persisted currency preference cookie on the client.
 */
export function readClientCurrencyPreference(): CurrencyCode | null {
  if (typeof document === "undefined") return null;
  try {
    const pairs = document.cookie.split(";");
    const prefix = `${CURRENCY_COOKIE_NAME}=`;
    for (const part of pairs) {
      const trimmed = part.trim();
      if (trimmed.startsWith(prefix)) {
        const rawValue = decodeURIComponent(trimmed.slice(prefix.length));
        return parseCurrencyCode(rawValue);
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists a manual currency override as a strictly necessary functional cookie (30 days).
 */
export function persistCurrencyPreference(currency: CurrencyCode): void {
  if (typeof document === "undefined") return;
  try {
    const isHttps =
      typeof window !== "undefined" && window.location.protocol === "https:";
    document.cookie = `${CURRENCY_COOKIE_NAME}=${encodeURIComponent(
      currency
    )}; path=/; max-age=2592000; SameSite=Lax${isHttps ? "; Secure" : ""}`;
  } catch {
    // Ignore cookie write errors in restricted environments
  }
}
