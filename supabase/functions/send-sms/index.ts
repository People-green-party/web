import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    // 1. Supabase se OTP aur Phone number extract karna
    const payload = await req.json();
    const phone = payload.user.phone; // Example: "+917737070807"
    const otp = payload.sms.otp;      // Example: "123456"

    // 2. India IT Infotech ki Details
    const smsUser = "pgpparty";
    const smsPass = "acc04c50fcXX";

    // Exact DLT template
    const message = `${otp} is your verification code for People's Green Party.`;

    // Removing + from phone to prevent formatting issues API side
    const cleanedPhone = phone.replace('+', '');

    // 3. Apni API Call
    const url = `http://sms.indiaitinfotech.com/sendsms.jsp?user=${smsUser}&password=${smsPass}&senderid=IPGPTY&mobiles=${cleanedPhone}&sms=${encodeURIComponent(message)}&entityid=1701165113133141933&tempid=1707177217726034212&accusage=1&unicode=1`;

    const response = await fetch(url);
    const textData = await response.text();

    // 4. Supabase ko vapis Success batana
    return new Response(JSON.stringify({ success: true, api_response: textData }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
})
