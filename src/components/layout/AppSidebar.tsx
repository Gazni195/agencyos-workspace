import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Target,
  FolderKanban,
  CheckSquare,
  Users,
  Wallet,
  BarChart3,
  Inbox,
  Package,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const employeeChildren = [
  { title: "Directory", url: "/employees" },
  { title: "Attendance", url: "/employees/attendance" },
  { title: "Leave Management", url: "/employees/leave" },
  { title: "Payroll", url: "/employees/payroll" },
  { title: "Performance", url: "/employees/performance" },
  { title: "Documents", url: "/employees/documents" },
  { title: "Timesheets", url: "/employees/timesheets" },
  { title: "Employee Settings", url: "/employees/settings" },
] as const;

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Building2 },
  { title: "Leads", url: "/leads", icon: Target },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Employees", url: "/employees", icon: Users, children: employeeChildren },
  { title: "Finance", url: "/finance", icon: Wallet },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Inbox", url: "/inbox", icon: Inbox },
  { title: "Assets", url: "/assets", icon: Package },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname === url || pathname.startsWith(url + "/");

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
          {items.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-muted transition-colors",
                isActive(item.url)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_6px_18px_-6px_var(--sidebar-primary)]"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="m-3 rounded-xl bg-sidebar-accent p-4">
          <p className="text-xs font-semibold text-sidebar-accent-foreground">Cloud not connected</p>
          <p className="mt-1 text-[11px] leading-relaxed text-sidebar-muted">
            Sample data is local. Connect a backend to persist records.
          </p>
        </div>
      </aside>
    </>
  );
}
