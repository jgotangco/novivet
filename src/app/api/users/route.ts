import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requireSession, sanitizeUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = await requireSession(request);
  if (!auth) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (auth.user.role === "FUR_PARENT") {
    return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || undefined;
  const users = await store.getUsers(role);

  return NextResponse.json({ users: users.map(sanitizeUser) });
}
