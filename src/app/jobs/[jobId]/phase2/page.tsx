"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import PhotoUploader from "@/components/PhotoUploader";
import PhotoGallery from "@/components/PhotoGallery";

interface PunchItem {
  id: string;
  description: string;
  location: string;
  resolutionType: string;
  status: string;
  photos?: { id: string; filename: string }[];
}

interface JobData {
  id: string;
  woNumber: string;
  jobName: string;
  phase: number;
  punchListItems: PunchItem[];
  photos: { id: string; filename: string; punchListItemId: string | null }[];
}

export default function Phase2Page() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobData | null>(null);
  const [items, setItems] = useState<PunchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [resolutionType, setResolutionType] = useState("");

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data: JobData) => {
        setJob(data);
        const itemsWithPhotos = data.punchListItems.map((item) => ({
          ...item,
          photos: data.photos.filter((p) => p.punchListItemId === item.id),
        }));
        setItems(itemsWithPhotos);
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  function resetForm() {
    setDescription("");
    setLocation("");
    setResolutionType("");
    setShowForm(false);
    setEditingId(null);
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;

    const res = await fetch("/api/punch-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        description: description.trim(),
        location: location.trim(),
        resolutionType: resolutionType.trim(),
      }),
    });

    const newItem = await res.json();
    setItems((prev) => [{ ...newItem, photos: [] }, ...prev]);
    resetForm();
  }

  async function handleStatusChange(itemId: string, status: string) {
    await fetch(`/api/punch-list/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status } : i))
    );
  }

  async function handleDelete(itemId: string) {
    await fetch(`/api/punch-list/${itemId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading punch list...
      </div>
    );
  }

  if (!job) return null;

  const totalItems = items.length;
  const completedItems = items.filter((i) => i.status === "complete").length;

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
          Phase 2: Punch List
        </h1>
        <p className="text-sm text-slate-500">
          {job.woNumber} — {job.jobName}
        </p>
        {totalItems > 0 && (
          <p className="text-sm text-slate-600 mt-2">
            {completedItems}/{totalItems} items resolved
          </p>
        )}
      </div>

      {/* Add Item Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Issue
        </button>
      )}

      {/* Add Item Form */}
      {showForm && (
        <form
          onSubmit={handleAddItem}
          className="mb-6 bg-white rounded-xl border border-slate-200 p-4 space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kitchen island"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Resolution Type
              </label>
              <select
                value={resolutionType}
                onChange={(e) => setResolutionType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Select...</option>
                <option value="repair">Repair</option>
                <option value="replace">Replace</option>
                <option value="touch-up">Touch-up</option>
                <option value="adjust">Adjust</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Add Issue
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Punch List Items */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>No punch list items yet.</p>
          <p className="text-sm mt-1">Add issues found during the PM walkthrough.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={item.status} />
                    {item.location && (
                      <span className="text-xs text-slate-400">
                        {item.location}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700">{item.description}</p>
                  {item.resolutionType && (
                    <p className="text-xs text-slate-400 mt-1">
                      Resolution: {item.resolutionType}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  {item.status !== "complete" && (
                    <>
                      {item.status === "open" && (
                        <button
                          onClick={() =>
                            handleStatusChange(item.id, "in_progress")
                          }
                          className="px-2.5 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Start
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleStatusChange(item.id, "complete")
                        }
                        className="px-2.5 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        Done
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-2.5 py-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <PhotoUploader
                  jobId={jobId}
                  phase={2}
                  punchListItemId={item.id}
                  onUpload={(photo) => {
                    setItems((prev) =>
                      prev.map((i) =>
                        i.id === item.id
                          ? { ...i, photos: [...(i.photos || []), photo] }
                          : i
                      )
                    );
                  }}
                />
                <PhotoGallery photos={item.photos || []} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
