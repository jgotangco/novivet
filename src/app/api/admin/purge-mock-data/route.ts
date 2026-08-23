import { NextResponse } from "next/server";
import { store } from "@/db";
import { getCurrentSession } from "@/lib/auth";

export async function POST() {
  const session = await getCurrentSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Super Admin privileges required." }, { status: 403 });
  }

  try {
    const result = await store.purgeMockData();
    return NextResponse.json({
      success: true,
      message: "Sandbox mock data purged. Database is now in clean production state.",
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to purge mock data." }, { status: 500 });
  }
}
