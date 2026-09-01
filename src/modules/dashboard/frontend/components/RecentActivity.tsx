import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/frontend/components/ui/card";
import { activityFeed } from "@/modules/dashboard/types";
import { Activity } from "lucide-react";

export function RecentActivity() {
  return (
    <Card className="surface-card">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>What's happening across the agency</CardDescription>
        </div>
        <Activity className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {activityFeed.map((a, i) => (
            <li key={a.id} className="relative flex gap-3 pl-1">
              <div className="flex flex-col items-center">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                {i < activityFeed.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="pb-1">
                <p className="text-sm">
                  <span className="font-medium">{a.who}</span>{" "}
                  <span className="text-muted-foreground">{a.what}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.when}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
