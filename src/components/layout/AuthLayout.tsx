import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const highlights = [
  { icon: BarChart3, text: "Live revenue, pipeline and delivery in one workspace" },
  { icon: Zap, text: "Automations that keep clients, projects and tasks in sync" },
  { icon: ShieldCheck, text: "Role-based access built for growing agency teams" },
];

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--sidebar-primary)_0%,transparent_45%)] opacity-30" />
        <Link to="/" className="relative flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <span className="text-sm font-bold tracking-tight">AgencyOS</span>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Run your agency from one operations workspace.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-sidebar-muted">
            Clients, leads, projects, people and finance — connected, so nothing falls through the
            cracks.
          </p>
          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-sidebar-muted">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                  <Icon className="size-3.5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-sidebar-muted">
          &copy; {new Date().getFullYear()} AgencyOS. All rights reserved.
        </p>
      </div>

      <div className="flex flex-col bg-background">
        <div className="flex items-center justify-between p-4 md:p-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            <span className="text-sm font-bold tracking-tight">AgencyOS</span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-10 md:px-8">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
            {footer && (
              <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
