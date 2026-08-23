import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { getCurrentSession } from "@/lib/auth";

export async function GET() {
  const themes = await store.getThemes();
  const settings = await store.getClinicSettings();
  return NextResponse.json({ themes, activeThemeId: settings.activeThemeId });
}

export async function POST(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized. Only administrators can configure clinic themes." }, { status: 403 });
  }

  try {
    const body = await request.json();
    if ((body.action === "activate" || body.themeId) && body.themeId) {
      const active = await store.activateTheme(body.themeId);
      return NextResponse.json({ success: true, activeTheme: active });
    }
    return NextResponse.json({ error: "Theme ID is required." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
