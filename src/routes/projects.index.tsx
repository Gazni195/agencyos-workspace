import { useCallback, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterBar, type FilterDef } from "@/components/shared/FilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { NewProjectDialog } from "@/components/projects/NewProjectDialog";
import { Button } from "@/components/ui/button";
import { useProjectsStore } from "@/store/projectsStore";
import { useClientsStore } from "@/store/clientsStore";
import { money } from "@/data/agency";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — AgencyOS" },
      { name: "description", content: "Plan and track every AgencyOS project in one workspace." },
      { property: "og:title", content: "Projects — AgencyOS" },
      {
        property: "og:description",
        content: "Plan and track every AgencyOS project in one workspace.",
      },
    ],
  }),
  component: ProjectsIndexPage,
});

function ProjectsIndexPage() {
  const projects = useProjectsStore((s) => s.projects);
  const addProject = useProjectsStore((s) => s.addProject);
  const clients = useClientsStore((s) => s.clients);
  const clientName = useCallback(
    (clientId: string) => clients.find((c) => c.id === clientId)?.name ?? "Unknown client",
    [clients],
  );

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [client, setClient] = useState("all");
  const [lead, setLead] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const clientsList = useMemo(
    () => Array.from(new Set(projects.map((p) => p.clientId))).sort(),
    [projects],
  );
  const leadsList = useMemo(
    () => Array.from(new Set(projects.map((p) => p.lead))).sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (q && !`${p.name} ${clientName(p.clientId)} ${p.lead}`.toLowerCase().includes(q))
        return false;
      if (status !== "all" && p.status !== status) return false;
      if (client !== "all" && p.clientId !== client) return false;
      if (lead !== "all" && p.lead !== lead) return false;
      return true;
    });
  }, [projects, clientName, query, status, client, lead]);

  const filters: FilterDef[] = [
    {
      id: "status",
      label: "Status",
      value: status,
      onChange: setStatus,
      options: [
        { label: "On track", value: "on-track" },
        { label: "At risk", value: "at-risk" },
        { label: "Delayed", value: "delayed" },
        { label: "Completed", value: "completed" },
      ],
    },
    {
      id: "client",
      label: "Client",
      value: client,
      onChange: setClient,
      options: clientsList.map((c) => ({ label: clientName(c), value: c })),
    },
    {
      id: "lead",
      label: "Lead",
      value: lead,
      onChange: setLead,
      options: leadsList.map((l) => ({ label: l, value: l })),
    },
  ];

  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Projects"
        description={`${projects.length} projects · ${money(projects.reduce((s, p) => s + p.budget, 0))} total budget`}
        actions={<NewProjectDialog onCreate={addProject} />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search projects, client or lead…"
          className="max-w-sm"
        />
        <FilterBar
          filters={filters}
          onReset={() => {
            setStatus("all");
            setClient("all");
            setLead("all");
          }}
        />
        <div className="ml-auto flex items-center gap-1 rounded-xl border border-border bg-card p-1">
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

      {filtered.length === 0 ? (
        <div className="surface-card p-6">
          <EmptyState
            title="No projects match your filters"
            description="Try a different search term or reset your filters."
          />
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} view="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} view="list" />
          ))}
        </div>
      )}
    </section>
  );
}
