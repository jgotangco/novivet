import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ procedures: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true, procedure: { id: `proc-${Date.now()}`, ...body } }, { status: 201 });
}
