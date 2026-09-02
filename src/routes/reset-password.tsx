import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/modules/auth/frontend/pages/ResetPasswordPage";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — AgencyOS" },
      { name: "description", content: "Choose a new password for your AgencyOS account." },
    ],
  }),
  component: ResetPasswordPage,
});
