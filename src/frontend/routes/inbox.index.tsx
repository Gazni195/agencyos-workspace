import { createFileRoute } from "@tanstack/react-router";
import { MessagesPage } from "@/modules/inbox/frontend/pages/MessagesPage";

export const Route = createFileRoute("/inbox/")({
  component: MessagesPage,
});
