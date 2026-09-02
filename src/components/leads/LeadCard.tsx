import { Link } from "@tanstack/react-router";
import { ArrowRightCircle, MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { leadStages, money, type LeadStage } from "@/data/crm";
import { useLeadsStore, type StoreLead } from "@/store/leadsStore";
import { cn } from "@/lib/utils";

export function LeadCard({
  lead,
  onConvert,
  dragging = false,
  onDragStart,
  onDragEnd,
}: {
  lead: StoreLead;
  onConvert?: (lead: StoreLead) => void;
  dragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}) {
  const setStage = useLeadsStore((s) => s.setStage);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "surface-card cursor-grab space-y-2 p-3 active:cursor-grabbing",
        dragging && "opacity-40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          to="/leads/$leadId"
          params={{ leadId: lead.id }}
          className="min-w-0 hover:text-primary"
        >
          <p className="truncate text-sm font-semibold">{lead.company}</p>
          <p className="truncate text-xs text-muted-foreground">{lead.contact}</p>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0"
              aria-label={`Move ${lead.company}`}
            >
              <MoveRight className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {leadStages
              .filter((s) => s !== lead.stage)
              .map((stage: LeadStage) => (
                <DropdownMenuItem key={stage} onSelect={() => setStage(lead.id, stage)}>
                  Move to {stage}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm font-bold tabular-nums">{money(lead.value)}</p>
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="truncate">{lead.owner}</span>
        <Badge variant="secondary" className="shrink-0 font-normal">
          {lead.source}
        </Badge>
      </div>
      {lead.stage === "Won" && !lead.convertedClientId && onConvert && (
        <Button
          size="sm"
          variant="outline"
          className="w-full gap-1.5 text-xs"
          onClick={() => onConvert(lead)}
        >
          <ArrowRightCircle className="size-3.5" /> Convert to client
        </Button>
      )}
      {lead.convertedClientId && (
        <Link
          to="/clients/$clientId"
          params={{ clientId: lead.convertedClientId }}
          className="block text-xs font-medium text-primary hover:underline"
        >
          View client →
        </Link>
      )}
    </div>
  );
}
