import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/checklist/[jobId] — get all checklist items for a job
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  const items = await prisma.checklistItem.findMany({
    where: { jobId },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(items);
}

// PATCH /api/checklist/[jobId] — update checklist items (batch)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const body = await request.json();

  // body.updates: Array<{ id: string, result: string, notes?: string }>
  const { updates } = body;

  if (!Array.isArray(updates)) {
    return NextResponse.json(
      { error: "updates array is required" },
      { status: 400 }
    );
  }

  const results = await Promise.all(
    updates.map((update: { id: string; result: string; notes?: string }) =>
      prisma.checklistItem.update({
        where: { id: update.id, jobId },
        data: {
          result: update.result,
          ...(update.notes !== undefined && { notes: update.notes }),
        },
      })
    )
  );

  return NextResponse.json(results);
}
