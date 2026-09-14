import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { User, Pet } from "@/db/schema";
import { verifyPassword, verifyPin } from "./passwords";

export const SESSION_COOKIE = "novivet_session";

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

export function getJwtSecretForSigning(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  const isProd = process.env.NODE_ENV === "production" || !!process.env.K_SERVICE;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing");
  }

  if (isProd && secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production or Cloud Run");
  }

  return new TextEncoder().encode(secret);
}

export function getJwtSecretForVerification(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const secret = getJwtSecretForSigning();
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const secret = getJwtSecretForVerification();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentSession(request?: NextRequest): Promise<SessionPayload | null> {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get(SESSION_COOKIE)?.value;
  }

  if (!token) {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(SESSION_COOKIE)?.value;
    } catch {
      // Ignore if called outside request header scope
    }
  }

  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const token = await createSessionToken(payload);
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || !!process.env.K_SERVICE,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return token;
}

export async function clearSessionCookie(): Promise<void> {
  try {
    const cookieStore = cookies();
    cookieStore.delete(SESSION_COOKIE);
  } catch {
    // Ignore outside request scope
  }
}

export function sanitizeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}

export async function authenticateWithPassword(email: string, passwordAttempt: string): Promise<User | null> {
  if (!email || !passwordAttempt) return null;
  const user = await store.getUserByEmail(email);
  if (!user || !user.password_hash) return null;
  const isValid = await verifyPassword(passwordAttempt, user.password_hash);
  if (!isValid) return null;
  return user;
}

export async function authenticateWithPin(
  pin: string,
  context?: { email?: string; role?: string }
): Promise<{ user: User | null; error: string | null }> {
  if (!/^\d{6}$/.test(pin)) {
    return { user: null, error: "Station PIN must be exactly 6 numeric digits." };
  }

  const users = await store.getUsers();
  let candidateUsers = users.filter((u) => !!u.pin_hash);

  if (context?.email) {
    candidateUsers = candidateUsers.filter((u) => u.email.toLowerCase() === context.email!.toLowerCase());
  } else if (context?.role) {
    candidateUsers = candidateUsers.filter((u) => u.role === context.role);
  }

  if (candidateUsers.length === 0) {
    return { user: null, error: "No station credentials found." };
  }

  for (const user of candidateUsers) {
    if (user.pin_locked_until && new Date() < new Date(user.pin_locked_until)) {
      return {
        user: null,
        error: "Station PIN is locked due to too many failed attempts. Try again in 15 minutes.",
      };
    }

    const isMatch = await verifyPin(pin, user.pin_hash!);
    if (isMatch) {
      await store.resetPinFailures(user);
      return { user, error: null };
    } else {
      await store.recordPinFailure(user);
    }
  }

  return { user: null, error: "Invalid Station PIN code." };
}

// AUTHORIZATION HELPERS (Reload role from store)
export async function requireSession(request?: NextRequest): Promise<{ session: SessionPayload; user: User } | null> {
  const session = await getCurrentSession(request);
  if (!session) return null;

  const user = await store.getUserById(session.userId);
  if (!user) return null;

  // Reload current role from the store to prevent stale tokens
  session.role = user.role;
  return { session, user };
}

export async function requireRole(
  allowedRoles: string[],
  request?: NextRequest
): Promise<{ session: SessionPayload; user: User } | NextResponse> {
  const auth = await requireSession(request);
  if (!auth) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!allowedRoles.includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
  }

  return auth;
}

export async function requirePetAccess(
  petId: string,
  request?: NextRequest
): Promise<{ pet: Pet; session: SessionPayload; user: User } | NextResponse> {
  const auth = await requireSession(request);
  if (!auth) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const pet = await store.getPetById(petId);
  if (!pet) {
    return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  }

  if (auth.user.role === "FUR_PARENT" && pet.ownerId !== auth.user.id) {
    return NextResponse.json({ error: "Forbidden: access restricted to pet owner" }, { status: 403 });
  }

  return { pet, session: auth.session, user: auth.user };
}
