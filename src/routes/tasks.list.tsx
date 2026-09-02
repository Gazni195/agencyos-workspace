import { createFileRoute } from "@tanstack/react-router";
import { TaskListPage } from "@/modules/tasks/frontend/pages/TaskListPage";

export const Route = createFileRoute("/tasks/list")({
  head: () => ({
    meta: [
      { title: "Task List — AgencyOS" },
      { name: "description", content: "Browse and filter every AgencyOS task in a sortable list." },
    ],
  }),
  component: TaskListPage,
});
