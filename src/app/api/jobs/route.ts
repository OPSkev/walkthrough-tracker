import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CHECKLIST_DEFAULTS } from "@/lib/checklist-defaults";

// GET /api/jobs — list all jobs
export async function GET() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      checklistItems: { select: { result: true } },
      punchListItems: { select: { status: true } },
      signoff: { select: { id: true, signatureData: true, pmApproval: true } },
    },
  });

  const jobsWithStats = jobs.map((job) => {
    const totalChecklist = job.checklistItems.length;
    const completedChecklist = job.checklistItems.filter(
      (i) => i.result !== "pending"
    ).length;
    const totalPunch = job.punchListItems.length;
    const completedPunch = job.punchListItems.filter(
      (i) => i.status === "complete"
    ).length;
    const hasSignoff = job.signoff
      ? !!(job.signoff.signatureData || job.signoff.pmApproval)
      : false;

    return {
      id: job.id,
      woNumber: job.woNumber,
      jobName: job.jobName,
      phase: job.phase,
      status: job.status,
      createdAt: job.createdAt,
      stats: {
        checklist: { total: totalChecklist, completed: completedChecklist },
        punchList: { total: totalPunch, completed: completedPunch },
        hasSignoff,
      },
    };
  });

  return NextResponse.json(jobsWithStats);
}

// POST /api/jobs — create job + auto-generate 55 checklist items
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { woNumber, jobName } = body;

  if (!woNumber || !jobName) {
    return NextResponse.json(
      { error: "woNumber and jobName are required" },
      { status: 400 }
    );
  }

  const job = await prisma.job.create({
    data: {
      woNumber,
      jobName,
      checklistItems: {
        create: CHECKLIST_DEFAULTS.map((item) => ({
          category: item.category,
          item: item.item,
          sortOrder: item.sortOrder,
        })),
      },
    },
    include: { checklistItems: true },
  });

  return NextResponse.json(job, { status: 201 });
}
