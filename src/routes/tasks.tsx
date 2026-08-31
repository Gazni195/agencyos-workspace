import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — AgencyOS" },
      { name: "description", content: "Plan, track and complete agency tasks in AgencyOS." },
      { property: "og:title", content: "Tasks — AgencyOS" },
      { property: "og:description", content: "Plan, track and complete agency tasks in AgencyOS." },
    ],
  }),
  component: TasksLayout,
});

const tabs = [
  { label: "Board", to: "/tasks/board" },
  { label: "List", to: "/tasks/list" },
  { label: "Calendar", to: "/tasks/calendar" },
] as const;

function TasksLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader title="Tasks" description="Plan, assign and track work across every project." />
      <nav aria-label="Task views" className="mb-6 flex gap-1 border-b border-border pb-px">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className="shrink-0 rounded-t-lg border-b-2 border-transparent px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{
              className: cn(
                "shrink-0 rounded-t-lg border-b-2 border-primary px-3.5 py-2.5 text-sm font-semibold text-foreground",
              ),
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </section>
  );
}
