import { CurrencyCode, PRODUCT_CONFIG, formatMoney } from "@/config/product";

export interface OrderLineItemSummary {
  description: string;
  quantity: number;
  amountTotal: number;
}

export interface OrderEmailData {
  orderRef: string;
  sessionId: string;
  paymentIntentId?: string | null;
  isUpsell: boolean;
  parentOrderRef?: string | null;
  bundleId?: string | null;
  cottageQty?: number | null;
  includeOrderBump: boolean;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  shippingAddressLines: string[];
  shippingCountry?: string | null;
  lineItems: OrderLineItemSummary[];
  currency: CurrencyCode;
  amountSubtotal: number;
  amountShipping: number;
  amountTotal: number;
  shippingMethodLabel?: string | null;
  siteUrl: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendResendEmail(params: {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.from,
      to: [params.to],
      reply_to: params.replyTo,
      subject: params.subject,
      html: params.html,
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error(
      `Resend email failed (${response.status}):`,
      errorText.slice(0, 300)
    );
    return false;
  }
  return true;
}

export async function sendOrderEmails(data: OrderEmailData): Promise<{
  customerSent: boolean;
  ownerSent: boolean;
  skipped?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.info(
      `[CozyGlow] Order ${data.orderRef} confirmed — skipping email send (RESEND_API_KEY not configured).`
    );
    return {
      customerSent: false,
      ownerSent: false,
      skipped: "RESEND_API_KEY not configured",
    };
  }

  const fromAddress =
    process.env.EMAIL_FROM?.trim() ||
    "CozyGlow™ Orders <onboarding@resend.dev>";
  const ownerEmail = process.env.OWNER_FULFILLMENT_EMAIL?.trim();
  const trackUrl = `${data.siteUrl.replace(/\/+$/, "")}/track?order=${encodeURIComponent(
    data.orderRef
  )}`;

  const lineItemsHtml = data.lineItems
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#11231b;font-size:14px;">
            ${escapeHtml(item.description)} &times; ${item.quantity}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#11231b;font-size:14px;font-weight:700;text-align:right;">
            ${escapeHtml(formatMoney(item.amountTotal, data.currency))}
          </td>
        </tr>`
    )
    .join("");

  const addressHtml =
    data.shippingAddressLines.length > 0
      ? data.shippingAddressLines.map(escapeHtml).join("<br />")
      : "No shipping address collected (e.g. merged VIP add-on)";

  let customerSent = false;
  let ownerSent = false;

  if (data.customerEmail) {
    const customerHtml = `
      <div style="font-family:Arial,sans-serif;background:#faf7f2;padding:24px;color:#11231b;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e5dfd3;overflow:hidden;">
          <div style="background:#0f241c;color:#faf7f2;padding:24px;">
            <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#fcd34d;font-weight:700;">
              CozyGlow™ Home Aromatics
            </p>
            <h1 style="margin:8px 0 4px;font-size:22px;">
              ${data.isUpsell ? "VIP Add-On Confirmed" : "Your CozyGlow™ Order Is Confirmed"}
            </h1>
            <p style="margin:0;font-size:14px;color:#e5e7eb;">
              Order Reference: <strong>${escapeHtml(data.orderRef)}</strong>
              ${
                data.parentOrderRef
                  ? ` (Merged with ${escapeHtml(data.parentOrderRef)})`
                  : ""
              }
            </p>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 16px;font-size:14px;line-height:1.5;">
              Hi ${escapeHtml(data.customerName || "there")}, thank you for ordering with CozyGlow™! Our express holiday warehouse team is preparing your parcel for 24-hour dispatch.
            </p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
              ${lineItemsHtml}
              <tr>
                <td style="padding:10px 0;color:#4b5563;font-size:13px;">Shipping (${escapeHtml(
                  data.shippingMethodLabel || "Tracked Holiday Delivery"
                )})</td>
                <td style="padding:10px 0;color:#047857;font-size:13px;font-weight:700;text-align:right;">
                  ${
                    data.amountShipping === 0
                      ? "FREE"
                      : escapeHtml(formatMoney(data.amountShipping, data.currency))
                  }
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0 0;font-size:16px;font-weight:700;">Total Paid</td>
                <td style="padding:12px 0 0;font-size:16px;font-weight:700;text-align:right;">
                  ${escapeHtml(formatMoney(data.amountTotal, data.currency))}
                </td>
              </tr>
            </table>
            <div style="background:#f5efe4;border-radius:12px;padding:14px;margin-bottom:20px;font-size:13px;line-height:1.5;">
              <strong>Delivery Destination:</strong><br />
              ${addressHtml}
            </div>
            <a href="${escapeHtml(trackUrl)}" style="display:inline-block;background:#b91c1c;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 20px;border-radius:10px;">
              Track Your Parcel Status
            </a>
            <p style="margin:20px 0 0;font-size:12px;color:#6b7280;">
              Questions? Reply to this email or write to ${escapeHtml(
                PRODUCT_CONFIG.supportEmail
              )}.
            </p>
          </div>
        </div>
      </div>`;

    customerSent = await sendResendEmail({
      apiKey,
      from: fromAddress,
      to: data.customerEmail,
      replyTo: PRODUCT_CONFIG.supportEmail,
      subject: `CozyGlow™ Order Confirmed (${data.orderRef})`,
      html: customerHtml,
    });
  }

  if (ownerEmail) {
    const stripePaymentUrl = data.paymentIntentId
      ? `https://dashboard.stripe.com/payments/${encodeURIComponent(
          data.paymentIntentId
        )}`
      : `https://dashboard.stripe.com/checkout/sessions/${encodeURIComponent(
          data.sessionId
        )}`;

    const ownerHtml = `
      <div style="font-family:Arial,sans-serif;padding:20px;color:#111827;">
        <h2 style="margin:0 0 8px;">New CozyGlow™ Order: ${escapeHtml(
          data.orderRef
        )}</h2>
        <p style="margin:0 0 16px;font-size:14px;color:#374151;">
          <strong>Type:</strong> ${
            data.isUpsell
              ? `Post-Purchase VIP Upsell (Merge with ${escapeHtml(
                  data.parentOrderRef || "parent order"
                )})`
              : `Primary Storefront Order (Bundle: ${escapeHtml(
                  data.bundleId || "unknown"
                )}, Qty: ${data.cottageQty ?? 1}, Oil Bump: ${
                  data.includeOrderBump ? "YES" : "NO"
                })`
          }
        </p>
        <table style="width:100%;max-width:560px;border-collapse:collapse;margin-bottom:16px;">
          ${lineItemsHtml}
          <tr>
            <td style="padding:10px 0;font-weight:700;">Total Paid</td>
            <td style="padding:10px 0;font-weight:700;text-align:right;">
              ${escapeHtml(formatMoney(data.amountTotal, data.currency))} (${data.currency.toUpperCase()})
            </td>
          </tr>
        </table>
        <div style="background:#f3f4f6;border-radius:10px;padding:14px;max-width:560px;font-size:13px;line-height:1.55;">
          <strong>Customer:</strong> ${escapeHtml(data.customerName)}<br />
          <strong>Email:</strong> ${escapeHtml(data.customerEmail || "N/A")}<br />
          <strong>Phone:</strong> ${escapeHtml(data.customerPhone || "N/A")}<br />
          <strong>Shipping Method:</strong> ${escapeHtml(
            data.shippingMethodLabel || "Standard"
          )}<br />
          <strong>Shipping Address:</strong><br />
          ${addressHtml}
        </div>
        <p style="margin:16px 0 0;font-size:13px;">
          <a href="${escapeHtml(stripePaymentUrl)}">View in Stripe Dashboard &rarr;</a>
        </p>
      </div>`;

    ownerSent = await sendResendEmail({
      apiKey,
      from: fromAddress,
      to: ownerEmail,
      subject: `[FULFILL] CozyGlow ${data.orderRef} — ${formatMoney(
        data.amountTotal,
        data.currency
      )}`,
      html: ownerHtml,
    });
  }

  return { customerSent, ownerSent };
}

export async function forwardToFulfillmentWebhook(
  data: OrderEmailData
): Promise<{ forwarded: boolean; status?: number }> {
  const webhookUrl = process.env.FULFILLMENT_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return { forwarded: false };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const secret = process.env.FULFILLMENT_WEBHOOK_SECRET?.trim();
  if (secret) {
    headers["X-Fulfillment-Secret"] = secret;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source: "cozyglow-christmas-store",
        event: "order.ready_for_fulfillment",
        ...data,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(
        `Fulfillment webhook returned ${response.status} for ${data.orderRef}`
      );
    }

    return { forwarded: response.ok, status: response.status };
  } catch (error) {
    console.error("Fulfillment webhook error:", error);
    return { forwarded: false };
  }
}
