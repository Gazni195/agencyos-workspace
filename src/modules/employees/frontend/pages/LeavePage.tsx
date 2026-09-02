import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarDays, CheckCircle2, Clock3, X } from "lucide-react";
import { KpiCard } from "@/shared/frontend/components/KpiCard";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { StatusBadge } from "@/shared/frontend/components/StatusBadge";
import { FilterBar, type FilterDef } from "@/shared/frontend/components/FilterBar";
import { Button } from "@/shared/frontend/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/frontend/components/ui/table";
import { useHrStore } from "@/modules/employees/frontend/store/hrStore";
import { useEmployeesStore } from "@/modules/employees/frontend/store/employeesStore";
import { useSettingsStore } from "@/modules/settings/frontend/store/settingsStore";

export const today = new Date().toISOString().slice(0, 10);

export function LeavePage() {
  const leaveRequests = useHrStore((s) => s.leaveRequests);
  const setLeaveStatus = useHrStore((s) => s.setLeaveStatus);
  const employees = useEmployeesStore((s) => s.employees);
  const employeeById = (id: string) => employees.find((e) => e.id === id);
  const leaveTypes = useSettingsStore((s) => s.leaveTypes);
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const pending = leaveRequests.filter((r) => r.status === "pending").length;
  const approved = leaveRequests.filter((r) => r.status === "approved").length;
  const upcoming = leaveRequests.filter((r) => r.status === "approved" && r.from > today).length;

  const filtered = useMemo(
    () =>
      leaveRequests.filter((r) => {
        if (type !== "all" && r.type !== type) return false;
        if (status !== "all" && r.status !== status) return false;
        return true;
      }),
    [leaveRequests, type, status],
  );

  const filters: FilterDef[] = [
    {
      id: "type",
      label: "Type",
      value: type,
      onChange: setType,
      options: leaveTypes.map((t) => ({ label: t.name, value: t.name })),
    },
    {
      id: "status",
      label: "Status",
      value: status,
      onChange: setStatus,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
    },
  ];

  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Leave management"
        description="Review requests, balances and upcoming time off."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Pending requests" value={String(pending)} icon={Clock3} />
        <KpiCard label="Approved this month" value={String(approved)} icon={CheckCircle2} />
        <KpiCard label="Upcoming leave" value={String(upcoming)} icon={CalendarDays} />
      </div>

      <div className="mt-5 mb-4">
        <FilterBar
          filters={filters}
          onReset={() => {
            setType("all");
            setStatus("all");
          }}
        />
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const emp = employeeById(r.employeeId);
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{emp?.name ?? "Unknown"}</TableCell>
                    <TableCell className="text-muted-foreground">{r.type}</TableCell>
                    <TableCell className="text-muted-foreground">{r.from}</TableCell>
                    <TableCell className="text-muted-foreground">{r.to}</TableCell>
                    <TableCell className="text-muted-foreground">{r.days}</TableCell>
                    <TableCell className="max-w-48 truncate text-muted-foreground">
                      {r.reason}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                    <TableCell>
                      {r.status === "pending" && (
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7 text-success hover:bg-success/12 hover:text-success"
                            aria-label={`Approve ${emp?.name ?? "request"}`}
                            onClick={() => {
                              setLeaveStatus(r.id, "approved");
                              toast.success(`Approved ${emp?.name ?? "request"}'s leave`);
                            }}
                          >
                            <CheckCircle2 className="size-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7 text-destructive hover:bg-destructive/12 hover:text-destructive"
                            aria-label={`Reject ${emp?.name ?? "request"}`}
                            onClick={() => {
                              setLeaveStatus(r.id, "rejected");
                              toast.error(`Rejected ${emp?.name ?? "request"}'s leave`);
                            }}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
