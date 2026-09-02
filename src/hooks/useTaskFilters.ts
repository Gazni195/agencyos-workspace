import { useMemo, useState } from "react";
import { taskStatuses, taskStatusLabels, type DeliveryTask } from "@/data/delivery";
import { useEmployeesStore } from "@/store/employeesStore";
import { useProjectsStore } from "@/store/projectsStore";
import type { FilterDef } from "@/components/shared/FilterBar";

// Shared search/filter state for the three Task views (Board, List,
// Calendar) so all three stay consistent without triplicating the logic.
export function useTaskFilters(tasks: DeliveryTask[]) {
  const employees = useEmployeesStore((s) => s.employees);
  const deliveryProjects = useProjectsStore((s) => s.projects);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [project, setProject] = useState("all");
  const [assignee, setAssignee] = useState("all");
  const [priority, setPriority] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (q && !`${t.title} ${t.description}`.toLowerCase().includes(q)) return false;
      if (status !== "all" && t.status !== status) return false;
      if (project !== "all" && t.projectId !== project) return false;
      if (assignee !== "all" && t.assigneeId !== assignee) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      return true;
    });
  }, [tasks, query, status, project, assignee, priority]);

  const filters: FilterDef[] = [
    {
      id: "status",
      label: "Status",
      value: status,
      onChange: setStatus,
      options: taskStatuses.map((s) => ({ label: taskStatusLabels[s], value: s })),
    },
    {
      id: "project",
      label: "Project",
      value: project,
      onChange: setProject,
      options: deliveryProjects.map((p) => ({ label: p.name, value: p.id })),
    },
    {
      id: "assignee",
      label: "Assignee",
      value: assignee,
      onChange: setAssignee,
      options: employees.map((e) => ({ label: e.name, value: e.id })),
    },
    {
      id: "priority",
      label: "Priority",
      value: priority,
      onChange: setPriority,
      options: [
        { label: "Urgent", value: "urgent" },
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" },
      ],
    },
  ];

  const reset = () => {
    setStatus("all");
    setProject("all");
    setAssignee("all");
    setPriority("all");
  };

  return { query, setQuery, filters, filtered, reset };
}
