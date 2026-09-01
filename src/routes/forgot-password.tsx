import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/shared/frontend/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/frontend/components/ui/form";
import { Input } from "@/shared/frontend/components/ui/input";
import { AuthLayout } from "@/modules/auth/frontend/components/AuthLayout";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — AgencyOS" },
      { name: "description", content: "Reset the password for your AgencyOS account." },
    ],
  }),
  component: ForgotPasswordPage,
});

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSentTo(values.email);
  };

  if (sentTo) {
    return (
      <AuthLayout
        title="Check your inbox"
        description="We've sent password reset instructions to your email."
      >
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/40 p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-success/12 text-success">
            <MailCheck className="size-6" />
          </span>
          <div>
            <p className="text-sm font-medium">Reset link sent to</p>
            <p className="text-sm text-muted-foreground">{sentTo}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t get an email? Check your spam folder or try again in a few minutes.
          </p>
          <Button variant="outline" size="sm" onClick={() => setSentTo(null)}>
            Use a different email
          </Button>
        </div>
        <Link
          to="/login"
          className="mt-6 block text-center text-sm font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      description="Enter the email associated with your account and we'll send you a reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@agency.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            Send reset link
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
