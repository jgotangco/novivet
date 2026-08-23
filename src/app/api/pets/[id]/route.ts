import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const pet = await store.getPetById(params.id);
  if (!pet) return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  return NextResponse.json({ pet });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const updated = await store.updatePet(params.id, body);
  if (!updated) return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  return NextResponse.json({ success: true, pet: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const deleted = await store.deletePet(params.id);
  if (!deleted) return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Pet deleted successfully." });
}
