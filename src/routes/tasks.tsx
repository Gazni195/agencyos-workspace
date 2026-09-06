import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { RequireModuleAccess } from "@/components/common/RequireModuleAccess";

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

function TasksLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader title="Tasks" description="Plan, assign and track work across every project." />
      <Outlet />
    </section>
  );
}
