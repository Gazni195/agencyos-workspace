import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/modules/auth/frontend/pages/ForgotPasswordPage";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — AgencyOS" },
      { name: "description", content: "Reset the password for your AgencyOS account." },
    ],
  }),
  component: ForgotPasswordPage,
});
