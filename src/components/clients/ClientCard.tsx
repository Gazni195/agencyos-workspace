import { Link } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Client } from "@/data/crm";
import { money } from "@/data/crm";

export function ClientCard({ client }: { client: Client }) {
  return (
    <Link
      to="/clients/$clientId"
      params={{ clientId: client.id }}
      className="surface-card group flex flex-col gap-4 p-5 transition hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-accent-foreground">
            {client.logo}
          </span>
          <div>
            <p className="font-semibold leading-tight group-hover:text-primary">{client.name}</p>
            <p className="text-xs text-muted-foreground">{client.industry}</p>
          </div>
        </div>
        <StatusBadge status={client.health} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">MRR</p>
          <p className="font-semibold">{money(client.mrr)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Owner</p>
          <p className="font-medium">{client.owner}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
        <Briefcase className="size-3.5" />
        {client.projects} active project{client.projects === 1 ? "" : "s"}
      </div>
    </Link>
  );
}
