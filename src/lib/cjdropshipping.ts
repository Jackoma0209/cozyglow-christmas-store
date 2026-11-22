export interface CJFulfillmentResult {
  submitted: boolean;
  skipped?: string;
  cjOrderId?: string;
  error?: string;
}

export interface CJOrderInput {
  orderRef: string;
  customerName: string;
  customerPhone?: string | null;
  address: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  };
  cottageQty?: number | null;
  includeOrderBump: boolean;
  bundleId?: string | null;
  isUpsell: boolean;
  siteUrl: string;
}

const CJ_API_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

let cachedAccessToken: string | null = null;
let cachedTokenExpiresAtMs = 0;

async function resolveCJAccessToken(): Promise<string | null> {
  const staticToken = process.env.CJ_ACCESS_TOKEN?.trim();
  if (staticToken) {
    return staticToken;
  }

  const apiKey = process.env.CJ_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const fiveMinutesMs = 5 * 60 * 1000;
  if (cachedAccessToken && Date.now() < cachedTokenExpiresAtMs - fiveMinutesMs) {
    return cachedAccessToken;
  }

  try {
    const res = await fetch(`${CJ_API_BASE}/authentication/getAccessToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
      signal: AbortSignal.timeout(8000),
    });

    const data = (await res.json()) as {
      result?: boolean;
      data?: { accessToken?: string; accessTokenExpiryDate?: string };
      message?: string;
    };

    if (!res.ok || !data.result || !data.data?.accessToken) {
      console.error(
        "CJdropshipping token fetch failed:",
        data.message || res.status
      );
      return null;
    }

    cachedAccessToken = data.data.accessToken;
    const expiryParsed = data.data.accessTokenExpiryDate
      ? Date.parse(data.data.accessTokenExpiryDate)
      : NaN;
    cachedTokenExpiresAtMs = Number.isFinite(expiryParsed)
      ? expiryParsed
      : Date.now() + 12 * 60 * 60 * 1000;

    return cachedAccessToken;
  } catch (err) {
    console.error("CJdropshipping auth error:", err);
    return null;
  }
}

export async function submitOrderToCJDropshipping(
  input: CJOrderInput
): Promise<CJFulfillmentResult> {
  const cottageVid = process.env.CJ_COTTAGE_VID?.trim();
  if (!cottageVid) {
    return {
      submitted: false,
      skipped: "CJ_API_KEY or CJ_COTTAGE_VID not configured",
    };
  }

  const token = await resolveCJAccessToken();
  if (!token) {
    return {
      submitted: false,
      skipped: "CJ_API_KEY or CJ_COTTAGE_VID not configured",
    };
  }

  if (!input.address.country || !input.address.line1) {
    return {
      submitted: false,
      skipped: "No shipping address on session (e.g. merged upsell)",
    };
  }

  const products: { vid: string; quantity: number }[] = [];

  if (!input.isUpsell || process.env.CJ_UPSELL_INCLUDES_COTTAGE !== "false") {
    products.push({
      vid: cottageVid,
      quantity: Math.max(1, input.cottageQty || 1),
    });
  }

  const oilTrioVid = process.env.CJ_OIL_TRIO_VID?.trim();
  if (
    oilTrioVid &&
    (input.includeOrderBump || input.bundleId === "double")
  ) {
    products.push({ vid: oilTrioVid, quantity: 1 });
  }

  const oilSixVid = process.env.CJ_OIL_SIX_VID?.trim();
  if (oilSixVid && (input.bundleId === "triple" || input.isUpsell)) {
    products.push({ vid: oilSixVid, quantity: 1 });
  }

  const parsedPayType = Number(process.env.CJ_PAY_TYPE);
  const payType = parsedPayType === 2 ? 2 : 3;
  const logisticName =
    process.env.CJ_LOGISTIC_NAME?.trim() || "CJPacket Ordinary";

  const payload = {
    orderNumber: input.orderRef.replace(/^#/, ""),
    shippingZip: input.address.postalCode || "",
    shippingAddress: input.address.line1,
    shippingAddress2: input.address.line2 || "",
    shippingCity: input.address.city || "",
    shippingProvince: input.address.state || input.address.city || "",
    shippingCountryCode: input.address.country,
    shippingCustomerName: input.customerName || "CozyGlow Customer",
    shippingPhone: input.customerPhone || "0000000000",
    logisticName,
    payType,
    products,
  };

  try {
    const response = await fetch(`${CJ_API_BASE}/shopping/order/createOrderV3`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CJ-Access-Token": token,
        Referer: input.siteUrl,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });

    const result = (await response.json()) as {
      result?: boolean;
      code?: number;
      message?: string;
      data?: { orderId?: string } | string;
    };

    if (!response.ok || !result.result) {
      const errorMsg = result.message || `HTTP ${response.status}`;
      console.error(
        `CJdropshipping createOrderV3 failed for ${input.orderRef}:`,
        errorMsg
      );
      return { submitted: false, error: errorMsg };
    }

    const cjOrderId =
      typeof result.data === "string"
        ? result.data
        : result.data?.orderId || undefined;

    return { submitted: true, cjOrderId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "CJ API request failed";
    console.error("CJdropshipping createOrderV3 error:", message);
    return { submitted: false, error: message };
  }
}
