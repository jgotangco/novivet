import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  const settings = await store.getClinicSettings();
  const themes = await store.getThemes();
  return NextResponse.json({ settings, themes });
}

export async function PUT(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized. Only clinic administrators can update vital settings." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updated = await store.updateClinicSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
