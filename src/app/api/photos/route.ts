import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/photos — upload photo
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const jobId = formData.get("jobId") as string;
  const phase = parseInt(formData.get("phase") as string);
  const checklistItemId = formData.get("checklistItemId") as string | null;
  const punchListItemId = formData.get("punchListItemId") as string | null;
  const signoffId = formData.get("signoffId") as string | null;

  if (!file || !jobId || !phase) {
    return NextResponse.json(
      { error: "file, jobId, and phase are required" },
      { status: 400 }
    );
  }

  // Save file to public/uploads
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filepath = path.join(uploadsDir, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  const photo = await prisma.photo.create({
    data: {
      filename,
      phase,
      jobId,
      checklistItemId: checklistItemId || null,
      punchListItemId: punchListItemId || null,
      signoffId: signoffId || null,
    },
  });

  return NextResponse.json(photo, { status: 201 });
}
