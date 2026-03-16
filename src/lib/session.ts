import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "webinar_session";
const SLOT_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours

export type SessionPayload = {
  name: string;
  email: string;
  slotTime: number; // unix ms
  timezone: string; // IANA timezone
};

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

/** Create a signed JWT and set it as an HttpOnly cookie */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor((payload.slotTime + SLOT_DURATION_MS + 30 * 60 * 1000) / 1000)) // expires 30min after slot ends
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.ceil((payload.slotTime + SLOT_DURATION_MS + 30 * 60 * 1000 - Date.now()) / 1000),
  });
}

/** Read and verify the session from the cookie. Returns null if invalid/missing. */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const jar = await cookies();
    const cookie = jar.get(COOKIE_NAME);
    if (!cookie?.value) return null;

    const { payload } = await jwtVerify(cookie.value, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Verify a JWT token string directly (for use in middleware where cookies() isn't available) */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Clear the session cookie */
export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/** Check if current time is within the valid watching window */
export function isWithinSlotWindow(slotTime: number): boolean {
  const now = Date.now();
  return now >= slotTime && now < slotTime + SLOT_DURATION_MS;
}

/** Check if the slot has expired (past the 3-hour window) */
export function isSlotExpired(slotTime: number): boolean {
  return Date.now() >= slotTime + SLOT_DURATION_MS;
}

export { COOKIE_NAME, SLOT_DURATION_MS };
