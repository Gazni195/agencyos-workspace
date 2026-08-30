import type { ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FilterDef = {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

export function FilterBar({
  filters,
  onReset,
  children,
  className,
}: {
  filters: FilterDef[];
  onReset?: () => void;
  children?: ReactNode;
  className?: string;
}) {
  const dirty = filters.some((f) => f.value !== "all");
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
        <SlidersHorizontal className="size-3.5" />
        Filters
      </span>
      {filters.map((filter) => (
        <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
          <SelectTrigger className="h-10 w-auto min-w-36 rounded-xl bg-card" aria-label={filter.label}>
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All {filter.label.toLowerCase()}</SelectItem>
            {filter.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {children}
      {dirty && onReset && (
        <Button variant="ghost" size="sm" className="h-10 gap-1 rounded-xl" onClick={onReset}>
          <X className="size-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
