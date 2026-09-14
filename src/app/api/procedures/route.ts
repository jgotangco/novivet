import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

const CLINIC_ROLES = ["SUPER_ADMIN", "DOCTOR", "NURSE", "STAFF"];

export async function GET(request: NextRequest) {
  const authResult = await requireRole(CLINIC_ROLES, request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  return NextResponse.json({ procedures: [] });
}

export async function POST(request: NextRequest) {
  const authResult = await requireRole(CLINIC_ROLES, request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ success: true, procedure: { id: `proc-${Date.now()}`, ...body } }, { status: 201 });
}
