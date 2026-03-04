import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/punch-list/[itemId] — update punch list item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;
  const body = await request.json();

  const item = await prisma.punchListItem.update({
    where: { id: itemId },
    data: body,
  });

  return NextResponse.json(item);
}

// DELETE /api/punch-list/[itemId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;

  await prisma.punchListItem.delete({ where: { id: itemId } });

  return NextResponse.json({ success: true });
}
