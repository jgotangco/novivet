import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || undefined;
  const users = await store.getUsers(role);
  return NextResponse.json({ users });
}
