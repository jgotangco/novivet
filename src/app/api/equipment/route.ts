import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";

export async function GET() {
  const equipment = await store.getEquipment();
  return NextResponse.json({ equipment });
}
