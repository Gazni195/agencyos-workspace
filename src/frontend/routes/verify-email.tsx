import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "@/modules/auth/frontend/pages/VerifyEmailPage";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email — AgencyOS" },
      {
        name: "description",
        content: "Confirm your email address to activate your AgencyOS account.",
      },
    ],
  }),
  component: VerifyEmailPage,
});
