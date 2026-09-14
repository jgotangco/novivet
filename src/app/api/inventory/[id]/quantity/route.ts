import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

const CLINIC_ROLES = ["SUPER_ADMIN", "DOCTOR", "NURSE", "STAFF"];

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireRole(CLINIC_ROLES, request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { quantityDelta } = await request.json().catch(() => ({}));
  return NextResponse.json({ success: true, id: params.id, updatedQuantity: 100 + (quantityDelta || 0) });
}
