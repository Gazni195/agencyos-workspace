import { useState } from "react";
import { Link, getRouteApi } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, ArrowRightCircle, Mail, Phone, Send } from "lucide-react";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { EmptyState } from "@/shared/frontend/components/EmptyState";
import { ConvertLeadDialog } from "@/modules/leads/frontend/components/ConvertLeadDialog";
import { Badge } from "@/shared/frontend/components/ui/badge";
import { Button } from "@/shared/frontend/components/ui/button";
import { Textarea } from "@/shared/frontend/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/frontend/components/ui/select";
import { leadStageColor, leadStages, type LeadStage } from "@/modules/leads/types";
import { money } from "@/shared/frontend/utils/money";
import { useLeadsStore } from "@/modules/leads/frontend/store/leadsStore";
import { cn } from "@/shared/frontend/utils/utils";

const routeApi = getRouteApi("/leads/$leadId");

export function LeadDetailPage() {
  const { leadId } = routeApi.useParams();
  const lead = useLeadsStore((s) => s.leads.find((l) => l.id === leadId));
  const setStage = useLeadsStore((s) => s.setStage);
  const addNote = useLeadsStore((s) => s.addNote);

  const [note, setNote] = useState("");
  const [convertOpen, setConvertOpen] = useState(false);

  if (!lead) {
    return (
      <section className="mx-auto max-w-7xl">
        <Link
          to="/leads"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to leads
        </Link>
        <h1 className="mt-8 text-2xl font-bold">Lead not found</h1>
      </section>
    );
  }

  const notes = [...lead.notes].sort((a, b) => b.when.localeCompare(a.when));

  return (
    <section className="mx-auto max-w-7xl">
      <Link
        to="/leads"
        className="mb-5 inline-flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to leads
      </Link>
      <PageHeader
        title={lead.company}
        description={`${lead.contact} · Lead since ${lead.createdOn}`}
        actions={
          <>
            {lead.convertedClientId ? (
              <Link
                to="/clients/$clientId"
                params={{ clientId: lead.convertedClientId }}
                className="text-sm font-medium text-primary hover:underline"
              >
                View client →
              </Link>
            ) : (
              <Button size="sm" className="gap-1.5" onClick={() => setConvertOpen(true)}>
                <ArrowRightCircle className="size-3.5" /> Convert to client
              </Button>
            )}
            <Select value={lead.stage} onValueChange={(v) => setStage(lead.id, v as LeadStage)}>
              <SelectTrigger className="h-9 w-40" aria-label="Change stage">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {leadStages.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-5 md:col-span-2">
          <div className="flex items-center gap-3">
            <Badge className={cn("border-transparent font-medium", leadStageColor[lead.stage])}>
              {lead.stage}
            </Badge>
            {lead.convertedClientId && <Badge variant="secondary">Converted</Badge>}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Metric label="Deal value" value={money(lead.value)} />
            <Metric label="Owner" value={lead.owner} />
            <Metric label="Source" value={lead.source} />
            <Metric label="Next action" value={lead.nextAction} />
            <Metric label="Created" value={lead.createdOn} />
          </div>
        </div>
        <div className="surface-card space-y-4 p-5">
          <p className="font-semibold">Contact details</p>
          <a
            href={`mailto:${lead.email}`}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Mail className="size-4" /> {lead.email}
          </a>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="size-4" /> {lead.phone}
          </p>
        </div>
      </div>

      <div className="surface-card mt-4 p-5">
        <p className="mb-4 font-semibold">Notes</p>
        <form
          className="mb-5 flex items-start gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!note.trim()) return;
            addNote(lead.id, {
              id: `n-${lead.id}-${Date.now()}`,
              author: lead.owner,
              when: new Date().toISOString().slice(0, 10),
              text: note.trim(),
            });
            setNote("");
            toast.success("Note added");
          }}
        >
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Log a call, email or update…"
            className="min-h-[44px]"
          />
          <Button type="submit" size="icon" className="shrink-0" aria-label="Add note">
            <Send className="size-4" />
          </Button>
        </form>
        {notes.length === 0 ? (
          <EmptyState
            title="No notes yet"
            description="Notes and updates for this lead will show up here."
          />
        ) : (
          <ol className="space-y-4">
            {notes.map((n, i) => (
              <li key={n.id} className="relative flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                  {i < notes.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
                </div>
                <div className="pb-1">
                  <p className="text-sm">{n.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {n.author} · {n.when}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <ConvertLeadDialog lead={lead} open={convertOpen} onOpenChange={setConvertOpen} />
    </section>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
