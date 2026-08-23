import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const service = await store.getServiceById(params.id);
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });
  return NextResponse.json({ service });
}
