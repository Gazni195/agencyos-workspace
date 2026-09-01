import { Link, Outlet } from "@tanstack/react-router";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { cn } from "@/shared/frontend/utils/utils";

export const tabs = [
  { label: "Directory", to: "/employees" },
  { label: "Attendance", to: "/employees/attendance" },
  { label: "Leave Management", to: "/employees/leave" },
  { label: "Payroll", to: "/employees/payroll" },
  { label: "Performance", to: "/employees/performance" },
  { label: "Documents", to: "/employees/documents" },
  { label: "Timesheets", to: "/employees/timesheets" },
  { label: "Employee Settings", to: "/employees/settings" },
] as const;

export function EmployeesLayout() {
  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Employees"
        description="Directory, attendance, leave, payroll and performance in one HR workspace."
      />
      <nav
        aria-label="Employees sections"
        className="mb-6 flex gap-1 overflow-x-auto border-b border-border pb-px"
      >
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: tab.to === "/employees" }}
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
