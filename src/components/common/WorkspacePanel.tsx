import type { ReactNode } from "react";

type WorkspacePanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function WorkspacePanel({ eyebrow, title, description, children }: WorkspacePanelProps) {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {children ?? (
        <div className="surface-card flex min-h-48 items-center justify-center p-6 text-center">
          <p className="text-sm text-muted-foreground">No records to display.</p>
        </div>
      )}
    </section>
  );
}