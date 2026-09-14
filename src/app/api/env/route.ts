import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authResult = await requireRole(["SUPER_ADMIN"], request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const isKService = !!process.env.K_SERVICE;
  const isProduction = isKService || process.env.NODE_ENV === "production";

  return NextResponse.json({
    isLocal: !isProduction,
    isProduction,
    platform: isKService ? "Google Cloud Run" : "Standard Server / Container",
    database: process.env.DATABASE_URL ? "PostgreSQL (Drizzle Connected)" : "In-Memory Data Store",
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || "8080",
  });
}
