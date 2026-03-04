import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/signoff/[jobId]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  const signoff = await prisma.signoff.findUnique({
    where: { jobId },
  });

  return NextResponse.json(signoff);
}

// POST /api/signoff/[jobId] — submit signature or PM approval
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const body = await request.json();
  const { clientConcerns, signatureData, pmApproval, pmName } = body;

  // Upsert — create or update
  const signoff = await prisma.signoff.upsert({
    where: { jobId },
    create: {
      jobId,
      clientConcerns: clientConcerns || "",
      signatureData: signatureData || null,
      pmApproval: pmApproval || false,
      pmName: pmName || "",
    },
    update: {
      clientConcerns: clientConcerns || "",
      signatureData: signatureData || null,
      pmApproval: pmApproval || false,
      pmName: pmName || "",
    },
  });

  // If signed off, mark job as completed and advance to phase 3 done
  if (signatureData || pmApproval) {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "completed" },
    });
  }

  return NextResponse.json(signoff, { status: 201 });
}
