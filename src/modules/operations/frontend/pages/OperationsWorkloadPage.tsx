import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Avatar, AvatarFallback } from "@/shared/frontend/components/ui/avatar";
import { DataTable, type Column } from "@/shared/frontend/components/DataTable";
import { useTasksStore } from "@/modules/tasks/frontend/store/tasksStore";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";
import type { Employee } from "@/modules/employees/types";

export const isOverdue = (due: string) => new Date(due) < new Date(new Date().toDateString());

export type WorkloadRow = {
  employee: Employee;
  active: number;
  review: number;
  overdue: number;
  completed: number;
};

export function OperationsWorkloadPage() {
  const tasks = useTasksStore((s) => s.tasks);
  const employees = useEmployeesStore((s) => s.employees);

  const rows = useMemo<WorkloadRow[]>(
    () =>
      employees
        .map((employee) => {
          const own = tasks.filter((t) => t.assigneeId === employee.id);
          return {
            employee,
            active: own.filter((t) => t.status === "todo" || t.status === "in-progress").length,
            review: own.filter((t) => t.status === "review").length,
            overdue: own.filter((t) => t.status !== "done" && isOverdue(t.due)).length,
            completed: own.filter((t) => t.status === "done").length,
          };
        })
        .sort((a, b) => b.active - a.active),
    [tasks, employees],
  );

  const chartData = rows
    .filter((r) => r.active > 0)
    .slice(0, 8)
    .map((r) => ({ name: r.employee.name.split(" ")[0], active: r.active }));

  const columns: Column<WorkloadRow>[] = [
    {
      key: "employee",
      header: "Employee",
      sortValue: (r) => r.employee.name,
      render: (r) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarFallback className="text-xs">{r.employee.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{r.employee.name}</p>
            <p className="text-xs text-muted-foreground">{r.employee.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      sortValue: (r) => r.employee.department,
      render: (r) => <span className="text-muted-foreground">{r.employee.department}</span>,
    },
    {
      key: "active",
      header: "Active",
      align: "right",
      sortValue: (r) => r.active,
      render: (r) => <span className="font-semibold">{r.active}</span>,
    },
    {
      key: "review",
      header: "In review",
      align: "right",
      sortValue: (r) => r.review,
      render: (r) => r.review,
    },
    {
      key: "overdue",
      header: "Overdue",
      align: "right",
      sortValue: (r) => r.overdue,
      render: (r) =>
        r.overdue > 0 ? (
          <span className="font-semibold text-destructive">{r.overdue}</span>
        ) : (
          <span className="text-muted-foreground">0</span>
        ),
    },
    {
      key: "completed",
      header: "Completed",
      align: "right",
      sortValue: (r) => r.completed,
      render: (r) => <span className="text-muted-foreground">{r.completed}</span>,
    },
  ];

  return (
    <div>
      <div className="surface-card p-5">
        <p className="mb-4 font-semibold">Active tasks by employee</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 8, right: 16, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="active"
                name="Active tasks"
                fill="var(--color-chart-1)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.employee.id}
          pageSize={10}
          emptyTitle="No employees yet"
          emptyDescription="Add employees in the Employees module to see workload here."
        />
      </div>
    </div>
  );
}
