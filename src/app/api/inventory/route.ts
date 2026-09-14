import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requireRole } from "@/lib/auth";

const CLINIC_ROLES = ["SUPER_ADMIN", "DOCTOR", "NURSE", "STAFF"];

export async function GET(request: NextRequest) {
  const authResult = await requireRole(CLINIC_ROLES, request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const inventory = await store.getInventory();
  return NextResponse.json({ inventory });
}
