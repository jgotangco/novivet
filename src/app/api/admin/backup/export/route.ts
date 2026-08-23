import { NextResponse } from "next/server";
import { store } from "@/db";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  const backup = await store.exportFullBackup();
  return NextResponse.json(backup);
}
