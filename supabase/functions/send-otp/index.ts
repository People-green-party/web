import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    // 1. Parse the payload from Supabase Auth
    const payload = await req.json();

    // Extract phone and OTP based on Supabase's hook payload structure
    const phone = payload.user?.phone || '';
    const otp = payload.sms?.otp || payload.otp || '';

    if (!phone || !otp) {
      return new Response(JSON.stringify({ error: "Missing phone or OTP" }), { status: 400 });
    }

    // 2. Format the message EXACTLY as approved in your DLT portal
    const message = `${otp} is your verification code for People's Green Party.`;

    // 3. Get the API password from secure environment variables
    const password = Deno.env.get("INDIAIT_PASSWORD");
    if (!password) {
      throw new Error("Missing INDIAIT_PASSWORD in environment variables");
    }

    // 4. Construct the URL using safe URL parameters
    const url = new URL("http://sms.indiaitinfotech.com/sendsms.jsp");
    url.searchParams.append("user", "pgpparty");
    url.searchParams.append("password", password);
    url.searchParams.append("senderid", "IPGPTY");
    url.searchParams.append("mobiles", phone);
    url.searchParams.append("sms", message);
    url.searchParams.append("accusage", "1"); // 1 = Transactional
    url.searchParams.append("entityid", "1701165113133141933");
    url.searchParams.append("tempid", "1707177217726034212");

    // 5. Send the Request to India IT Infotech
    const response = await fetch(url.toString(), {
      method: "GET",
    });

    const resultText = await response.text();

    if (!response.ok) {
      console.error("SMS Gateway Error HTTP Status:", response.status, resultText);
      throw new Error(`Gateway returned status ${response.status}`);
    }

    // IndiaITInfotech returns CSV-like string on success (e.g., "sent,000,success...")
    console.log(`Successfully sent OTP to ${phone}. Gateway response:`, resultText);

    // 6. Tell Supabase the SMS was sent successfully
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Edge Function Exception:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
