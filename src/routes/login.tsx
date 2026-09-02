import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuthStore } from "@/store/authStore";
import { useSessionStore } from "@/store/sessionStore";
import { useEmployeesStore } from "@/store/employeesStore";
import { resolveIdentityByEmail } from "@/lib/identity";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AgencyOS" },
      { name: "description", content: "Sign in to your AgencyOS agency workspace." },
    ],
  }),
  component: LoginPage,
});

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);
  const setRole = useSessionStore((s) => s.setRole);
  const employees = useEmployeesStore((s) => s.employees);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (values: LoginValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // There's no backend here to verify a password against, so this can
    // only check that the email belongs to a known identity — the demo
    // owner account or a real employee added in Employees → Add employee.
    // Any non-empty password is accepted for a recognized email; that's an
    // honest limitation of not having auth infrastructure yet, not a
    // pretend security check.
    const identity = resolveIdentityByEmail(values.email, employees);
    if (!identity) {
      form.setError("email", {
        message:
          "No account found for that email. Try daniel@agencyos.co, or add an employee first.",
      });
      return;
    }
    login(identity.email, values.remember);
    setRole(identity.roleId);
    toast.success("Welcome back", { description: `Signed in as ${identity.name}` });
    navigate({ to: "/" });
  };

  return (
    <AuthLayout
      title="Sign in to AgencyOS"
      description="Enter your credentials to access your agency workspace."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <a href="mailto:sales@agencyos.co" className="font-medium text-primary hover:underline">
            Contact sales
          </a>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} id="remember" />
                </FormControl>
                <FormLabel htmlFor="remember" className="cursor-pointer text-sm font-normal">
                  Keep me signed in for 30 days
                </FormLabel>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </Form>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        New team member?{" "}
        <Link to="/verify-email" className="font-medium text-primary hover:underline">
          Verify your email
        </Link>{" "}
        to finish setup.
      </p>
      <p className="mt-3 rounded-lg bg-muted/50 p-3 text-center text-xs text-muted-foreground">
        Demo workspace: sign in as <span className="font-medium">daniel@agencyos.co</span> (any
        password), or add an employee first in Employees → Add employee and sign in with their
        email.
      </p>
    </AuthLayout>
  );
}
