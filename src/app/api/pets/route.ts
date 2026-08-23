import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const species = searchParams.get("species") || undefined;
  const search = searchParams.get("search") || undefined;
  const pets = await store.getPets(species, search);
  return NextResponse.json({ pets });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.species || !body.breed) {
      return NextResponse.json({ error: "Name, species, and breed are required." }, { status: 400 });
    }
    const created = await store.createPet(body);
    return NextResponse.json({ success: true, pet: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
