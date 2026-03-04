"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PhaseIndicator from "@/components/PhaseIndicator";
import StatusBadge from "@/components/StatusBadge";

interface JobSummary {
  id: string;
  woNumber: string;
  jobName: string;
  phase: number;
  status: string;
  createdAt: string;
  stats: {
    checklist: { total: number; completed: number };
    punchList: { total: number; completed: number };
    hasSignoff: boolean;
  };
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading jobs...
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          No jobs yet
        </h2>
        <p className="text-slate-500 mb-6">
          Create your first walkthrough job to get started.
        </p>
        <Link
          href="/jobs/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + New Job
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Jobs</h1>
      <div className="space-y-3">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-slate-500">
                    {job.woNumber}
                  </span>
                  <StatusBadge status={job.status} />
                </div>
                <h3 className="font-semibold text-slate-800">{job.jobName}</h3>
              </div>
              <PhaseIndicator currentPhase={job.phase} status={job.status} />
            </div>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>
                Checklist: {job.stats.checklist.completed}/
                {job.stats.checklist.total}
              </span>
              <span>
                Punch: {job.stats.punchList.completed}/
                {job.stats.punchList.total}
              </span>
              {job.stats.hasSignoff && (
                <span className="text-green-600 font-medium">Signed</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
