import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "webinar_session";
const SLOT_DURATION_MS = 3 * 60 * 60 * 1000;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /waiting and /watch routes
  if (pathname !== "/waiting" && pathname !== "/watch") {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const slotTime = payload.slotTime as number;
    const now = Date.now();
    const slotEnd = slotTime + SLOT_DURATION_MS;

    if (pathname === "/waiting") {
      // If slot has started, redirect to watch
      if (now >= slotTime) {
        return NextResponse.redirect(new URL("/watch", request.url));
      }
      return NextResponse.next();
    }

    if (pathname === "/watch") {
      // If slot hasn't started yet, redirect to waiting
      if (now < slotTime) {
        return NextResponse.redirect(new URL("/waiting", request.url));
      }
      // If slot expired (past 3h window), clear cookie and redirect to landing
      if (now >= slotEnd) {
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete(COOKIE_NAME);
        return response;
      }
      return NextResponse.next();
    }
  } catch {
    // Invalid token — clear cookie and redirect to landing
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/waiting", "/watch"],
};
