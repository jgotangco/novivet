import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";

export async function GET() {
  const services = await store.getServices();
  return NextResponse.json({ services });
}
