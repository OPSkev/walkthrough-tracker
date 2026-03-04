"use client";

import { useState, useRef } from "react";

interface PhotoUploaderProps {
  jobId: string;
  phase: number;
  checklistItemId?: string;
  punchListItemId?: string;
  signoffId?: string;
  onUpload?: (photo: { id: string; filename: string }) => void;
}

function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => resolve(blob!),
        "image/jpeg",
        quality
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function PhotoUploader({
  jobId,
  phase,
  checklistItemId,
  punchListItemId,
  signoffId,
  onUpload,
}: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressed = await compressImage(file);

      const formData = new FormData();
      formData.append("file", compressed, `photo-${Date.now()}.jpg`);
      formData.append("jobId", jobId);
      formData.append("phase", phase.toString());
      if (checklistItemId) formData.append("checklistItemId", checklistItemId);
      if (punchListItemId) formData.append("punchListItemId", punchListItemId);
      if (signoffId) formData.append("signoffId", signoffId);

      const res = await fetch("/api/photos", { method: "POST", body: formData });
      const photo = await res.json();
      onUpload?.(photo);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-sm cursor-pointer hover:bg-slate-200 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {uploading ? "Uploading..." : "Add Photo"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
}
