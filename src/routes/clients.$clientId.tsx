import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Globe, MapPin } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { clientById, money } from "@/data/crm";

export const Route = createFileRoute("/clients/$clientId")({
  head: () => ({
    meta: [
      { title: "Client Details — AgencyOS" },
      { name: "description", content: "Review a client's account, retainers, projects and activity." },
      { property: "og:title", content: "Client Details — AgencyOS" },
      { property: "og:description", content: "Review a client's account, retainers, projects and activity." },
    ],
  }),
  component: ClientDetailPage,
});

function ClientDetailPage() {
  const { clientId } = Route.useParams();
  const client = clientById(clientId);

  if (!client) {
    return (
      <section className="mx-auto max-w-7xl">
        <Link to="/clients" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="size-4" /> Back to clients
        </Link>
        <h1 className="mt-8 text-2xl font-bold">Client not found</h1>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <Link to="/clients" className="mb-5 inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="size-4" /> Back to clients
      </Link>
      <PageHeader
        title={client.name}
        description={`${client.industry} · Client since ${client.since}`}
        actions={<StatusBadge status={client.health} />}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-5 md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft font-semibold text-accent-foreground">{client.logo}</span>
            <div>
              <p className="font-semibold">Account overview</p>
              <p className="text-sm text-muted-foreground">{client.notes}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Metric label="Monthly retainer" value={money(client.mrr)} />
            <Metric label="Active projects" value={String(client.projects)} />
            <Metric label="Account owner" value={client.owner} />
          </div>
        </div>
        <div className="surface-card space-y-4 p-5">
          <p className="font-semibold">Contact details</p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" /> {client.address}</p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground"><Globe className="size-4" /> {client.website}</p>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}