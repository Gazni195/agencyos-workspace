import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/frontend/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/frontend/components/ui/dialog";
import { Input } from "@/shared/frontend/components/ui/input";
import { Label } from "@/shared/frontend/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/frontend/components/ui/select";
import { assetFolders } from "@/modules/assets/frontend/store/assetsStore";
import type { AssetFile } from "@/modules/assets/types";

const CURRENT_USER = { id: "self", name: "Daniel Reyes", initials: "DR" };

const fileTypes: AssetFile["type"][] = [
  "doc",
  "sheet",
  "image",
  "video",
  "pdf",
  "slide",
  "archive",
];

export function UploadAssetDialog({ onUpload }: { onUpload: (file: AssetFile) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<AssetFile["type"]>("doc");
  const [folderId, setFolderId] = useState("root");
  const [tags, setTags] = useState("");

  const reset = () => {
    setName("");
    setType("doc");
    setFolderId("root");
    setTags("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("File name is required.");
      return;
    }
    const file: AssetFile = {
      id: `af-${Date.now()}`,
      name: name.trim(),
      type,
      size: "—",
      ownerId: CURRENT_USER.id,
      ownerName: CURRENT_USER.name,
      ownerInitials: CURRENT_USER.initials,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      updated: new Date().toISOString().slice(0, 10),
      shared: false,
      expiring: false,
      folderId,
      versions: [
        {
          id: "v1",
          label: "v1",
          date: new Date().toISOString().slice(0, 10),
          author: CURRENT_USER.name,
        },
      ],
    };
    onUpload(file);
    toast.success(`${file.name} uploaded`);
    setOpen(false);
    reset();
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
        <Button className="gap-2">
          <Upload className="size-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload asset</DialogTitle>
            <DialogDescription>Add a file to the asset library.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="asset-name">File name</Label>
              <Input
                id="asset-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Campaign Brief v2.pdf"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as AssetFile["type"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fileTypes.map((t) => (
                      <SelectItem key={t} value={t} className="capitalize">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Folder</Label>
                <Select value={folderId} onValueChange={setFolderId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assetFolders.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="asset-tags">Tags</Label>
              <Input
                id="asset-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma-separated, optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
