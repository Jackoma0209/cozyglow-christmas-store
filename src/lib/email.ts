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

export interface EmailConfig {
  apiKey: string | undefined;
  helloFrom: string;
  ordersFrom: string;
  replyTo: string;
  audienceId: string | undefined;
  siteUrl: string;
  welcomeCode: string;
}

export interface ResendEmailTag {
  name: string;
  value: string;
}

export interface SendResendEmailResult {
  ok: boolean;
  id?: string;
  status?: number;
  error?: string;
}

export interface AudienceSubscribeResult {
  added: boolean;
  contactId?: string;
  skipped?: string;
  error?: string;
}

export interface NewsletterWelcomeResult {
  sent: boolean;
  demoMode?: boolean;
  messageId?: string;
  skipped?: string;
  error?: string;
  welcomeCode: string;
}

/**
 * Resolves Resend sender identities, domain URLs, and newsletter defaults
 * from environment variables with verified cozyglowhome.com fallbacks.
 */
export function getEmailConfig(): EmailConfig {
  const rawSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://cozyglowhome.com";

  return {
    apiKey: process.env.RESEND_API_KEY?.trim() || undefined,
    helloFrom:
      process.env.EMAIL_FROM_HELLO?.trim() ||
      "CozyGlow™ Home Aromatics <hello@cozyglowhome.com>",
    ordersFrom:
      process.env.EMAIL_FROM?.trim() ||
      "CozyGlow™ Orders <orders@cozyglowhome.com>",
    replyTo: PRODUCT_CONFIG.supportEmail,
    audienceId: process.env.RESEND_AUDIENCE_ID?.trim() || undefined,
    siteUrl: rawSiteUrl.replace(/\/+$/, ""),
    welcomeCode: process.env.NEWSLETTER_WELCOME_CODE?.trim() || "COZY10",
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends a single email via the Resend REST API with timeout and structured result handling.
 */
export async function sendResendEmail(params: {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  tags?: ResendEmailTag[];
}): Promise<SendResendEmailResult> {
  try {
    const payload: Record<string, unknown> = {
      from: params.from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
    };

    if (params.replyTo) {
      payload.reply_to = params.replyTo;
    }
    if (params.text) {
      payload.text = params.text;
    }
    if (params.tags && params.tags.length > 0) {
      payload.tags = params.tags;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `Resend email failed (${response.status}):`,
        errorText.slice(0, 300)
      );
      return {
        ok: false,
        status: response.status,
        error: errorText.slice(0, 300) || `HTTP ${response.status}`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id, status: response.status };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Network request failed";
    console.error("Resend email request error:", error);
    return { ok: false, error: message };
  }
}

export async function sendOrderEmails(data: OrderEmailData): Promise<{
  customerSent: boolean;
  ownerSent: boolean;
  skipped?: string;
}> {
  const emailConfig = getEmailConfig();
  const apiKey = emailConfig.apiKey;
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

  const fromAddress = emailConfig.ordersFrom;
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

    const customerResult = await sendResendEmail({
      apiKey,
      from: fromAddress,
      to: data.customerEmail,
      replyTo: emailConfig.replyTo,
      subject: `CozyGlow™ Order Confirmed (${data.orderRef})`,
      html: customerHtml,
      tags: [{ name: "category", value: "order_confirmation" }],
    });
    customerSent = customerResult.ok;
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

    const ownerResult = await sendResendEmail({
      apiKey,
      from: fromAddress,
      to: ownerEmail,
      subject: `[FULFILL] CozyGlow ${data.orderRef} — ${formatMoney(
        data.amountTotal,
        data.currency
      )}`,
      html: ownerHtml,
      tags: [{ name: "category", value: "owner_fulfillment" }],
    });
    ownerSent = ownerResult.ok;
  }

  return { customerSent, ownerSent };
}

/**
 * Adds or updates a newsletter subscriber in a configured Resend Audience.
 * Non-fatal when RESEND_AUDIENCE_ID is unset or if the Contacts API call fails.
 */
export async function addSubscriberToResendAudience(params: {
  email: string;
  firstName?: string;
}): Promise<AudienceSubscribeResult> {
  const { apiKey, audienceId } = getEmailConfig();

  if (!apiKey) {
    return { added: false, skipped: "RESEND_API_KEY not configured" };
  }
  if (!audienceId) {
    return { added: false, skipped: "RESEND_AUDIENCE_ID not configured" };
  }

  try {
    const response = await fetch(
      `https://api.resend.com/audiences/${encodeURIComponent(audienceId)}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: params.email,
          ...(params.firstName ? { first_name: params.firstName } : {}),
          unsubscribed: false,
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `Resend audience contact creation failed (${response.status}):`,
        errorText.slice(0, 300)
      );
      return {
        added: false,
        error: errorText.slice(0, 300) || `HTTP ${response.status}`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return { added: true, contactId: data.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Network request failed";
    console.error("Resend audience request error:", error);
    return { added: false, error: message };
  }
}

/**
 * Triggers the branded CozyGlow™ welcome autoresponder email from hello@cozyglowhome.com
 * when a visitor subscribes via the newsletter capture form.
 */
export async function sendNewsletterWelcomeEmail(params: {
  email: string;
  firstName?: string;
  siteUrl?: string;
}): Promise<NewsletterWelcomeResult> {
  const config = getEmailConfig();
  const cleanSiteUrl = (params.siteUrl?.trim() || config.siteUrl).replace(
    /\/+$/,
    ""
  );
  const welcomeCode = config.welcomeCode;
  const greetingName = params.firstName?.trim() || "Friend";

  if (!config.apiKey) {
    console.info(
      `[CozyGlow] Newsletter signup for ${params.email} — demo mode (RESEND_API_KEY not configured).`
    );
    return {
      sent: false,
      demoMode: true,
      skipped: "RESEND_API_KEY not configured",
      welcomeCode,
    };
  }

  const scentRecipes = [
    {
      title: "Cinnamon Bark Hearth",
      drops: "3 drops Cinnamon Bark + 1 drop Sweet Orange",
      vibe: "Classic spiced holiday warmth for living room evenings.",
    },
    {
      title: "Nordic Pine Forest",
      drops: "3 drops Scots Pine + 1 drop Frosted Cedar",
      vibe: "Freshly cut Christmas tree aroma for artificial trees.",
    },
    {
      title: "Vanilla Fireside Calm",
      drops: "2 drops Vanilla Bean + 2 drops Cashmere Woods",
      vibe: "Whisper-quiet 1800K bedtime glow and soothing night mist.",
    },
  ];

  const recipesHtml = scentRecipes
    .map(
      (recipe) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #ece5d8;">
            <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#10241D;">
              ${escapeHtml(recipe.title)}
            </p>
            <p style="margin:0 0 2px;font-size:12px;font-weight:700;color:#B91C1C;">
              ${escapeHtml(recipe.drops)}
            </p>
            <p style="margin:0;font-size:12px;color:#4b5563;line-height:1.45;">
              ${escapeHtml(recipe.vibe)}
            </p>
          </td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#FDF8EE;padding:24px;color:#10241D;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e5dfd3;overflow:hidden;">
        <div style="background:#0F241C;color:#FFFDF8;padding:28px 24px;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#FCD34D;font-weight:700;">
            CozyGlow™ Holiday Club &bull; cozyglowhome.com
          </p>
          <h1 style="margin:0 0 8px;font-size:24px;line-height:1.25;color:#ffffff;">
            Welcome home, ${escapeHtml(greetingName)}!
          </h1>
          <p style="margin:0;font-size:14px;line-height:1.5;color:#F7ECD8;">
            Thank you for joining CozyGlow™ Home Aromatics. Your 10% welcome gift and festive chimney mist recipes are ready below.
          </p>
        </div>

        <div style="padding:24px;">
          <div style="background:#FFFDF8;border:2px dashed #F59E0B;border-radius:14px;padding:18px;text-align:center;margin-bottom:22px;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#991B1B;font-weight:700;">
              Your 10% Off Welcome Gift
            </p>
            <p style="margin:0 0 6px;font-size:26px;letter-spacing:0.1em;font-weight:800;color:#10241D;font-family:monospace;">
              ${escapeHtml(welcomeCode)}
            </p>
            <p style="margin:0;font-size:12px;color:#4b5563;">
              Enter this code in the promo box at Stripe Checkout on cozyglowhome.com.
            </p>
          </div>

          <h2 style="margin:0 0 10px;font-size:16px;color:#10241D;">
            3 Festive Chimney Scent Recipes (200ml Tank)
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">
            ${recipesHtml}
          </table>

          <div style="text-align:center;margin-bottom:22px;">
            <a href="${escapeHtml(cleanSiteUrl)}" style="display:inline-block;background:#B91C1C;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 24px;border-radius:12px;">
              Claim Your CozyGlow™ Cottage &rarr;
            </a>
          </div>

          <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;border-top:1px solid #ece5d8;padding-top:16px;">
            Sent by CozyGlow™ Home Aromatics (<a href="mailto:hello@cozyglowhome.com" style="color:#10241D;">hello@cozyglowhome.com</a>).
            Questions or want to unsubscribe? Reply directly to this email or contact
            <a href="mailto:${escapeHtml(config.replyTo)}" style="color:#10241D;">${escapeHtml(
    config.replyTo
  )}</a> anytime.
          </p>
        </div>
      </div>
    </div>`;

  const text = [
    `Welcome home, ${greetingName}!`,
    "",
    "Thank you for joining the CozyGlow™ Holiday Club on cozyglowhome.com.",
    "",
    `YOUR 10% WELCOME CODE: ${welcomeCode}`,
    "Enter this code in the promo box at checkout.",
    "",
    "3 Festive Chimney Scent Recipes (for your 200ml CozyGlow™ tank):",
    ...scentRecipes.map(
      (r) => `- ${r.title}: ${r.drops} (${r.vibe})`
    ),
    "",
    `Claim Your CozyGlow™ Cottage: ${cleanSiteUrl}`,
    "",
    `Questions or unsubscribe? Reply to hello@cozyglowhome.com or email ${config.replyTo}.`,
  ].join("\n");

  const result = await sendResendEmail({
    apiKey: config.apiKey,
    from: config.helloFrom,
    to: params.email,
    replyTo: config.replyTo,
    subject: `Welcome to CozyGlow™ — Here's your 10% code (${welcomeCode}) + Festive Scent Recipes`,
    html,
    text,
    tags: [{ name: "category", value: "newsletter_welcome" }],
  });

  return {
    sent: result.ok,
    demoMode: false,
    messageId: result.id,
    error: result.error,
    welcomeCode,
  };
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
