import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requireRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const authResult = await requireRole(["SUPER_ADMIN"], request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Enforce confirmation header
  const confirmHeader =
    request.headers.get("x-confirm-action") ||
    request.headers.get("x-confirm") ||
    request.headers.get("x-confirm-purge");

  if (confirmHeader !== "confirm" && confirmHeader !== "true") {
    return NextResponse.json(
      { error: "Confirmation header required (e.g. x-confirm-action: confirm or x-confirm: true)." },
      { status: 400 }
    );
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
