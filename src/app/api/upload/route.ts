import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "File upload is not implemented in this demo (GCS is disabled)." },
    { status: 501 }
  );
}
