import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie, sanitizeUser } from "@/lib/auth";
import { store } from "@/db";

export async function POST(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production" || !!process.env.K_SERVICE;

  // Demo login returns 404 unless ALLOW_DEMO_LOGIN=true and not in production or Cloud Run
  if (process.env.ALLOW_DEMO_LOGIN !== "true" || isProduction) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { role } = await request.json().catch(() => ({}));
    const users = await store.getUsers();
    let targetUser = users.find((u) => u.role === role);

    if (!targetUser) {
      targetUser = users[0];
    }

    if (!targetUser) {
      return NextResponse.json({ error: "No mock user available" }, { status: 404 });
    }

    await setSessionCookie({
      userId: targetUser.id,
      email: targetUser.email,
      fullName: targetUser.fullName,
      role: targetUser.role as any,
      specialty: targetUser.metadata?.specialty,
      isSuperAdmin: targetUser.role === "SUPER_ADMIN",
    });

    return NextResponse.json({
      success: true,
      user: sanitizeUser(targetUser),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
