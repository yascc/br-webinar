import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, wantSms, slotTime, timezone } = body;

    // Validate inputs
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

    // Create signed JWT session cookie
    await createSession({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      wantSms: wantSms ?? false,
      slotTime,
      timezone,
    });

    // You can now use these values for email, SMS, database, etc.
    console.log("New signup:", {
      name: name.trim(),
      email: email.trim(),
      phone: phone || "",
      wantSms: wantSms ?? false,
      slotTime,
      timezone,
    });

    // Determine redirect based on whether slot has started
    const redirectTo = slotTime <= Date.now() ? "/watch" : "/waiting";

    return NextResponse.json({ success: true, redirectTo });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
