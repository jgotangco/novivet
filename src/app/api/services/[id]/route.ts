import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requireRole } from "@/lib/auth";

const CLINIC_ROLES = ["SUPER_ADMIN", "DOCTOR", "NURSE", "STAFF"];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireRole(CLINIC_ROLES, request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const service = await store.getServiceById(params.id);
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });
  return NextResponse.json({ service });
}
