import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { getCurrentSession } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
  }

  const { role } = await request.json();
  const updated = await store.updateUserRole(params.id, role);
  if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ success: true, user: updated });
}
