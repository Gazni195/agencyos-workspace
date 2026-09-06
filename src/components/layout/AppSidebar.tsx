import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Target,
  FolderKanban,
  CheckSquare,
  Activity,
  Users,
  Wallet,
  BarChart3,
  Inbox,
  Package,
  Settings,
  Sparkles,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import type { permissionModules } from "@/data/workspace";

type NavChild = { title: string; url: string };
type NavItem = {
  title: "Dashboard" | (typeof permissionModules)[number];
  url: string;
  icon: typeof LayoutDashboard;
  children?: readonly NavChild[];
};

const items: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Building2 },
  { title: "Leads", url: "/leads", icon: Target },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
    children: [
      { title: "Board", url: "/tasks/board" },
      { title: "List", url: "/tasks/list" },
      { title: "Calendar", url: "/tasks/calendar" },
    ],
  },
  {
    title: "Operations",
    url: "/operations",
    icon: Activity,
    children: [
      { title: "Overview", url: "/operations" },
      { title: "Workload", url: "/operations/workload" },
      { title: "Clients", url: "/operations/clients" },
      { title: "Deliverables", url: "/operations/deliverables" },
    ],
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Users,
    children: [
      { title: "Directory", url: "/employees" },
      { title: "Attendance", url: "/employees/attendance" },
      { title: "Leave Management", url: "/employees/leave" },
      { title: "Payroll", url: "/employees/payroll" },
      { title: "Performance", url: "/employees/performance" },
      { title: "Documents", url: "/employees/documents" },
      { title: "Timesheets", url: "/employees/timesheets" },
      { title: "Employee Settings", url: "/employees/settings" },
    ],
  },
  {
    title: "Finance",
    url: "/finance",
    icon: Wallet,
    children: [
      { title: "Revenue", url: "/finance" },
      { title: "Invoices", url: "/finance/invoices" },
      { title: "Expenses", url: "/finance/expenses" },
      { title: "Payments", url: "/finance/payments" },
    ],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    children: [
      { title: "Revenue", url: "/reports" },
      { title: "Projects", url: "/reports/projects" },
      { title: "Employees", url: "/reports/employees" },
      { title: "Leads", url: "/reports/leads" },
      { title: "Finance", url: "/reports/finance" },
    ],
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
    children: [
      { title: "Messages", url: "/inbox" },
      { title: "Notifications", url: "/inbox/notifications" },
    ],
  },
  { title: "Assets", url: "/assets", icon: Package },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    children: [
      { title: "Organization", url: "/settings" },
      { title: "Roles & Permissions", url: "/settings/roles" },
      { title: "Client Packages", url: "/settings/client-packages" },
      { title: "Integrations", url: "/settings/integrations" },
      { title: "Workflows", url: "/settings/workflows" },
      { title: "Notifications", url: "/settings/notifications" },
    ],
  },
];

const EXPANDED_STORAGE_KEY = "agencyos-sidebar-expanded";

function loadExpanded(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(EXPANDED_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { can } = usePermissions();
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(url + "/");

  useEffect(() => {
    setExpanded(loadExpanded());
    setHydrated(true);
  }, []);

  // Auto-expand whichever module the current route belongs to, and keep it
  // part of the persisted set (matches "remember state on refresh" without
  // a second mechanism) — you can't be looking at a module's subpage while
  // its group renders collapsed.
  useEffect(() => {
    if (!hydrated) return;
    const activeParent = items.find((item) => item.children && isActive(item.url));
    if (!activeParent || expanded.has(activeParent.title)) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      next.add(activeParent.title);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(EXPANDED_STORAGE_KEY, JSON.stringify([...expanded]));
  }, [expanded, hydrated]);

  const toggle = (title: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  // Dashboard has no permission module — it's the shared landing page.
  // Every other item is gated by the active role's view permission for the
  // matching module, so Settings -> Roles & Permissions actually controls
  // what shows up here instead of just being a checkbox that does nothing.
  const visibleItems = items.filter(
    (item) => item.title === "Dashboard" || can(item.title, "view"),
  );

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 px-5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight">AgencyOS</p>
            <p className="text-[11px] text-sidebar-muted">Operations platform</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto rounded-md p-1 text-sidebar-muted hover:bg-sidebar-accent lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
            Workspace
          </p>
          {visibleItems.map((item) => {
            const hasChildren = !!item.children?.length;
            const isOpen = hasChildren && expanded.has(item.title);
            const active = isActive(item.url);

            return (
              <div key={item.url}>
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => toggle(item.title)}
                    aria-expanded={isOpen}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-sidebar-muted transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_6px_18px_-6px_var(--sidebar-primary)]"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span className="flex-1">{item.title}</span>
                    {isOpen ? (
                      <ChevronDown className="size-4 shrink-0" />
                    ) : (
                      <ChevronRight className="size-4 shrink-0" />
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.url}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-sidebar-muted transition-colors",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_6px_18px_-6px_var(--sidebar-primary)]"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.title}
                  </Link>
                )}
                {hasChildren && isOpen && (
                  <div className="my-1 ml-6 space-y-0.5 border-l border-sidebar-border pl-3">
                    {item.children!.map((child) => (
                      <Link
                        key={child.url}
                        to={child.url}
                        onClick={onClose}
                        activeOptions={{ exact: true }}
                        className={cn(
                          "block rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                          pathname === child.url
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-muted hover:text-sidebar-accent-foreground",
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
