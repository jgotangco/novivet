import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requirePetAccess } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePetAccess(params.id, request);
  if (result instanceof NextResponse) return result;
  return NextResponse.json({ pet: result.pet });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePetAccess(params.id, request);
  if (result instanceof NextResponse) return result;

  const body = await request.json().catch(() => ({}));
  // Prevent parents from altering ownership to arbitrary IDs
  if (result.user.role === "FUR_PARENT" && body.ownerId && body.ownerId !== result.user.id) {
    return NextResponse.json({ error: "Cannot transfer pet ownership" }, { status: 403 });
  }

  const updated = await store.updatePet(params.id, body);
  if (!updated) return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  return NextResponse.json({ success: true, pet: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const result = await requirePetAccess(params.id, request);
  if (result instanceof NextResponse) return result;

  const deleted = await store.deletePet(params.id);
  if (!deleted) return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Pet deleted successfully." });
}
