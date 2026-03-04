"use client";

import { useState } from "react";

interface Photo {
  id: string;
  filename: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelectedPhoto(`/uploads/${photo.filename}`)}
            className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 hover:border-blue-400 transition-colors"
          >
            <img
              src={`/uploads/${photo.filename}`}
              alt="Photo"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Photo"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </>
  );
}
