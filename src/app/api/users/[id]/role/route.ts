import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requireSession, sanitizeUser } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireSession(request);
  if (!auth) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  // Reloaded role must be SUPER_ADMIN only (STAFF cannot promote)
  if (auth.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden: Only SUPER_ADMIN can change user roles." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { role } = body;
  if (!role) {
    return NextResponse.json({ error: "Role is required." }, { status: 400 });
  }

  const updated = await store.updateUserRole(params.id, role);
  if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ success: true, user: sanitizeUser(updated) });
}
