import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, ArrowLeft, Briefcase, DollarSign, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { attendance, leaveRequests, timesheets, documents, performance } from "@/data/agency.ts";
import { employeeGoals } from "@/data/hr.ts";
import { useEmployeesStore } from "@/store/employeesStore";

export const Route = createFileRoute("/employees/$employeeId")({
  head: ({ params }) => ({
    meta: [
      { title: `Employee Profile — AgencyOS` },
      { name: "description", content: `Profile details for employee ${params.employeeId}.` },
      { property: "og:title", content: "Employee Profile — AgencyOS" },
      { property: "og:description", content: "View employee profile details in AgencyOS." },
    ],
  }),
  component: EmployeeProfilePage,
});

function EmployeeProfilePage() {
  const { employeeId } = Route.useParams();
  const employees = useEmployeesStore((s) => s.employees);
  const employee = employees.find((e) => e.id === employeeId);

  if (!employee) {
    return (
      <div className="surface-card flex flex-col items-center gap-3 p-12 text-center">
        <p className="text-lg font-semibold text-foreground">Employee not found</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          We couldn't find an employee with id "{employeeId}". They may have been removed from the
          directory.
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link to="/employees">
            <ArrowLeft className="mr-1.5 size-4" /> Back to directory
          </Link>
        </Button>
      </div>
    );
  }

  const empAttendance = attendance.filter((a) => a.employeeId === employee.id);
  const empLeave = leaveRequests.filter((l) => l.employeeId === employee.id);
  const empTimesheets = timesheets.filter((t) => t.employeeId === employee.id);
  const empDocuments = documents.filter((d) => d.employeeId === employee.id);
  const empReview = performance.find((p) => p.employeeId === employee.id);
  const empGoals = employeeGoals.filter((g) => g.employeeId === employee.id);

  const presentDays = empAttendance.filter(
    (a) => a.status === "present" || a.status === "remote",
  ).length;

  return (
    <div>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 gap-1.5 text-muted-foreground"
      >
        <Link to="/employees">
          <ArrowLeft className="size-4" /> Back to directory
        </Link>
      </Button>

      <div className="surface-card mb-6 flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="bg-primary-soft text-lg font-semibold text-accent-foreground">
              {employee.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-foreground">{employee.name}</h2>
            <p className="text-sm text-muted-foreground">
              {employee.role} · {employee.department}
            </p>
            <div className="mt-1.5">
              <StatusBadge status={employee.status} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href={`mailto:${employee.email}`}>
              <Mail className="size-4" /> Email
            </a>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href={`tel:${employee.phone}`}>
              <Phone className="size-4" /> Call
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Overview</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={Mail} label="Email" value={employee.email} />
            <InfoRow icon={Phone} label="Phone" value={employee.phone} />
            <InfoRow icon={MapPin} label="Location" value={employee.location} />
            <InfoRow icon={Briefcase} label="Manager" value={employee.manager} />
            <InfoRow
              icon={DollarSign}
              label="Salary"
              value={`$${employee.salary.toLocaleString()}/yr`}
            />
            <InfoRow icon={CalendarDays} label="Joined" value={employee.joinedOn} />
          </div>
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {employee.skills.length === 0 && (
                <span className="text-sm text-muted-foreground">No skills on file.</span>
              )}
              {employee.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Utilization</span>
              <span>{employee.utilization}%</span>
            </div>
            <Progress value={employee.utilization} className="h-2" />
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Performance</h3>
          {empReview ? (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-foreground">{empReview.score || "—"}</span>
                <StatusBadge status={empReview.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                Cycle: {empReview.cycle} · Reviewer: {empReview.reviewer}
              </p>
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Goals met</span>
                  <span>
                    {empReview.goalsMet}/{empReview.goalsTotal}
                  </span>
                </div>
                <Progress
                  value={(empReview.goalsMet / (empReview.goalsTotal || 1)) * 100}
                  className="h-1.5"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No performance review on file.</p>
          )}
          <div className="mt-4 space-y-2">
            {empGoals.map((g) => (
              <div key={g.id}>
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span className="truncate pr-2">{g.title}</span>
                  <span>{g.progress}%</span>
                </div>
                <Progress value={g.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Attendance summary</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            {presentDays} present/remote day(s) on record
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>In</TableHead>
                  <TableHead>Out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empAttendance.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.date}</TableCell>
                    <TableCell>{a.clockIn}</TableCell>
                    <TableCell>{a.clockOut}</TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {empAttendance.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      No attendance records.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Leave balance & history</h3>
          <p className="mb-3 text-sm text-foreground">
            {employee.leaveBalance} day(s) remaining this cycle
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empLeave.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.type}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {l.from} → {l.to}
                    </TableCell>
                    <TableCell>{l.days}</TableCell>
                    <TableCell>
                      <StatusBadge status={l.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {empLeave.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      No leave history.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Recent timesheets</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empTimesheets.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell className="text-muted-foreground">{t.project}</TableCell>
                    <TableCell>{t.hours}h</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {empTimesheets.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-6 text-center text-sm text-muted-foreground"
                    >
                      No timesheet entries.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Documents</h3>
          <div className="space-y-2">
            {empDocuments.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.category} · {d.size}
                  </p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
            {empDocuments.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No documents uploaded.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
