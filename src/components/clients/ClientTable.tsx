import { Link } from "@tanstack/react-router";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Client } from "@/data/crm";
import { money } from "@/data/crm";

export function ClientTable({ clients }: { clients: Client[] }) {
  return (
    <div className="surface-card overflow-x-auto p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>MRR</TableHead>
            <TableHead>Health</TableHead>
            <TableHead>Projects</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Link
                  to="/clients/$clientId"
                  params={{ clientId: c.id }}
                  className="flex items-center gap-3 font-medium hover:text-primary"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary-soft text-xs font-semibold text-accent-foreground">
                    {c.logo}
                  </span>
                  {c.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{c.industry}</TableCell>
              <TableCell>{c.owner}</TableCell>
              <TableCell>{money(c.mrr)}</TableCell>
              <TableCell>
                <StatusBadge status={c.health} />
              </TableCell>
              <TableCell>{c.projects}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
