import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requireRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authResult = await requireRole(["SUPER_ADMIN"], request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const backup = await store.exportFullBackup();

  // Ensure password_hash and pin_hash are stripped from every user
  if (backup.users && Array.isArray(backup.users)) {
    backup.users = backup.users.map((user: any) => {
      const { password_hash, pin_hash, ...sanitized } = user;
      return sanitized;
    });
  }

  return NextResponse.json(backup);
}
