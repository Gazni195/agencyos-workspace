import { createFileRoute } from "@tanstack/react-router";
import { TaskBoardPage } from "@/modules/tasks/frontend/pages/TaskBoardPage";

export const Route = createFileRoute("/tasks/board")({
  head: () => ({
    meta: [
      { title: "Task Board — AgencyOS" },
      { name: "description", content: "Drag tasks across statuses on the AgencyOS task board." },
    ],
  }),
  component: TaskBoardPage,
});
