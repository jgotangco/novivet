import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie, sanitizeUser } from "@/lib/auth";
import { store } from "@/db";
import { createRemoteJWKSet, jwtVerify } from "jose";

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { idToken } = body;

    // Body without idToken (e.g. email-only) returns 401
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "idToken is required" }, { status: 401 });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      return NextResponse.json(
        { error: "Google OAuth is not configured on this server (GOOGLE_CLIENT_ID unset)." },
        { status: 503 }
      );
    }

    let payload: any;
    try {
      const verifyResult = await jwtVerify(idToken, GOOGLE_JWKS, {
        issuer: ["https://accounts.google.com", "accounts.google.com"],
        audience: googleClientId,
      });
      payload = verifyResult.payload;
    } catch {
      return NextResponse.json({ error: "Invalid Google ID token." }, { status: 401 });
    }

    const email = payload.email as string;
    if (!email) {
      return NextResponse.json({ error: "Token does not contain email." }, { status: 401 });
    }

    const fullName = (payload.name as string) || email.split("@")[0];
    const avatarUrl = payload.picture as string | undefined;
    const googleId = payload.sub as string;

    let user = await store.getUserByEmail(email);

    if (!user) {
      user = await store.createUser({
        email,
        fullName,
        role: "FUR_PARENT",
        metadata: { googleId, avatarUrl, provider: "google" },
      });
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as any,
      specialty: user.metadata?.specialty,
      avatarUrl: user.metadata?.avatarUrl,
      isSuperAdmin: user.role === "SUPER_ADMIN",
    });

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
