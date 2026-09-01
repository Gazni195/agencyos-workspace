import { createFileRoute } from "@tanstack/react-router";
import { TaskCalendarPage } from "@/modules/tasks/frontend/pages/TaskCalendarPage";

export const Route = createFileRoute("/tasks/calendar")({
  head: () => ({
    meta: [
      { title: "Task Calendar — AgencyOS" },
      { name: "description", content: "See every AgencyOS task laid out by due date." },
    ],
  }),
  component: TaskCalendarPage,
});
