import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") || "localhost:3000";
  const isLocalHost = host.includes("localhost") || host.includes("127.0.0.1");
  const isKService = !!process.env.K_SERVICE;
  const isProduction = isKService || (!isLocalHost && process.env.NODE_ENV === "production");
  const isLocal = !isProduction;

  return NextResponse.json({
    isLocal,
    isProduction,
    platform: isKService ? `Google Cloud Run (${process.env.K_SERVICE})` : isLocalHost ? "Local Workstation" : "Linux / VM Deployment",
    database: process.env.DATABASE_URL?.includes("localhost") ? "PostgreSQL 16 (Local Dual Store)" : "Google Cloud SQL (PostgreSQL 16)",
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || "8080 / 3000",
    host,
  });
}
