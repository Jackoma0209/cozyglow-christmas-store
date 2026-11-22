import { cookies, headers } from "next/headers";
import type { CurrencyCode } from "@/config/product";
import {
  CURRENCY_COOKIE_NAME,
  currencyFromAcceptLanguage,
  currencyFromCountryCode,
  parseCurrencyCode,
} from "@/lib/currency";
import { StorefrontClient } from "@/components/StorefrontClient";
import { StructuredData } from "@/components/StructuredData";

export default async function StorefrontPage() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

  const cookieCurrency = parseCurrencyCode(
    cookieStore.get(CURRENCY_COOKIE_NAME)?.value
  );

  const countryHeader =
    headerStore.get("x-vercel-ip-country") ??
    headerStore.get("cf-ipcountry") ??
    headerStore.get("x-country-code");
  const geoCurrency = currencyFromCountryCode(countryHeader);

  const langCurrency = currencyFromAcceptLanguage(
    headerStore.get("accept-language")
  );

  const hasServerGeo = Boolean(cookieCurrency || geoCurrency);
  const initialCurrency: CurrencyCode =
    cookieCurrency ?? geoCurrency ?? langCurrency ?? "gbp";

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://cozyglowhome.com"
  ).replace(/\/+$/, "");

  return (
    <>
      <StructuredData currency={initialCurrency} siteUrl={siteUrl} />
      <StorefrontClient
        initialCurrency={initialCurrency}
        hasServerGeo={hasServerGeo}
      />
    </>
  );
}
