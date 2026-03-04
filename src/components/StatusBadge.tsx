interface StatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  open: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  complete: "bg-green-100 text-green-800",
  pending: "bg-slate-100 text-slate-600",
  pass: "bg-green-100 text-green-800",
  fail: "bg-red-100 text-red-800",
  na: "bg-slate-100 text-slate-500",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

const STATUS_LABELS: Record<string, string> = {
  in_progress: "In Progress",
  na: "N/A",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-600";
  const label =
    STATUS_LABELS[status] || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}
