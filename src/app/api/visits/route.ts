import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";

export async function GET() {
  const visits = await store.getVisits();
  return NextResponse.json({ visits });
}
