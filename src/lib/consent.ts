export type CookieConsentStatus = "accepted" | "rejected" | null;

export const COOKIE_CONSENT_STORAGE_KEY = "cg_cookie_consent_v1";
export const COOKIE_CONSENT_CHANGE_EVENT = "cg-cookie-consent-change";
export const OPEN_COOKIE_PREFERENCES_EVENT = "cg-open-cookie-preferences";

/**
 * Safely reads the visitor's saved cookie consent decision from localStorage.
 */
export function readCookieConsent(): CookieConsentStatus {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (raw === "accepted" || raw === "rejected") {
      return raw;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists the visitor's cookie preference and notifies listeners (e.g. AnalyticsPixels).
 */
export function writeCookieConsent(
  status: Exclude<CookieConsentStatus, null>
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, status);
  } catch {
    // Ignore storage quota/privacy mode restrictions
  }
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_CHANGE_EVENT, { detail: status })
  );
}

/**
 * Reopens the cookie preferences banner (e.g. from the Footer compliance link).
 */
export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
}
