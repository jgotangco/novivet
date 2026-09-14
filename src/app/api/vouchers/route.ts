import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requireSession, requireRole } from "@/lib/auth";

const CLINIC_ROLES = ["SUPER_ADMIN", "DOCTOR", "NURSE", "STAFF"];

export async function GET(request: NextRequest) {
  const auth = await requireSession(request);
  if (!auth) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // FUR_PARENT is allowed to GET vouchers ("except vouchers GET")
  const vouchers = await store.getVouchers();
  return NextResponse.json({ vouchers });
}

export async function POST(request: NextRequest) {
  const authResult = await requireRole(CLINIC_ROLES, request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ success: true, voucher: body }, { status: 201 });
}
