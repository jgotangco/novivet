import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured on the server." }, { status: 401 });
  }

  const authHeader = request.headers.get("authorization");
  const customHeader = request.headers.get("x-cron-secret");

  const isBearerValid = authHeader === `Bearer ${cronSecret}`;
  const isCustomValid = customHeader === cronSecret;

  if (!isBearerValid && !isCustomValid) {
    return NextResponse.json({ error: "Unauthorized: Invalid cron secret." }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    triggeredAt: new Date().toISOString(),
    processedCount: 0,
    status: "Proactive communication engine completed cycle.",
  });
}
