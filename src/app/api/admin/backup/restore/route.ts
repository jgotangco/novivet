import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requireRole } from "@/lib/auth";
import { z } from "zod";

const backupSnapshotSchema = z.object({
  version: z.string().optional(),
  developer: z.string().optional(),
  exportedAt: z.string().optional(),
  clinicSettings: z.record(z.any()).optional(),
  users: z.array(z.record(z.any())).max(10000, "Users array cannot exceed 10,000 items").optional(),
  clinicalServices: z.array(z.record(z.any())).max(10000, "Services array cannot exceed 10,000 items").optional(),
  themes: z.array(z.record(z.any())).max(10000, "Themes array cannot exceed 10,000 items").optional(),
  pets: z.array(z.record(z.any())).max(10000, "Pets array cannot exceed 10,000 items").optional(),
  visits: z.array(z.record(z.any())).max(10000, "Visits array cannot exceed 10,000 items").optional(),
  immunizations: z.array(z.record(z.any())).max(10000, "Immunizations array cannot exceed 10,000 items").optional(),
  procedures: z.array(z.record(z.any())).max(10000, "Procedures array cannot exceed 10,000 items").optional(),
  hospitalizations: z.array(z.record(z.any())).max(10000, "Hospitalizations array cannot exceed 10,000 items").optional(),
  inventory: z.array(z.record(z.any())).max(10000, "Inventory array cannot exceed 10,000 items").optional(),
  equipment: z.array(z.record(z.any())).max(10000, "Equipment array cannot exceed 10,000 items").optional(),
  vouchers: z.array(z.record(z.any())).max(10000, "Vouchers array cannot exceed 10,000 items").optional(),
  communications: z.array(z.record(z.any())).max(10000, "Communications array cannot exceed 10,000 items").optional(),
});

export async function POST(request: NextRequest) {
  const authResult = await requireRole(["SUPER_ADMIN"], request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Enforce confirmation header
  const confirmHeader =
    request.headers.get("x-confirm-action") ||
    request.headers.get("x-confirm") ||
    request.headers.get("x-confirm-restore");

  if (confirmHeader !== "confirm" && confirmHeader !== "true") {
    return NextResponse.json(
      { error: "Confirmation header required (e.g. x-confirm-action: confirm or x-confirm: true)." },
      { status: 400 }
    );
  }

  try {
    const rawData = await request.json();
    const validatedData = backupSnapshotSchema.parse(rawData);
    const result = await store.restoreFullBackup(validatedData as any);
    return NextResponse.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid backup snapshot", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Failed to restore backup snapshot." }, { status: 500 });
  }
}
