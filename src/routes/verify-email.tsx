import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CheckCircle2, Loader2, MailQuestion, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { currentUser } from "@/mock";

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

const RESEND_COOLDOWN = 30;

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setVerifying(false);
    setVerified(true);
  };

  const handleResend = () => {
    setCooldown(RESEND_COOLDOWN);
    toast.success("Verification email sent", { description: currentUser.email });
  };

  if (verified) {
    return (
      <AuthLayout
        title="Email verified"
        description="Your account is fully set up and ready to go."
      >
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/40 p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-success/12 text-success">
            <CheckCircle2 className="size-6" />
          </span>
          <p className="text-sm text-muted-foreground">{currentUser.email} has been confirmed.</p>
        </div>
        <Button className="mt-6 w-full" onClick={() => navigate({ to: "/" })}>
          Go to dashboard
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      description="We sent a confirmation link to your inbox. Click it, or confirm below to continue."
    >
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/40 p-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-accent-foreground">
          <MailQuestion className="size-6" />
        </span>
        <div>
          <p className="text-sm font-medium">Verification email sent to</p>
          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
        </div>
        <Button className="w-full" onClick={handleVerify} disabled={verifying}>
          {verifying && <Loader2 className="size-4 animate-spin" />}
          I've confirmed my email
        </Button>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
        >
          <RotateCw className="size-3.5" />
          {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend verification email"}
        </button>
      </div>
    </AuthLayout>
  );
}
