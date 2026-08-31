import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  FileText,
  Flag,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Receipt,
  StickyNote,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { EditClientDialog } from "@/components/clients/EditClientDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClientsStore } from "@/store/clientsStore";
import { useProjectsStore } from "@/store/projectsStore";
import { useDeliverablesStore } from "@/store/deliverablesStore";
import { clientContacts, clientActivity, clientDocuments, money } from "@/data/crm";
import { toast } from "sonner";

export const Route = createFileRoute("/clients/$clientId")({
  head: () => ({
    meta: [
      { title: "Client Details — AgencyOS" },
      {
        name: "description",
        content: "Review a client's account, retainers, projects and activity.",
      },
      { property: "og:title", content: "Client Details — AgencyOS" },
      {
        property: "og:description",
        content: "Review a client's account, retainers, projects and activity.",
      },
    ],
  }),
  component: ClientDetailPage,
});

const activityIcon: Record<string, typeof StickyNote> = {
  note: StickyNote,
  meeting: UsersIcon,
  email: Mail,
  milestone: Flag,
  invoice: Receipt,
};

function ClientDetailPage() {
  const { clientId } = Route.useParams();
  const navigate = useNavigate();
  const client = useClientsStore((s) => s.clients.find((c) => c.id === clientId));
  const updateClient = useClientsStore((s) => s.updateClient);
  const removeClient = useClientsStore((s) => s.removeClient);
  const projects = useProjectsStore((s) => s.projects);
  const allDeliverables = useDeliverablesStore((s) => s.deliverables);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!client) {
    return (
      <section className="mx-auto max-w-7xl">
        <Link
          to="/clients"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to clients
        </Link>
        <h1 className="mt-8 text-2xl font-bold">Client not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This client may have been deleted. It's no longer in your workspace.
        </p>
      </section>
    );
  }

  const contacts = clientContacts.filter((c) => c.clientId === client.id);
  const activity = [...clientActivity.filter((a) => a.clientId === client.id)].sort((a, b) =>
    b.when.localeCompare(a.when),
  );
  const documents = clientDocuments.filter((d) => d.clientId === client.id);
  const clientProjects = projects.filter((p) => p.clientId === client.id);
  const activeProjectCount = clientProjects.filter((p) => p.status !== "completed").length;
  const clientProjectIds = new Set(clientProjects.map((p) => p.id));
  const deliverables = allDeliverables.filter((d) => clientProjectIds.has(d.projectId));

  return (
    <section className="mx-auto max-w-7xl">
      <Link
        to="/clients"
        className="mb-5 inline-flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to clients
      </Link>
      <PageHeader
        title={client.name}
        description={`${client.industry} · Client since ${client.since}`}
        actions={
          <>
            <StatusBadge status={client.health} />
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="size-3.5" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" /> Delete
            </Button>
          </>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables ({deliverables.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline ({activity.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="surface-card p-5 md:col-span-2">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft font-semibold text-accent-foreground">
                  {client.logo}
                </span>
                <div>
                  <p className="font-semibold">Account overview</p>
                  <p className="text-sm text-muted-foreground">{client.notes}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Package" value={client.packageName} />
                <Metric
                  label={client.packageType === "monthly" ? "Monthly price" : "Project price"}
                  value={money(client.packagePrice)}
                />
                <Metric label="Active projects" value={String(activeProjectCount)} />
                <Metric label="Account owner" value={client.owner} />
              </div>
            </div>
            <div className="surface-card space-y-4 p-5">
              <p className="font-semibold">Contact details</p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {client.address}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="size-4" /> {client.website}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="mt-5">
          {contacts.length === 0 ? (
            <div className="surface-card p-6">
              <EmptyState
                title="No contacts yet"
                description="Add a contact to keep track of who to reach at this account."
              />
            </div>
          ) : (
            <div className="surface-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.role}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${c.email}`}
                          className="inline-flex items-center gap-1.5 text-primary hover:underline"
                        >
                          <Mail className="size-3.5" /> {c.email}
                        </a>
                      </TableCell>
                      <TableCell className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="size-3.5" /> {c.phone}
                      </TableCell>
                      <TableCell>
                        {c.primary && (
                          <StatusBadge
                            status="primary"
                            className="bg-primary/12 text-primary border-primary/25"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="deliverables" className="mt-5">
          {deliverables.length === 0 ? (
            <div className="surface-card p-6">
              <EmptyState
                title="No deliverables yet"
                description="Client-facing outputs across this client's projects will show up here."
              />
            </div>
          ) : (
            <div className="surface-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deliverable</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliverables.map((d) => {
                    const project = clientProjects.find((p) => p.id === d.projectId);
                    return (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.title}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {project ? (
                            <Link
                              to="/projects/$projectId"
                              params={{ projectId: project.id }}
                              className="hover:underline"
                            >
                              {project.name}
                            </Link>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{d.type}</TableCell>
                        <TableCell className="text-muted-foreground">{d.dueDate}</TableCell>
                        <TableCell>
                          <StatusBadge status={d.status} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="mt-5">
          {activity.length === 0 ? (
            <div className="surface-card p-6">
              <EmptyState
                title="No activity yet"
                description="Notes, meetings and milestones for this account will show up here."
              />
            </div>
          ) : (
            <ol className="surface-card space-y-5 p-5">
              {activity.map((a, i) => {
                const Icon = activityIcon[a.type] ?? StickyNote;
                return (
                  <li key={a.id} className="relative flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-accent-foreground">
                        <Icon className="size-4" />
                      </span>
                      {i < activity.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{a.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.who} ·{" "}
                        {new Date(a.when).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-5">
          {documents.length === 0 ? (
            <div className="surface-card p-6">
              <EmptyState
                title="No documents yet"
                description="Contracts, briefs and reports for this account will show up here."
              />
            </div>
          ) : (
            <div className="surface-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="flex items-center gap-2 font-medium">
                        <FileText className="size-4 text-muted-foreground" /> {d.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{d.category}</TableCell>
                      <TableCell className="text-muted-foreground">{d.size}</TableCell>
                      <TableCell className="text-muted-foreground">{d.uploadedOn}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <EditClientDialog
        client={client}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={(patch) => updateClient(client.id, patch)}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${client.name}?`}
        description="This removes the client and its association from your workspace. This cannot be undone."
        onConfirm={() => {
          removeClient(client.id);
          toast.success(`${client.name} deleted`);
          navigate({ to: "/clients" });
        }}
      />
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
