import { createFileRoute } from "@tanstack/react-router";
import { RequireModuleAccess } from "@/shared/frontend/components/RequireModuleAccess";
import { TasksLayout } from "@/modules/tasks/frontend/pages/TasksLayout";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — AgencyOS" },
      { name: "description", content: "Plan, track and complete agency tasks in AgencyOS." },
      { property: "og:title", content: "Tasks — AgencyOS" },
      { property: "og:description", content: "Plan, track and complete agency tasks in AgencyOS." },
    ],
  }),
  component: () => (
    <RequireModuleAccess module="Tasks">
      <TasksLayout />
    </RequireModuleAccess>
  ),
});
