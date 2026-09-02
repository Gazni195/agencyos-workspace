import { useState } from "react";
import { LeadCard } from "./LeadCard";
import { leadStages, money, type LeadStage } from "@/data/crm";
import { useLeadsStore, type StoreLead } from "@/store/leadsStore";
import { cn } from "@/lib/utils";

export function PipelineBoard({
  leads,
  onConvert,
}: {
  leads: StoreLead[];
  onConvert: (lead: StoreLead) => void;
}) {
  const setStage = useLeadsStore((s) => s.setStage);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<LeadStage | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {leadStages.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage);
        const stageValue = stageLeads.reduce((sum, l) => sum + l.value, 0);
        return (
          <div
            key={stage}
            onDragOver={(e) => {
              e.preventDefault();
              setOverStage(stage);
            }}
            onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
            onDrop={(e) => {
              e.preventDefault();
              if (draggingId) setStage(draggingId, stage);
              setDraggingId(null);
              setOverStage(null);
            }}
            className={cn(
              "flex w-72 shrink-0 flex-col rounded-2xl border border-border bg-muted/30 p-3 transition-colors",
              overStage === stage && "border-primary/50 bg-primary-soft/40",
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-sm font-semibold">{stage}</p>
              <span className="text-xs text-muted-foreground">{stageLeads.length}</span>
            </div>
            <p className="mb-3 px-1 text-xs text-muted-foreground">{money(stageValue)}</p>
            <div className="flex-1 space-y-2">
              {stageLeads.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  No leads
                </p>
              ) : (
                stageLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onConvert={onConvert}
                    dragging={draggingId === lead.id}
                    onDragStart={() => setDraggingId(lead.id)}
                    onDragEnd={() => setDraggingId(null)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
