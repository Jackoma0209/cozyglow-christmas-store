import { NextRequest, NextResponse } from "next/server";
import {
  addSubscriberToResendAudience,
  sendNewsletterWelcomeEmail,
} from "@/lib/email";

interface SubscribePayload {
  email?: unknown;
  firstName?: unknown;
  source?: unknown;
  website?: unknown;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const ipRequestLog = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  return realIp || "unknown";
}

function isRateLimited(ip: string, now: number): boolean {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  if (ipRequestLog.size > 500) {
    for (const [key, timestamps] of ipRequestLog.entries()) {
      const fresh = timestamps.filter((ts) => ts > cutoff);
      if (fresh.length === 0) {
        ipRequestLog.delete(key);
      } else {
        ipRequestLog.set(key, fresh);
      }
    }
  }

  const existing = ipRequestLog.get(ip) ?? [];
  const recent = existing.filter((ts) => ts > cutoff);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipRequestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  ipRequestLog.set(ip, recent);
  return false;
}

function sanitizeFirstName(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 60);
  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * Handles newsletter signups: validates input, filters bots via honeypot & rate limit,
 * optionally syncs to a Resend Audience, and triggers the welcome autoresponder.
 */
export async function POST(req: NextRequest) {
  let body: SubscribePayload;

  try {
    const parsed = (await req.json()) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json(
        { ok: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }
    body = parsed as SubscribePayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // Silently accept honeypot submissions to avoid tipping off automated bots
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json({
      ok: true,
      emailSent: false,
      audienceAdded: false,
      message: "You're on the list!",
    });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp, Date.now())) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Too many signup attempts from this connection. Please wait a few minutes and try again.",
      },
      { status: 429 }
    );
  }

  const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
  const normalizedEmail = rawEmail.toLowerCase();

  if (
    !normalizedEmail ||
    normalizedEmail.length > 254 ||
    !EMAIL_REGEX.test(normalizedEmail)
  ) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const firstName = sanitizeFirstName(body.firstName);
  const source =
    typeof body.source === "string" ? body.source.trim().slice(0, 60) : "storefront";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    req.headers.get("origin") ||
    "https://cozyglowhome.com";

  const [audienceResult, welcomeResult] = await Promise.all([
    addSubscriberToResendAudience({ email: normalizedEmail, firstName }),
    sendNewsletterWelcomeEmail({
      email: normalizedEmail,
      firstName,
      siteUrl,
    }),
  ]);

  if (welcomeResult.demoMode) {
    return NextResponse.json({
      ok: true,
      demoMode: true,
      emailSent: false,
      audienceAdded: false,
      welcomeCode: welcomeResult.welcomeCode,
      message:
        "Subscribed in demo mode! Configure RESEND_API_KEY to send live welcome emails from hello@cozyglowhome.com.",
    });
  }

  if (!welcomeResult.sent) {
    console.error(
      `[CozyGlow] Failed newsletter welcome email (${source}) for ${normalizedEmail}:`,
      welcomeResult.error
    );
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't send your welcome email right now. Please try again in a moment.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    emailSent: true,
    audienceAdded: audienceResult.added,
    messageId: welcomeResult.messageId,
    welcomeCode: welcomeResult.welcomeCode,
    message:
      "Welcome to the CozyGlow™ Holiday Club! Check your inbox for your welcome gift.",
  });
}
