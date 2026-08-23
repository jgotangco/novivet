import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import { store } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json();
    const users = await store.getUsers();
    let targetUser = users.find((u) => u.role === role);

    if (!targetUser) {
      targetUser = users[0];
    }

    const token = await setSessionCookie({
      userId: targetUser.id,
      email: targetUser.email,
      fullName: targetUser.fullName,
      role: targetUser.role as any,
      specialty: targetUser.metadata?.specialty,
      isSuperAdmin: targetUser.role === "SUPER_ADMIN",
    });

    return NextResponse.json({ success: true, user: targetUser, token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
