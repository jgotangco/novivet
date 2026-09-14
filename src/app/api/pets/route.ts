import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requireSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = await requireSession(request);
  if (!auth) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const species = searchParams.get("species") || undefined;
  const search = searchParams.get("search") || undefined;

  let pets = await store.getPets(species, search);

  // Parents see only their pets
  if (auth.user.role === "FUR_PARENT") {
    pets = pets.filter((p) => p.ownerId === auth.user.id);
  }

  return NextResponse.json({ pets });
}

export async function POST(request: NextRequest) {
  const auth = await requireSession(request);
  if (!auth) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    if (!body.name || !body.species || !body.breed) {
      return NextResponse.json({ error: "Name, species, and breed are required." }, { status: 400 });
    }

    let ownerId = body.ownerId;
    if (auth.user.role === "FUR_PARENT") {
      ownerId = auth.user.id;
    } else if (!ownerId) {
      return NextResponse.json({ error: "ownerId is required to register a pet." }, { status: 400 });
    }

    const created = await store.createPet({
      ...body,
      ownerId,
    });

    return NextResponse.json({ success: true, pet: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
