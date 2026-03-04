"use client";

import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
}

export default function SignaturePad({ onSave }: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas>(null);

  function handleClear() {
    sigRef.current?.clear();
  }

  function handleSave() {
    if (sigRef.current?.isEmpty()) return;
    const trimmed = sigRef.current?.getTrimmedCanvas();
    const dataUrl = trimmed?.toDataURL("image/png") || "";
    onSave(dataUrl);
  }

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-slate-300 rounded-lg bg-white">
        <SignatureCanvas
          ref={sigRef}
          canvasProps={{
            className: "w-full h-48 touch-none",
          }}
          penColor="#1e293b"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Accept Signature
        </button>
      </div>
    </div>
  );
}
