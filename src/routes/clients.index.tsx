import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterBar, type FilterDef } from "@/components/shared/FilterBar";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientRowActions } from "@/components/clients/ClientRowActions";
import { NewClientDialog } from "@/components/clients/NewClientDialog";
import { Button } from "@/components/ui/button";
import { useClientsStore } from "@/store/clientsStore";
import { useProjectsStore } from "@/store/projectsStore";
import { money, type Client } from "@/data/crm";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clients/")({
  head: () => ({
    meta: [
      { title: "Clients — AgencyOS" },
      { name: "description", content: "Search, filter and manage every AgencyOS client account." },
      { property: "og:title", content: "Clients — AgencyOS" },
      {
        property: "og:description",
        content: "Search, filter and manage every AgencyOS client account.",
      },
    ],
  }),
  component: ClientsIndexPage,
});

function ClientsIndexPage() {
  const navigate = useNavigate();
  const clients = useClientsStore((s) => s.clients);
  const addClient = useClientsStore((s) => s.addClient);
  const projects = useProjectsStore((s) => s.projects);
  const projectCount = (clientId: string) => projects.filter((p) => p.clientId === clientId).length;

  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("all");
  const [health, setHealth] = useState("all");
  const [owner, setOwner] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");

  const industries = useMemo(
    () => Array.from(new Set(clients.map((c) => c.industry))).sort(),
    [clients],
  );
  const owners = useMemo(() => Array.from(new Set(clients.map((c) => c.owner))).sort(), [clients]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (q && !`${c.name} ${c.industry} ${c.owner}`.toLowerCase().includes(q)) return false;
      if (industry !== "all" && c.industry !== industry) return false;
      if (health !== "all" && c.health !== health) return false;
      if (owner !== "all" && c.owner !== owner) return false;
      return true;
    });
  }, [clients, query, industry, health, owner]);

  const filters: FilterDef[] = [
    {
      id: "industry",
      label: "Industry",
      value: industry,
      onChange: setIndustry,
      options: industries.map((i) => ({ label: i, value: i })),
    },
    {
      id: "health",
      label: "Health",
      value: health,
      onChange: setHealth,
      options: [
        { label: "Healthy", value: "healthy" },
        { label: "At risk", value: "at-risk" },
        { label: "Churn risk", value: "churn-risk" },
      ],
    },
    {
      id: "owner",
      label: "Owner",
      value: owner,
      onChange: setOwner,
      options: owners.map((o) => ({ label: o, value: o })),
    },
  ];

  const columns: Column<Client>[] = [
    {
      key: "name",
      header: "Client",
      sortValue: (c) => c.name,
      render: (c) => (
        <div className="flex items-center gap-3 font-medium">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-xs font-semibold text-accent-foreground">
            {c.logo}
          </span>
          {c.name}
        </div>
      ),
    },
    {
      key: "industry",
      header: "Industry",
      sortValue: (c) => c.industry,
      render: (c) => <span className="text-muted-foreground">{c.industry}</span>,
    },
    { key: "owner", header: "Owner", sortValue: (c) => c.owner, render: (c) => c.owner },
    { key: "mrr", header: "MRR", sortValue: (c) => c.mrr, render: (c) => money(c.mrr) },
    {
      key: "health",
      header: "Health",
      sortValue: (c) => c.health,
      render: (c) => <StatusBadge status={c.health} />,
    },
    {
      key: "projects",
      header: "Projects",
      sortValue: (c) => projectCount(c.id),
      render: (c) => projectCount(c.id),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (c) => <ClientRowActions client={c} />,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Clients"
        description={`${clients.length} accounts · ${money(clients.reduce((s, c) => s + c.mrr, 0))} MRR`}
        actions={<NewClientDialog onCreate={addClient} />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search clients, industry or owner…"
          className="max-w-sm"
        />
        <FilterBar
          filters={filters}
          onReset={() => {
            setIndustry("all");
            setHealth("all");
            setOwner("all");
          }}
        />
        <div className="ml-auto flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-8", view === "table" && "bg-muted")}
            aria-label="Table view"
            aria-pressed={view === "table"}
            onClick={() => setView("table")}
          >
            <ListIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-8", view === "grid" && "bg-muted")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="size-4" />
          </Button>
        </div>
      </div>

      {view === "table" ? (
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(c) => c.id}
          onRowClick={(c) => navigate({ to: "/clients/$clientId", params: { clientId: c.id } })}
          emptyTitle="No clients match your filters"
          emptyDescription="Try a different search term or reset your filters."
        />
      ) : filtered.length === 0 ? (
        <div className="surface-card p-10 text-center text-sm text-muted-foreground">
          No clients match your filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <ClientCard key={c.id} client={c} />
          ))}
        </div>
      )}
    </section>
  );
}
