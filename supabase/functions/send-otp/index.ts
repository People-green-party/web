import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const jsonHeaders = { "Content-Type": "application/json" };

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

serve(async (req) => {
  try {
    // 1. Parse the payload from Supabase Auth
    const payload = await req.json();

    // Extract phone and OTP based on Supabase's hook payload structure
    const phone = payload.user?.phone || '';
    const otp = payload.sms?.otp || payload.otp || '';

    if (!phone || !otp) {
      return jsonResponse({ error: "Missing phone or OTP" }, 400);
    }

    // 2. Format the message EXACTLY as approved in your DLT portal
    const message = `${otp} is your verification code for People's Green Party.`;

    // 3. Get the API password from secure environment variables
    const smsUser = Deno.env.get("SMS_USER") || "pgpparty";
    const password = Deno.env.get("SMS_PASS") || Deno.env.get("INDIAIT_PASSWORD");
    if (!password) {
      console.error("SMS provider credentials are not configured");
      return jsonResponse({ error: "SMS provider is not configured" }, 500);
    }

    // IndiaIT's HTTP API requires the national 10-digit mobile number.
    const phoneDigits = String(phone).replace(/\D/g, "");
    const mobiles = phoneDigits.slice(-10);
    if (mobiles.length !== 10) {
      return jsonResponse({ error: "Invalid phone" }, 400);
    }

    // Keep the URL configurable so IndiaIT can provide a replacement endpoint
    // without requiring another source-code change.
    const gatewayUrl = Deno.env.get("INDIAIT_SMS_URL") ||
      "http://indiaitinfo.com/sendsms.jsp";
    let url: URL;
    try {
      url = new URL(gatewayUrl);
    } catch {
      console.error("SMS gateway URL is invalid");
      return jsonResponse({ error: "SMS provider is not configured" }, 500);
    }
    if (!/^https?:$/.test(url.protocol)) {
      console.error("SMS gateway URL uses an unsupported protocol");
      return jsonResponse({ error: "SMS provider is not configured" }, 500);
    }

    // 4. Construct the URL using safe URL parameters
    url.searchParams.append("user", smsUser);
    url.searchParams.append("password", password);
    url.searchParams.append("senderid", "IPGPTY");
    url.searchParams.append("mobiles", mobiles);
    url.searchParams.append("sms", message);
    url.searchParams.append("accusage", "1"); // 1 = Transactional
    url.searchParams.append("entityid", "1701165113133141933");
    url.searchParams.append("tempid", "1707177217726034212");

    // 5. Send the Request to India IT Infotech
    const response = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });

    const resultText = await response.text();

    if (!response.ok) {
      console.error("SMS gateway HTTP error:", response.status);
      return jsonResponse({ error: "SMS gateway is unavailable" }, 502);
    }

    // A parked/redirect page can return HTTP 200 without submitting an SMS.
    // Treat HTML and known provider errors as failures instead of reporting a false success.
    const isHtml = /<!doctype\s+html|<html[\s>]|window\.location/i.test(resultText);
    const isProviderError = /<status>\s*error\s*<\/status>|InvalidUseridPassword|\berror\b/i.test(resultText);
    const isAccepted = /\bsent\b|\bsuccess\b|<status>\s*(?:ok|success)\s*<\/status>/i.test(resultText);
    if (isHtml || isProviderError || !isAccepted) {
      console.error("SMS gateway rejected or did not accept the request");
      return jsonResponse(
        { error: "SMS could not be sent. Please contact support or try again later." },
        502,
      );
    }

    console.log("SMS gateway accepted the OTP request");

    // 6. Tell Supabase the SMS was sent successfully
    return jsonResponse({ success: true }, 200);

  } catch (error) {
    console.error("SMS hook failed:", error instanceof Error ? error.name : "unknown error");
    return jsonResponse({ error: "SMS delivery failed" }, 502);
  }
});
