import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";

export async function GET(request: NextRequest) {
  const inventory = await store.getInventory();
  return NextResponse.json({ inventory });
}
