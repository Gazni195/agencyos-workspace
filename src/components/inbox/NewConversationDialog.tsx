import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { useSessionStore } from "@/store/sessionStore";
import type { Conversation } from "@/data/workspace";
import type { NewConversationInput } from "@/store/inboxStore";

const folders: { value: Conversation["folder"]; label: string }[] = [
  { value: "team", label: "Team" },
  { value: "client", label: "Client" },
  { value: "system", label: "System" },
];

type OtherProfile = { id: string; name: string };

export function NewConversationDialog({
  onCreate,
}: {
  onCreate: (input: NewConversationInput) => void;
}) {
  const selfId = useSessionStore((s) => s.profile?.id);
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<OtherProfile[]>([]);
  const [subject, setSubject] = useState("");
  const [folder, setFolder] = useState<Conversation["folder"]>("team");
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    void supabase
      .from("profiles")
      .select("id, full_name")
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load teammates", error);
          return;
        }
        setProfiles(
          (data ?? [])
            .filter((p) => p.id !== selfId)
            .map((p) => ({ id: p.id as string, name: p.full_name as string })),
        );
      });
  }, [open, selfId]);

  const reset = () => {
    setSubject("");
    setFolder("team");
    setParticipantIds([]);
    setMessage("");
  };

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and an opening message are required.");
      return;
    }
    onCreate({
      subject: subject.trim(),
      folder,
      participantProfileIds: participantIds,
      firstMessage: message.trim(),
    });
    toast.success("Conversation started");
    reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-4" /> New conversation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New conversation</DialogTitle>
          <DialogDescription>Start a thread with your team.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="conv-subject">Subject</Label>
            <Input
              id="conv-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Q3 campaign kickoff"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Folder</Label>
            <Select value={folder} onValueChange={(v) => setFolder(v as Conversation["folder"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {folders.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Participants</Label>
            {profiles.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No other teammates have signed in yet — this thread will just be for your own notes
                until someone else joins.
              </p>
            ) : (
              <div className="space-y-1.5">
                {profiles.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={participantIds.includes(p.id)}
                      onCheckedChange={(v) =>
                        setParticipantIds((ids) =>
                          v === true ? [...ids, p.id] : ids.filter((id) => id !== p.id),
                        )
                      }
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="conv-message">Opening message</Label>
            <Textarea
              id="conv-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something to get the thread started…"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Start conversation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
