import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

const toneMap: Record<string, Tone> = {
  active: "success",
  present: "success",
  approved: "success",
  paid: "success",
  completed: "success",
  valid: "success",
  healthy: "success",
  "on-track": "success",
  won: "success",
  assigned: "info",
  remote: "info",
  submitted: "info",
  processing: "info",
  "in-review": "info",
  "in-progress": "info",
  review: "info",
  billable: "info",
  late: "warning",
  pending: "warning",
  probation: "warning",
  expiring: "warning",
  "at-risk": "warning",
  "on-hold": "warning",
  returning: "warning",
  scheduled: "warning",
  absent: "danger",
  rejected: "danger",
  expired: "danger",
  offboarding: "danger",
  delayed: "danger",
  "churn-risk": "danger",
  urgent: "danger",
  high: "danger",
  medium: "warning",
  low: "neutral",
  blocked: "danger",
  "on-leave": "primary",
  draft: "neutral",
  todo: "neutral",
  available: "neutral",
};

const toneClass: Record<Tone, string> = {
  success: "bg-success/12 text-success border-success/25",
  warning: "bg-warning/18 text-warning-foreground border-warning/40",
  danger: "bg-destructive/12 text-destructive border-destructive/25",
  info: "bg-info/12 text-info border-info/25",
  primary: "bg-primary/12 text-primary border-primary/25",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = toneMap[status.toLowerCase()] ?? "neutral";
  const label = status
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        toneClass[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
