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

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AgencyOS" },
      { name: "description", content: "Sign in to your AgencyOS agency workspace." },
    ],
  }),
  component: LoginPage,
});

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});

const signUpSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean(),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const login = useAuthStore((s) => s.login);
  const signUp = useAuthStore((s) => s.signUp);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: true },
  });
  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "", remember: true },
  });

  const onSignIn = async (values: SignInValues) => {
    const { error } = await login(values.email, values.password);
    if (error) {
      signInForm.setError("password", { message: error });
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/" });
  };

  const onSignUp = async (values: SignUpValues) => {
    const { error, needsEmailConfirmation } = await signUp(
      values.email,
      values.password,
      values.fullName,
    );
    if (error) {
      signUpForm.setError("email", { message: error });
      return;
    }
    if (needsEmailConfirmation) {
      toast.success("Check your email", {
        description: "Click the confirmation link, then sign in below.",
      });
      setMode("signin");
      signInForm.setValue("email", values.email);
      return;
    }
    toast.success("Account created", { description: "Welcome to AgencyOS." });
    navigate({ to: "/" });
  };

  return (
    <AuthLayout
      title={mode === "signin" ? "Sign in to AgencyOS" : "Create your AgencyOS account"}
      description={
        mode === "signin"
          ? "Enter your credentials to access your agency workspace."
          : "Set up your account to get started."
      }
      footer={
        mode === "signin" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-medium text-primary hover:underline"
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </button>
          </>
        )
      }
    >
      {mode === "signin" ? (
        <Form {...signInForm}>
          <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4" noValidate>
            <FormField
              control={signInForm.control}
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
              control={signInForm.control}
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
              control={signInForm.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="remember"
                    />
                  </FormControl>
                  <FormLabel htmlFor="remember" className="cursor-pointer text-sm font-normal">
                    Keep me signed in
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={signInForm.formState.isSubmitting}>
              {signInForm.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Sign in
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...signUpForm}>
          <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4" noValidate>
            <FormField
              control={signUpForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jordan Rivera" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
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
              control={signUpForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
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
            <Button type="submit" className="w-full" disabled={signUpForm.formState.isSubmitting}>
              {signUpForm.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Create account
            </Button>
          </form>
        </Form>
      )}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        New accounts start with standard Employee access — an admin can promote you from Settings →
        Roles & Permissions afterward.
      </p>
    </AuthLayout>
  );
}
