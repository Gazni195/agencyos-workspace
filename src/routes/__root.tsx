import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useNavigate,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "@/shared/frontend/utils/lovable-error-reporting";
import { AppShell } from "@/shared/frontend/components/layout/AppShell";
import { Toaster } from "@/shared/frontend/components/ui/sonner";
import { useAuthStore } from "@/modules/auth/frontend/store/authStore";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AgencyOS — Marketing Agency Operations" },
      {
        name: "description",
        content:
          "AgencyOS is the operations platform for marketing agencies: clients, projects, people and finance in one workspace.",
      },
      { property: "og:title", content: "AgencyOS — Marketing Agency Operations" },
      {
        property: "og:description",
        content: "Run clients, projects, employees and finance from a single agency workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const AUTH_ROUTES = ["/login", "/forgot-password", "/reset-password", "/verify-email"];

// Neutral placeholder shown instead of the real app while we don't yet
// know if the visitor is signed in — during SSR (no localStorage/
// sessionStorage on the server, so auth state is unknowable there) and
// for the brief moment on the client before the redirect effect below
// runs. Deliberately renders no nav, no data, nothing module-specific:
// there's no server session to gate on (frontend-only app, see
// authStore), so the one thing we can guarantee without one is that an
// unauthenticated visitor is never shown a frame of real app content.
function AuthCheckingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const navigate = useNavigate();
  const email = useAuthStore((s) => s.email);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthRoute && !email) {
      navigate({ to: "/login", replace: true });
    } else if (pathname === "/login" && email) {
      navigate({ to: "/", replace: true });
    }
  }, [mounted, isAuthRoute, pathname, email, navigate]);

  const showApp = isAuthRoute || (mounted && !!email);

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthRoute ? (
        // Auth pages render standalone, without the app sidebar/header chrome.
        <Outlet />
      ) : showApp ? (
        <AppShell>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </AppShell>
      ) : (
        <AuthCheckingScreen />
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
