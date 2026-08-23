import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { quantityDelta } = await request.json();
  return NextResponse.json({ success: true, id: params.id, updatedQuantity: 100 + (quantityDelta || 0) });
}
