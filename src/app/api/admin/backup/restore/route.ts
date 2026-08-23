import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { getCurrentSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Super Admin access required." }, { status: 403 });
  }

  try {
    const data = await request.json();
    const result = await store.restoreFullBackup(data);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to restore backup snapshot." }, { status: 500 });
  }
}
