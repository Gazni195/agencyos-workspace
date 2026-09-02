import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Users,
  Briefcase,
  ListChecks,
  Target,
  Activity,
  UserSquare2,
  Wallet,
  BarChart3,
  Inbox,
  Package,
  Settings,
} from "lucide-react";

const actions = [
  { label: "Clients", to: "/clients", icon: Users },
  { label: "Projects", to: "/projects", icon: Briefcase },
  { label: "Tasks", to: "/tasks", icon: ListChecks },
  { label: "Operations", to: "/operations", icon: Activity },
  { label: "Leads", to: "/leads", icon: Target },
  { label: "Employees", to: "/employees", icon: UserSquare2 },
  { label: "Finance", to: "/finance", icon: Wallet },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Inbox", to: "/inbox", icon: Inbox },
  { label: "Assets", to: "/assets", icon: Package },
  { label: "Settings", to: "/settings", icon: Settings },
] as const;

export function QuickActions() {
  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump into a module</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 p-4 text-center transition-colors hover:bg-primary-soft hover:text-accent-foreground"
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
