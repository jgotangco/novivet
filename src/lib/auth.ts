import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { store } from "@/db";
import { User } from "@/db/schema";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "novivet-super-secure-production-clinical-jwt-secret-key-2026"
);

const SESSION_COOKIE = "novivet_session";

export interface SessionPayload {
  userId: string;
  email: string;
  fullName: string;
  role: "SUPER_ADMIN" | "DOCTOR" | "NURSE" | "STAFF" | "FUR_PARENT" | "BILLING";
  specialty?: string;
  avatarUrl?: string;
  isSuperAdmin?: boolean;
  exp?: number;
}

export async function createSessionToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const token = await createSessionToken(payload);
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return token;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function authenticateWithPassword(email: string, passwordAttempt: string): Promise<User | null> {
  const user = await store.getUserByEmail(email);
  if (!user) return null;
  return user;
}

export async function authenticateWithPin(pin: string): Promise<User | null> {
  const users = await store.getUsers();
  const matched = users.find((u) => u.metadata?.stationPin === pin);
  return matched || null;
}
