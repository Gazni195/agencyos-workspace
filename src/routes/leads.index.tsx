import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KanbanSquare, List as ListIcon } from "lucide-react";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { SearchBar } from "@/shared/frontend/components/SearchBar";
import { FilterBar, type FilterDef } from "@/shared/frontend/components/FilterBar";
import { DataTable, type Column } from "@/shared/frontend/components/DataTable";
import { Button } from "@/shared/frontend/components/ui/button";
import { Badge } from "@/shared/frontend/components/ui/badge";
import { PipelineBoard } from "@/modules/leads/frontend/components/PipelineBoard";
import { LeadFormDialog } from "@/modules/leads/frontend/components/LeadFormDialog";
import { ConvertLeadDialog } from "@/modules/leads/frontend/components/ConvertLeadDialog";
import { leadStageColor, leadStages } from "@/modules/leads/types";
import { money } from "@/shared/frontend/utils/money";
import { useLeadsStore, type StoreLead } from "@/modules/leads/frontend/store/leadsStore";
import { cn } from "@/shared/frontend/utils/utils";

export const Route = createFileRoute("/leads/")({
  head: () => ({
    meta: [
      { title: "Leads — AgencyOS" },
      { name: "description", content: "Track and manage the agency's lead pipeline in AgencyOS." },
      { property: "og:title", content: "Leads — AgencyOS" },
      {
        property: "og:description",
        content: "Track and manage the agency's lead pipeline in AgencyOS.",
      },
    ],
  }),
  component: LeadsIndexPage,
});

function LeadsIndexPage() {
  const navigate = useNavigate();
  const leads = useLeadsStore((s) => s.leads);
  const addLead = useLeadsStore((s) => s.addLead);

  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [owner, setOwner] = useState("all");
  const [source, setSource] = useState("all");
  const [view, setView] = useState<"pipeline" | "list">("pipeline");
  const [convertingLead, setConvertingLead] = useState<StoreLead | null>(null);

  const owners = useMemo(() => Array.from(new Set(leads.map((l) => l.owner))).sort(), [leads]);
  const sources = useMemo(() => Array.from(new Set(leads.map((l) => l.source))).sort(), [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (q && !`${l.company} ${l.contact} ${l.email}`.toLowerCase().includes(q)) return false;
      if (stage !== "all" && l.stage !== stage) return false;
      if (owner !== "all" && l.owner !== owner) return false;
      if (source !== "all" && l.source !== source) return false;
      return true;
    });
  }, [leads, query, stage, owner, source]);

  const filters: FilterDef[] = [
    {
      id: "stage",
      label: "Stage",
      value: stage,
      onChange: setStage,
      options: leadStages.map((s) => ({ label: s, value: s })),
    },
    {
      id: "owner",
      label: "Owner",
      value: owner,
      onChange: setOwner,
      options: owners.map((o) => ({ label: o, value: o })),
    },
    {
      id: "source",
      label: "Source",
      value: source,
      onChange: setSource,
      options: sources.map((s) => ({ label: s, value: s })),
    },
  ];

  const columns: Column<StoreLead>[] = [
    {
      key: "company",
      header: "Company",
      sortValue: (l) => l.company,
      render: (l) => <span className="font-medium">{l.company}</span>,
    },
    {
      key: "contact",
      header: "Contact",
      sortValue: (l) => l.contact,
      render: (l) => <span className="text-muted-foreground">{l.contact}</span>,
    },
    {
      key: "stage",
      header: "Stage",
      sortValue: (l) => l.stage,
      render: (l) => (
        <Badge className={cn("border-transparent font-medium", leadStageColor[l.stage])}>
          {l.stage}
        </Badge>
      ),
    },
    { key: "value", header: "Value", sortValue: (l) => l.value, render: (l) => money(l.value) },
    { key: "owner", header: "Owner", sortValue: (l) => l.owner, render: (l) => l.owner },
    { key: "source", header: "Source", sortValue: (l) => l.source, render: (l) => l.source },
    {
      key: "nextAction",
      header: "Next action",
      sortValue: (l) => l.nextAction,
      render: (l) => <span className="text-muted-foreground">{l.nextAction}</span>,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Leads"
        description={`${leads.length} opportunities · ${money(leads.reduce((s, l) => s + l.value, 0))} in pipeline`}
        actions={<LeadFormDialog onCreate={addLead} />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search company, contact or email…"
          className="max-w-sm"
        />
        <FilterBar
          filters={filters}
          onReset={() => {
            setStage("all");
            setOwner("all");
            setSource("all");
          }}
        />
        <div className="ml-auto flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-8", view === "pipeline" && "bg-muted")}
            aria-label="Pipeline view"
            aria-pressed={view === "pipeline"}
            onClick={() => setView("pipeline")}
          >
            <KanbanSquare className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-8", view === "list" && "bg-muted")}
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <ListIcon className="size-4" />
          </Button>
        </div>
      </div>

      {view === "pipeline" ? (
        <PipelineBoard leads={filtered} onConvert={setConvertingLead} />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(l) => l.id}
          onRowClick={(l) => navigate({ to: "/leads/$leadId", params: { leadId: l.id } })}
          emptyTitle="No leads match your filters"
          emptyDescription="Try a different search term or reset your filters."
        />
      )}

      <ConvertLeadDialog
        lead={convertingLead}
        open={!!convertingLead}
        onOpenChange={(open) => !open && setConvertingLead(null)}
      />
    </section>
  );
}
