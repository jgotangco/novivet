import { NextRequest, NextResponse } from "next/server";
import { store } from "@/db";
import { requireSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = await requireSession(request);
  if (!auth) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let visits = await store.getVisits();

  if (auth.user.role === "FUR_PARENT") {
    const allPets = await store.getPets();
    const ownedPetIds = new Set(allPets.filter((p) => p.ownerId === auth.user.id).map((p) => p.id));
    visits = visits.filter((v) => ownedPetIds.has(v.petId));
  }

  return NextResponse.json({ visits });
}
