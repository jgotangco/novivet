import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { setSessionCookie, sanitizeUser } from "@/lib/auth";
import { hashPassword } from "@/lib/passwords";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, fullName, phoneNumber, password } = body;

    if (!email || !fullName) {
      return NextResponse.json({ error: "Full name and email are required." }, { status: 400 });
    }

    const existing = await store.getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = password ? await hashPassword(password) : null;

    const user = await store.createUser({
      email,
      fullName,
      phoneNumber,
      role: "FUR_PARENT",
      password_hash: passwordHash,
      metadata: {},
    });

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as any,
    });

    return NextResponse.json({ success: true, user: sanitizeUser(user) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
