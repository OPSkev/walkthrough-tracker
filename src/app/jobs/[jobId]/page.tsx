"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PhaseIndicator from "@/components/PhaseIndicator";
import StatusBadge from "@/components/StatusBadge";

interface Job {
  id: string;
  woNumber: string;
  jobName: string;
  phase: number;
  status: string;
  checklistItems: { result: string }[];
  punchListItems: { status: string }[];
  signoff: { signatureData: string | null; pmApproval: boolean } | null;
}

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Job not found.</p>
      </div>
    );
  }

  const checklistTotal = job.checklistItems.length;
  const checklistDone = job.checklistItems.filter(
    (i) => i.result !== "pending"
  ).length;
  const checklistPassed = job.checklistItems.filter(
    (i) => i.result === "pass"
  ).length;
  const checklistFailed = job.checklistItems.filter(
    (i) => i.result === "fail"
  ).length;

  const punchTotal = job.punchListItems.length;
  const punchDone = job.punchListItems.filter(
    (i) => i.status === "complete"
  ).length;

  const hasSignoff = job.signoff
    ? !!(job.signoff.signatureData || job.signoff.pmApproval)
    : false;

  const phase1Complete = checklistDone === checklistTotal;
  const phase2Complete = punchTotal > 0 && punchDone === punchTotal;
  const canAdvanceToPhase2 = phase1Complete && job.phase === 1;
  const canAdvanceToPhase3 = phase2Complete && job.phase === 2;

  async function advancePhase(newPhase: number) {
    await fetch(`/api/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase: newPhase }),
    });
    router.refresh();
    setJob((prev) => (prev ? { ...prev, phase: newPhase } : prev));
  }

  const phases = [
    {
      num: 1,
      title: "Install Checklist",
      description: `${checklistDone}/${checklistTotal} items reviewed`,
      detail: `${checklistPassed} pass, ${checklistFailed} fail`,
      href: `/jobs/${jobId}/phase1`,
      ready: true,
    },
    {
      num: 2,
      title: "Punch List",
      description:
        punchTotal > 0
          ? `${punchDone}/${punchTotal} items resolved`
          : "No items yet",
      detail: null,
      href: `/jobs/${jobId}/phase2`,
      ready: job.phase >= 2,
    },
    {
      num: 3,
      title: "Client Sign-off",
      description: hasSignoff ? "Signed" : "Awaiting signature",
      detail: null,
      href: `/jobs/${jobId}/phase3`,
      ready: job.phase >= 3,
    },
  ];

  return (
    <div>
      <Link
        href="/"
        className="text-sm text-slate-500 hover:text-slate-700 mb-4 inline-block"
      >
        &larr; All Jobs
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-sm text-slate-500">
            {job.woNumber}
          </span>
          <StatusBadge status={job.status} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          {job.jobName}
        </h1>
        <PhaseIndicator currentPhase={job.phase} status={job.status} />
      </div>

      <div className="space-y-3">
        {phases.map((phase) => (
          <div
            key={phase.num}
            className={`bg-white rounded-xl border p-4 ${
              phase.ready
                ? "border-slate-200"
                : "border-slate-100 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      phase.num < job.phase || (phase.num === 3 && hasSignoff)
                        ? "bg-green-500 text-white"
                        : phase.num === job.phase
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {phase.num < job.phase || (phase.num === 3 && hasSignoff)
                      ? "\u2713"
                      : phase.num}
                  </span>
                  <h3 className="font-semibold text-slate-800">
                    {phase.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-500 ml-8">
                  {phase.description}
                </p>
                {phase.detail && (
                  <p className="text-xs text-slate-400 ml-8">{phase.detail}</p>
                )}
              </div>
              {phase.ready && (
                <Link
                  href={phase.href}
                  className="px-4 py-2 text-sm bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  {phase.num === job.phase ? "Continue" : "View"}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {canAdvanceToPhase2 && (
        <button
          onClick={() => advancePhase(2)}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Advance to Phase 2: Punch List
        </button>
      )}

      {canAdvanceToPhase3 && (
        <button
          onClick={() => advancePhase(3)}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Advance to Phase 3: Sign-off
        </button>
      )}

      {job.status === "completed" && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-green-800 font-semibold">Job Complete</p>
          <p className="text-green-600 text-sm">
            All phases finished and signed off.
          </p>
        </div>
      )}
    </div>
  );
}
