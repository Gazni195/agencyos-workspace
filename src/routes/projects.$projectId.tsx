import { useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  FileText,
  ListChecks,
  Users as UsersIcon,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { BudgetBurnChart } from "@/components/projects/BudgetBurnChart";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectsStore } from "@/store/projectsStore";
import { useTasksStore } from "@/store/tasksStore";
import {
  budgetBurn,
  deliverableStatuses,
  deliverableStatusLabels,
  milestones,
  projectActivity,
  projectAllocations,
  projectFilesByProject,
  taskStatuses,
  type DeliverableStatus,
  type ProjectStatus,
  type TaskStatus,
} from "@/data/delivery";
import { money } from "@/data/agency";
import { taskStatusLabels } from "@/data/delivery";
import { useEmployeesStore } from "@/store/employeesStore";
import { useClientsStore } from "@/store/clientsStore";
import { useDeliverablesStore } from "@/store/deliverablesStore";
import { NewDeliverableDialog } from "@/components/projects/NewDeliverableDialog";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project Details — AgencyOS" },
      {
        name: "description",
        content: "Review project progress, budget, milestones and delivery health.",
      },
      { property: "og:title", content: "Project Details — AgencyOS" },
      {
        property: "og:description",
        content: "Review project progress, budget, milestones and delivery health.",
      },
    ],
  }),
  component: ProjectDetailPage,
});

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "on-track", label: "On track" },
  { value: "at-risk", label: "At risk" },
  { value: "delayed", label: "Delayed" },
  { value: "completed", label: "Completed" },
];
const taskStatusOptions: TaskStatus[] = taskStatuses;

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const project = useProjectsStore((s) => s.projects.find((p) => p.id === projectId));
  const updateProject = useProjectsStore((s) => s.updateProject);
  // Select the raw array (stable reference) and filter in the component body
  // — filtering inside the selector returns a new array every call, which
  // breaks Zustand's snapshot-equality check and causes an infinite loop.
  const allTasks = useTasksStore((s) => s.tasks);
  const tasks = allTasks.filter((t) => t.projectId === projectId);
  const setTaskStatus = useTasksStore((s) => s.setStatus);
  const employees = useEmployeesStore((s) => s.employees);
  const clients = useClientsStore((s) => s.clients);
  const allDeliverables = useDeliverablesStore((s) => s.deliverables);
  const addDeliverable = useDeliverablesStore((s) => s.addDeliverable);
  const setDeliverableStatus = useDeliverablesStore((s) => s.setStatus);
  const deliverables = allDeliverables.filter((d) => d.projectId === projectId);

  const [progressDraft, setProgressDraft] = useState<number | null>(null);

  if (!project) {
    return (
      <section className="mx-auto max-w-7xl">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to projects
        </Link>
        <h1 className="mt-8 text-2xl font-bold">Project not found</h1>
      </section>
    );
  }

  const team = projectAllocations
    .filter((a) => a.projectId === project.id)
    .map((a) => ({ ...a, employee: employees.find((e) => e.id === a.employeeId) }));
  const projectMilestones = [...milestones.filter((m) => m.projectId === project.id)].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  // Ids are assigned in authoring order, most-recent first, within each
  // project's cluster — there's no absolute timestamp to sort by.
  const activity = [...projectActivity.filter((a) => a.projectId === project.id)].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );
  const burn = budgetBurn[project.id] ?? [];
  const files = projectFilesByProject(project.id);
  const remaining = project.budget - project.spend;
  const progress = progressDraft ?? project.progress;
  const clientName = clients.find((c) => c.id === project.clientId)?.name ?? "Unknown client";

  return (
    <section className="mx-auto max-w-7xl">
      <Link
        to="/projects"
        className="mb-5 inline-flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to projects
      </Link>
      <PageHeader
        title={project.name}
        description={`${clientName} · Led by ${project.lead}`}
        actions={
          <Select
            value={project.status}
            onValueChange={(v) =>
              updateProject(project.id, {
                status: v as ProjectStatus,
                health: v === "delayed" ? "red" : v === "at-risk" ? "yellow" : "green",
              })
            }
          >
            <SelectTrigger className="h-9 w-36" aria-label="Change status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team ({team.length})</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables ({deliverables.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline ({projectMilestones.length})</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="files">Files ({files.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="surface-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold">Delivery progress</p>
                <span className="text-sm font-semibold">{progress}%</span>
              </div>
              <Progress value={progress} className="mt-4 h-3" />
              <div className="mt-4">
                <Slider
                  value={[progress]}
                  max={100}
                  step={1}
                  onValueChange={([v]) => setProgressDraft(v ?? progress)}
                  onValueCommit={([v]) => updateProject(project.id, { progress: v ?? progress })}
                  aria-label="Update delivery progress"
                />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <div className="mt-6 border-t border-border pt-4">
                <p className="mb-3 text-sm font-semibold">Recent activity</p>
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity logged yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {activity.slice(0, 4).map((a) => (
                      <li key={a.id} className="text-sm">
                        <span className="font-medium">{a.who}</span>{" "}
                        <span className="text-muted-foreground">{a.what}</span>
                        <span className="ml-1.5 text-xs text-muted-foreground">· {a.when}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="surface-card space-y-5 p-5">
              <Metric
                icon={<DollarSign className="size-4" />}
                label="Budget"
                value={money(project.budget)}
              />
              <Metric
                icon={<DollarSign className="size-4" />}
                label="Spent"
                value={money(project.spend)}
              />
              <Metric icon={<CalendarDays className="size-4" />} label="Due" value={project.due} />
              <Metric
                icon={<Clock className="size-4" />}
                label="Started"
                value={project.startDate}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-5">
          {team.length === 0 ? (
            <div className="surface-card p-6">
              <EmptyState
                icon={UsersIcon}
                title="No team assigned"
                description="Allocate team members to this project to see them here."
              />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {team.map((member) => (
                <div key={member.employeeId} className="surface-card flex items-center gap-3 p-4">
                  <Avatar className="size-10">
                    <AvatarFallback>{member.employee?.initials ?? "?"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{member.employee?.name ?? "Unknown"}</p>
                    <p className="truncate text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="w-20 text-right">
                    <p className="text-sm font-semibold">{member.allocation}%</p>
                    <p className="text-xs text-muted-foreground">allocated</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="mt-5">
          {tasks.length === 0 ? (
            <div className="surface-card p-6">
              <EmptyState
                icon={ListChecks}
                title="No tasks yet"
                description="Tasks assigned to this project will show up here."
              />
            </div>
          ) : (
            <div className="surface-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((t) => {
                    const assignee = employees.find((e) => e.id === t.assigneeId);
                    return (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.title}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {assignee?.name ?? "Unassigned"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={t.priority} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{t.due}</TableCell>
                        <TableCell>
                          <Select
                            value={t.status}
                            onValueChange={(v) => setTaskStatus(t.id, v as TaskStatus)}
                          >
                            <SelectTrigger
                              className="h-8 w-36"
                              aria-label={`Status for ${t.title}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {taskStatusOptions.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {taskStatusLabels[s]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="deliverables" className="mt-5">
          <div className="mb-3 flex justify-end">
            <NewDeliverableDialog projectId={project.id} onCreate={addDeliverable} />
          </div>
          {deliverables.length === 0 ? (
            <div className="surface-card p-6">
              <EmptyState
                icon={FileText}
                title="No deliverables yet"
                description="Client-facing outputs for this project — videos, designs, reports — will show up here."
              />
            </div>
          ) : (
            <div className="surface-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deliverable</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliverables.map((d) => {
                    const assignee = employees.find((e) => e.id === d.assigneeId);
                    return (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.title}</TableCell>
                        <TableCell className="text-muted-foreground">{d.type}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {assignee?.name ?? "Unassigned"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{d.dueDate}</TableCell>
                        <TableCell>
                          <Select
                            value={d.status}
                            onValueChange={(v) =>
                              setDeliverableStatus(d.id, v as DeliverableStatus)
                            }
                          >
                            <SelectTrigger
                              className="h-8 w-44"
                              aria-label={`Status for ${d.title}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {deliverableStatuses.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {deliverableStatusLabels[s]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="mt-5">
          {projectMilestones.length === 0 ? (
            <div className="surface-card p-6">
              <EmptyState
                icon={CalendarClock}
                title="No milestones yet"
                description="Add milestones to track this project's roadmap."
              />
            </div>
          ) : (
            <ol className="surface-card space-y-5 p-5">
              {projectMilestones.map((m, i) => (
                <li key={m.id} className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={
                        "flex size-8 shrink-0 items-center justify-center rounded-full " +
                        (m.status === "done"
                          ? "bg-success/12 text-success"
                          : m.status === "in-progress"
                            ? "bg-primary-soft text-accent-foreground"
                            : "bg-muted text-muted-foreground")
                      }
                    >
                      {m.status === "done" ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                    </span>
                    {i < projectMilestones.length - 1 && (
                      <span className="mt-1 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-1">
                    <p className="text-sm font-medium">{m.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {m.date} ·{" "}
                      {m.status === "done"
                        ? "Done"
                        : m.status === "in-progress"
                          ? "In progress"
                          : "Upcoming"}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </TabsContent>

        <TabsContent value="budget" className="mt-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="surface-card p-5 lg:col-span-2">
              <p className="mb-4 font-semibold">Planned vs. actual burn</p>
              <div className="h-72">
                <BudgetBurnChart data={burn} />
              </div>
            </div>
            <div className="surface-card space-y-5 p-5">
              <Metric
                icon={<DollarSign className="size-4" />}
                label="Total budget"
                value={money(project.budget)}
              />
              <Metric
                icon={<DollarSign className="size-4" />}
                label="Spent to date"
                value={money(project.spend)}
              />
              <Metric
                icon={<DollarSign className="size-4" />}
                label="Remaining"
                value={money(remaining)}
              />
              <div>
                <p className="text-xs text-muted-foreground">Budget used</p>
                <Progress
                  value={Math.min(100, Math.round((project.spend / project.budget) * 100))}
                  className="mt-2 h-2"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="files" className="mt-5">
          {files.length === 0 ? (
            <div className="surface-card p-6">
              <EmptyState
                icon={FileText}
                title="No files yet"
                description="Briefs, designs and deliverables for this project will show up here."
              />
            </div>
          ) : (
            <div className="surface-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded by</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="flex items-center gap-2 font-medium">
                        <FileText className="size-4 text-muted-foreground" /> {f.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{f.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{f.size}</TableCell>
                      <TableCell className="text-muted-foreground">{f.uploadedBy}</TableCell>
                      <TableCell className="text-muted-foreground">{f.uploadedOn}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 font-semibold">{value}</p>
      </div>
    </div>
  );
}
