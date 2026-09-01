import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/modules/auth/frontend/pages/LoginPage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AgencyOS" },
      { name: "description", content: "Sign in to your AgencyOS agency workspace." },
    ],
  }),
  component: LoginPage,
});
