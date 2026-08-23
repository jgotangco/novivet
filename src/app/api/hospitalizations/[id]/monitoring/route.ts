import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  return NextResponse.json({ success: true, monitoringId: `mon-${Date.now()}`, data: body });
}
