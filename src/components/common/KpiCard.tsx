import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon: LucideIcon;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="surface-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
              up ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive",
            )}
          >
            {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
