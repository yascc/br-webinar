import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createSession } from "@/lib/session";
import { appendLeadToSheet } from "@/lib/google-sheets";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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
    const cleanPhone = typeof phone === "string" ? phone.trim() : "";
    const smsOptIn = wantSms ?? false;

    await createSession({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      wantSms: smsOptIn,
      slotTime,
      timezone,
    });

    // Save lead to Google Sheets
    try {
      await appendLeadToSheet({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        wantSms: smsOptIn,
        slotTime,
        timezone,
      });
    } catch (sheetError) {
      console.error("Google Sheets append failed:", sheetError);
    }

    // Send emails via Resend
    if (resend) {
      const from = process.env.RESEND_FROM_EMAIL;
      const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;

      if (from && adminEmail) {
        try {
          await resend.emails.send({
            from,
            to: adminEmail,
            subject: "New webinar signup",
            html: `
              <h2>New Webinar Signup</h2>
              <p><strong>Name:</strong> ${cleanName}</p>
              <p><strong>Email:</strong> ${cleanEmail}</p>
              <p><strong>Phone:</strong> ${cleanPhone || "-"}</p>
              <p><strong>Want SMS:</strong> ${smsOptIn ? "Yes" : "No"}</p>
              <p><strong>Slot Time:</strong> ${new Date(slotTime).toISOString()}</p>
              <p><strong>Timezone:</strong> ${timezone}</p>
            `,
          });

          await resend.emails.send({
            from,
            to: cleanEmail,
            subject: "You’re registered for the webinar",
            html: `
              <h2>You’re registered, ${cleanName}!</h2>
              <p>Your webinar session has been reserved.</p>
              <p><strong>Time:</strong> ${new Date(slotTime).toLocaleString("en-US", {
                timeZone: timezone,
                dateStyle: "full",
                timeStyle: "short",
              })}</p>
              <p>Please return at your selected time to watch the webinar.</p>
            `,
          });
        } catch (emailError) {
          console.error("Resend email failed:", emailError);
        }
      }
    }

    const redirectTo = slotTime <= Date.now() ? "/watch" : "/waiting";

    return NextResponse.json({ success: true, redirectTo });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
