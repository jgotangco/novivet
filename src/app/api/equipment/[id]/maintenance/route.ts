import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

const CLINIC_ROLES = ["SUPER_ADMIN", "DOCTOR", "NURSE", "STAFF"];

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireRole(CLINIC_ROLES, request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  return NextResponse.json({ success: true, equipmentId: params.id, maintenanceLogged: true });
}
