import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/jobs/[jobId] — get single job with all related data
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      checklistItems: { orderBy: { sortOrder: "asc" } },
      punchListItems: { orderBy: { createdAt: "desc" } },
      signoff: true,
      photos: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}

// PATCH /api/jobs/[jobId] — update job phase/status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const body = await request.json();

  const job = await prisma.job.update({
    where: { id: jobId },
    data: body,
  });

  return NextResponse.json(job);
}

// DELETE /api/jobs/[jobId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  await prisma.job.delete({ where: { id: jobId } });

  return NextResponse.json({ success: true });
}
