"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PhotoUploader from "@/components/PhotoUploader";
import PhotoGallery from "@/components/PhotoGallery";

interface ChecklistItemData {
  id: string;
  category: string;
  item: string;
  result: string;
  notes: string;
  sortOrder: number;
  photos?: { id: string; filename: string }[];
}

interface JobData {
  id: string;
  woNumber: string;
  jobName: string;
  phase: number;
  checklistItems: ChecklistItemData[];
  photos: { id: string; filename: string; checklistItemId: string | null }[];
}

export default function Phase1Page() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobData | null>(null);
  const [items, setItems] = useState<ChecklistItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const pendingUpdates = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data: JobData) => {
        setJob(data);
        // Attach photos to checklist items
        const itemsWithPhotos = data.checklistItems.map((item) => ({
          ...item,
          photos: data.photos.filter((p) => p.checklistItemId === item.id),
        }));
        setItems(itemsWithPhotos);
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  const saveItem = useCallback(
    (itemId: string, result: string, notes?: string) => {
      // Clear previous debounce for this item
      const existing = pendingUpdates.current.get(itemId);
      if (existing) clearTimeout(existing);

      const timeout = setTimeout(() => {
        fetch(`/api/checklist/${jobId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            updates: [{ id: itemId, result, ...(notes !== undefined && { notes }) }],
          }),
        });
        pendingUpdates.current.delete(itemId);
      }, 500);

      pendingUpdates.current.set(itemId, timeout);
    },
    [jobId]
  );

  function handleResultChange(itemId: string, result: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, result } : i))
    );
    saveItem(itemId, result);
  }

  function handleNotesChange(itemId: string, notes: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, notes } : i))
    );
    const item = items.find((i) => i.id === itemId);
    if (item) saveItem(itemId, item.result, notes);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading checklist...
      </div>
    );
  }

  if (!job) return null;

  // Group by category
  const categories = items.reduce<Record<string, ChecklistItemData[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  const totalItems = items.length;
  const completedItems = items.filter((i) => i.result !== "pending").length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div>
      <Link
        href={`/jobs/${jobId}`}
        className="text-sm text-slate-500 hover:text-slate-700 mb-4 inline-block"
      >
        &larr; Back to Job
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Phase 1: Install Checklist
        </h1>
        <p className="text-sm text-slate-500">
          {job.woNumber} — {job.jobName}
        </p>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-slate-600 mb-1">
            <span>
              {completedItems}/{totalItems} items
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(categories).map(([category, categoryItems]) => {
          const catDone = categoryItems.filter(
            (i) => i.result !== "pending"
          ).length;

          return (
            <div key={category} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-700">{category}</h2>
                  <span className="text-xs text-slate-500">
                    {catDone}/{categoryItems.length}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {categoryItems.map((item) => {
                  const isExpanded = expandedItem === item.id;

                  return (
                    <div key={item.id} className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() =>
                              setExpandedItem(isExpanded ? null : item.id)
                            }
                            className="text-sm text-slate-700 text-left w-full"
                          >
                            {item.item}
                          </button>
                        </div>

                        <div className="flex gap-1 shrink-0">
                          {(["pass", "fail", "na"] as const).map((result) => (
                            <button
                              key={result}
                              onClick={() =>
                                handleResultChange(
                                  item.id,
                                  item.result === result ? "pending" : result
                                )
                              }
                              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                                item.result === result
                                  ? result === "pass"
                                    ? "bg-green-500 text-white"
                                    : result === "fail"
                                      ? "bg-red-500 text-white"
                                      : "bg-slate-500 text-white"
                                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              }`}
                            >
                              {result === "na" ? "N/A" : result.charAt(0).toUpperCase() + result.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 ml-0 space-y-3">
                          <textarea
                            value={item.notes}
                            onChange={(e) =>
                              handleNotesChange(item.id, e.target.value)
                            }
                            placeholder="Add notes..."
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                          />
                          <PhotoUploader
                            jobId={jobId}
                            phase={1}
                            checklistItemId={item.id}
                            onUpload={(photo) => {
                              setItems((prev) =>
                                prev.map((i) =>
                                  i.id === item.id
                                    ? {
                                        ...i,
                                        photos: [
                                          ...(i.photos || []),
                                          photo,
                                        ],
                                      }
                                    : i
                                )
                              );
                            }}
                          />
                          <PhotoGallery photos={item.photos || []} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
