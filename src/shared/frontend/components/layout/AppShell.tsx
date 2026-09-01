import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Search, Settings, ShieldCheck, User } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { GlobalSearch } from "./GlobalSearch";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, AvatarFallback } from "@/shared/frontend/components/ui/avatar";
import { Button } from "@/shared/frontend/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shared/frontend/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/frontend/components/ui/popover";
import { usePermissions } from "@/shared/frontend/hooks/usePermissions";
import { useCurrentUser } from "@/shared/frontend/hooks/useCurrentUser";
import { useAuthStore } from "@/modules/auth/frontend/store/authStore";
import { useInboxStore } from "@/modules/inbox/frontend/store/inboxStore";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const notes = useInboxStore((s) => s.notifications);
  const markAllNotificationsRead = useInboxStore((s) => s.markAllNotificationsRead);
  const unread = notes.filter((n) => !n.read).length;
  const { role, roles, roleId, setRole } = usePermissions();
  const currentUser = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="hidden max-w-md flex-1 sm:block">
            <GlobalSearch />
          </div>
          <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Search">
            <Search className="size-5" />
          </Button>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
                  <Bell className="size-5" />
                  {unread > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {unread}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold">Notifications</p>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {notes.length === 0 && (
                    <li className="px-4 py-6 text-center text-xs text-muted-foreground">
                      Nothing yet — activity across the workspace shows up here.
                    </li>
                  )}
                  {notes.map((n) => (
                    <li
                      key={n.id}
                      className="flex gap-3 border-b border-border/60 px-4 py-3 last:border-0"
                    >
                      <span
                        className={`mt-1.5 size-2 shrink-0 rounded-full ${!n.read ? "bg-primary" : "bg-muted-foreground/30"}`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.detail}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border px-4 py-2.5">
                  <Link to="/inbox" className="text-xs font-medium text-primary hover:underline">
                    Open inbox
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl px-1 py-1 transition-colors hover:bg-muted">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary-soft text-accent-foreground">
                      {currentUser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden leading-tight md:block">
                    <p className="text-sm font-semibold">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{role?.name ?? "No role"}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-semibold">{currentUser.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">{currentUser.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/employees">
                    <User className="mr-2 size-4" /> My profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 size-4" /> Workspace settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ShieldCheck className="mr-2 size-4" /> Preview role
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={roleId} onValueChange={setRole}>
                        {roles.map((r) => (
                          <DropdownMenuRadioItem key={r.id} value={r.id}>
                            {r.name}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    logout();
                    navigate({ to: "/login" });
                  }}
                >
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
