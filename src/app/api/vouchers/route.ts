import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";

export async function GET() {
  const vouchers = await store.getVouchers();
  return NextResponse.json({ vouchers });
}
