import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

function normalizePhone(phone: string) {
  let p = phone.trim().replace(/[^\d+]/g, "");

  if (p.includes("+")) {
    p = "+" + p.replace(/\+/g, "");
  }

  return p;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, wantSms, slotTime, timezone } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (phone && typeof phone !== "string") {
      return NextResponse.json({ error: "Phone must be a string" }, { status: 400 });
    }

    if (typeof wantSms !== "undefined" && typeof wantSms !== "boolean") {
      return NextResponse.json({ error: "wantSms must be true or false" }, { status: 400 });
    }

    if (!slotTime || typeof slotTime !== "number" || slotTime < Date.now() - 60000) {
      return NextResponse.json({ error: "Invalid slot time" }, { status: 400 });
    }

    if (!timezone || typeof timezone !== "string") {
      return NextResponse.json({ error: "Timezone is required" }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhoneRaw = typeof phone === "string" ? phone.trim() : "";
    const cleanPhone = cleanPhoneRaw ? normalizePhone(cleanPhoneRaw) : "";
    const smsOptIn = wantSms ?? false;

    const reminderTime = new Date(slotTime - 60 * 60 * 1000);

    await createSession({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      wantSms: smsOptIn,
      slotTime,
      timezone,
    });

    // Send contact to Brevo
    try {
      const brevoAttributes: Record<string, unknown> = {
        FIRSTNAME: cleanName,
        WANT_SMS: smsOptIn,
        WEBINAR_TIME: new Date(slotTime).toISOString(),
        REMINDER_TIME: reminderTime.toISOString(),
        TIMEZONE: timezone,
      };
    
      if (cleanPhone) {
        brevoAttributes.SMS = cleanPhone;
      }
    
      const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
        },
        body: JSON.stringify({
          email: cleanEmail,
          attributes: brevoAttributes,
          updateEnabled: true,
        }),
      });
    
      if (!brevoRes.ok) {
        const errorText = await brevoRes.text();
        console.error("Brevo contact failed:", errorText);
      }
    } catch (brevoError) {
      console.error("Brevo request failed:", brevoError);
    }

    const redirectTo = slotTime <= Date.now() ? "/watch" : "/waiting";

    return NextResponse.json({ success: true, redirectTo });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
