import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const settings = await store.getClinicSettings();
  const themes = await store.getThemes();
  return NextResponse.json({ settings, themes });
}

export async function PUT(request: NextRequest) {
  const authResult = await requireRole(["SUPER_ADMIN"], request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const body = await request.json();
    const updated = await store.updateClinicSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
