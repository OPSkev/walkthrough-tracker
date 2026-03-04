import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/punch-list — add punch list item
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { jobId, description, location, resolutionType } = body;

  if (!jobId || !description) {
    return NextResponse.json(
      { error: "jobId and description are required" },
      { status: 400 }
    );
  }

  const item = await prisma.punchListItem.create({
    data: {
      jobId,
      description,
      location: location || "",
      resolutionType: resolutionType || "",
    },
  });

  return NextResponse.json(item, { status: 201 });
}
