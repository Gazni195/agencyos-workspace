import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/frontend/components/ui/card";
import { Button } from "@/shared/frontend/components/ui/button";
import { EmptyState } from "@/shared/frontend/components/EmptyState";
import { CalendarClock, Check, ReceiptText, X } from "lucide-react";
import { toast } from "sonner";
import { getPendingApprovals } from "@/modules/dashboard/frontend/services/dashboardService";

export function PendingApprovals() {
  const [approvals, setApprovals] = useState(getPendingApprovals);

  const resolve = (id: string, title: string, action: "approved" | "declined") => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    toast[action === "approved" ? "success" : "error"](
      action === "approved" ? "Approved" : "Declined",
      { description: title },
    );
  };

  return (
    <Card className="surface-card">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Pending approvals</CardTitle>
          <CardDescription>Leave and expenses waiting on sign-off</CardDescription>
        </div>
        <CalendarClock className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {approvals.length === 0 ? (
          <EmptyState
            title="All caught up"
            description="No approvals need your attention right now."
          />
        ) : (
          <ul className="space-y-1">
            {approvals.map((approval) => (
              <li
                key={approval.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted/50"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-accent-foreground">
                  <ReceiptText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{approval.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {approval.meta}
                    {approval.amount ? ` · ${approval.amount}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7 text-success hover:bg-success/12 hover:text-success"
                    aria-label={`Approve ${approval.title}`}
                    onClick={() => resolve(approval.id, approval.title, "approved")}
                  >
                    <Check className="size-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7 text-destructive hover:bg-destructive/12 hover:text-destructive"
                    aria-label={`Decline ${approval.title}`}
                    onClick={() => resolve(approval.id, approval.title, "declined")}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
