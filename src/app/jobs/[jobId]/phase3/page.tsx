"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with canvas
const SignaturePad = dynamic(() => import("@/components/SignaturePad"), {
  ssr: false,
  loading: () => (
    <div className="h-48 bg-slate-100 rounded-lg animate-pulse" />
  ),
});

interface SignoffData {
  id: string;
  clientConcerns: string;
  signatureData: string | null;
  pmApproval: boolean;
  pmName: string;
}

interface JobData {
  id: string;
  woNumber: string;
  jobName: string;
  phase: number;
  status: string;
  signoff: SignoffData | null;
}

export default function Phase3Page() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [clientConcerns, setClientConcerns] = useState("");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [usePmApproval, setUsePmApproval] = useState(false);
  const [pmName, setPmName] = useState("");

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data: JobData) => {
        setJob(data);
        if (data.signoff) {
          setClientConcerns(data.signoff.clientConcerns);
          setSignatureData(data.signoff.signatureData);
          setUsePmApproval(data.signoff.pmApproval);
          setPmName(data.signoff.pmName);
        }
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!signatureData && !usePmApproval) {
      alert("Please provide a client signature or PM approval.");
      return;
    }

    if (usePmApproval && !pmName.trim()) {
      alert("Please enter the PM name for approval.");
      return;
    }

    setSubmitting(true);

    await fetch(`/api/signoff/${jobId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientConcerns,
        signatureData: usePmApproval ? null : signatureData,
        pmApproval: usePmApproval,
        pmName: usePmApproval ? pmName.trim() : "",
      }),
    });

    router.push(`/jobs/${jobId}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading...
      </div>
    );
  }

  if (!job) return null;

  const isAlreadySigned =
    job.signoff &&
    (job.signoff.signatureData || job.signoff.pmApproval);

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
          Phase 3: Client Sign-off
        </h1>
        <p className="text-sm text-slate-500">
          {job.woNumber} — {job.jobName}
        </p>
      </div>

      {isAlreadySigned ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-green-800 mb-3">
            Sign-off Complete
          </h2>
          {job.signoff?.signatureData && (
            <div className="mb-4">
              <p className="text-sm text-green-700 mb-2">Client Signature:</p>
              <img
                src={job.signoff.signatureData}
                alt="Client signature"
                className="border border-green-200 rounded-lg bg-white p-2 max-w-xs"
              />
            </div>
          )}
          {job.signoff?.pmApproval && (
            <p className="text-sm text-green-700">
              PM Approved by: <strong>{job.signoff.pmName}</strong>
            </p>
          )}
          {job.signoff?.clientConcerns && (
            <div className="mt-4">
              <p className="text-sm text-green-700 font-medium">
                Client Concerns:
              </p>
              <p className="text-sm text-green-600 mt-1">
                {job.signoff.clientConcerns}
              </p>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Concerns */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Client Concerns or Notes
            </label>
            <textarea
              value={clientConcerns}
              onChange={(e) => setClientConcerns(e.target.value)}
              placeholder="Any concerns or notes from the client..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {/* Signature or PM Approval Toggle */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setUsePmApproval(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  !usePmApproval
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                Client Signature
              </button>
              <button
                type="button"
                onClick={() => setUsePmApproval(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  usePmApproval
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                PM Approval
              </button>
            </div>

            {!usePmApproval ? (
              <div>
                <p className="text-sm text-slate-600 mb-3">
                  Client signs below to approve the completed work:
                </p>
                {signatureData ? (
                  <div className="space-y-3">
                    <img
                      src={signatureData}
                      alt="Signature"
                      className="border border-slate-200 rounded-lg bg-white p-2 max-w-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setSignatureData(null)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Clear and re-sign
                    </button>
                  </div>
                ) : (
                  <SignaturePad onSave={setSignatureData} />
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-600 mb-3">
                  PM confirms client has verbally approved the work:
                </p>
                <input
                  type="text"
                  value={pmName}
                  onChange={(e) => setPmName(e.target.value)}
                  placeholder="PM Name"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Sign-off"}
          </button>
        </form>
      )}
    </div>
  );
}
