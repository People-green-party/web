"use client";

import { getApiBaseUrl } from "./api";

type OtpLoginResult = {
  access_token: string;
  user?: Record<string, unknown>;
};

async function readJson(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Complete portal login after Supabase has verified the SMS code.
 *
 * Existing linked accounts can use the verified Supabase session directly.
 * Legacy accounts fall back to the backend exchange route, which links the
 * verified Supabase identity to the existing phone-based member record.
 */
export async function completeOtpLogin(phone: string, supabaseToken: string): Promise<OtpLoginResult> {
  const baseUrl = getApiBaseUrl();
  const headers = {
    Authorization: `Bearer ${supabaseToken}`,
    "Content-Type": "application/json",
  };

  const summaryResponse = await fetch(`${baseUrl}/users/me/summary`, {
    method: "GET",
    cache: "no-store",
    headers,
  });
  if (summaryResponse.ok) {
    const summary = await readJson(summaryResponse);
    return {
      access_token: supabaseToken,
      user: summary?.user,
    };
  }

  const exchangeResponse = await fetch(`${baseUrl}/users/login-otp`, {
    method: "POST",
    cache: "no-store",
    headers,
    body: JSON.stringify({ phone }),
  });
  const exchange = await readJson(exchangeResponse);
  if (exchangeResponse.ok && exchange?.access_token) {
    return exchange;
  }

  if (exchangeResponse.status === 404) {
    throw new Error("OTP was verified, but the login service is still updating. Please try again shortly.");
  }

  throw new Error(
    exchange?.message || exchange?.error || "OTP was verified, but login could not be completed.",
  );
}
