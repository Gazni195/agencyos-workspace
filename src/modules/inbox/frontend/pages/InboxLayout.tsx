import { Link, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { cn } from "@/shared/frontend/utils/utils";

export const tabs = [
  { label: "Messages", to: "/inbox" },
  { label: "Notifications", to: "/inbox/notifications" },
] as const;

export function InboxLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader title="Inbox" description="Your communications workspace." />
      <nav
        aria-label="Inbox sections"
        className="mb-6 flex gap-1 overflow-x-auto border-b border-border pb-px"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: true }}
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
