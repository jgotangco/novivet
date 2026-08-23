import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true, equipmentId: params.id, maintenanceLogged: true });
}
