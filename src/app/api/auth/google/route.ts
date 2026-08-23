import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import { store } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, googleId, avatarUrl } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let user = await store.getUserByEmail(email);

    if (!user) {
      user = await store.createUser({
        email,
        fullName: fullName || email.split("@")[0],
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

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
