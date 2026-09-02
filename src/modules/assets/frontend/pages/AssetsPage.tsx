import { useState } from "react";
import {
  Archive,
  Clock3,
  FileText,
  FileSpreadsheet,
  Folder,
  Image as ImageIcon,
  Presentation,
  Search,
  Share2,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/shared/frontend/components/PageHeader";
import { EmptyState } from "@/shared/frontend/components/EmptyState";
import { DrawerPanel } from "@/shared/frontend/components/DrawerPanel";
import { UploadAssetDialog } from "@/modules/assets/frontend/components/UploadAssetDialog";
import { Avatar, AvatarFallback } from "@/shared/frontend/components/ui/avatar";
import { Badge } from "@/shared/frontend/components/ui/badge";
import { Button } from "@/shared/frontend/components/ui/button";
import { Input } from "@/shared/frontend/components/ui/input";
import { cn } from "@/shared/frontend/utils/utils";
import { useAssetsStore, assetFolders } from "@/modules/assets/frontend/store/assetsStore";
import type { AssetFile } from "@/modules/assets/types";

export const TYPE_ICONS: Record<AssetFile["type"], LucideIcon> = {
  doc: FileText,
  pdf: FileText,
  sheet: FileSpreadsheet,
  image: ImageIcon,
  video: Video,
  slide: Presentation,
  archive: Archive,
};

export const typeFilters = [
  "all",
  "doc",
  "sheet",
  "image",
  "video",
  "pdf",
  "slide",
  "archive",
] as const;
export type TypeFilter = (typeof typeFilters)[number];

export function AssetsPage() {
  const files = useAssetsStore((s) => s.files);
  const toggleShared = useAssetsStore((s) => s.toggleShared);
  const addFile = useAssetsStore((s) => s.addFile);

  const [folderId, setFolderId] = useState("root");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sharedOnly, setSharedOnly] = useState(false);
  const [expiringOnly, setExpiringOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = files.find((f) => f.id === selectedId) ?? null;

  const scoped = folderId === "root" ? files : files.filter((f) => f.folderId === folderId);
  const filtered = scoped.filter((f) => {
    if (typeFilter !== "all" && f.type !== typeFilter) return false;
    if (sharedOnly && !f.shared) return false;
    if (expiringOnly && !f.expiring) return false;
    if (query.trim() && !f.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const topLevel = assetFolders.filter((f) => f.parentId === "root");
  const childrenOf = (parentId: string) => assetFolders.filter((f) => f.parentId === parentId);

  return (
    <section className="mx-auto max-w-7xl">
      <PageHeader
        title="Assets"
        description="Brand files, contracts and creative — organized in one library."
        actions={<UploadAssetDialog onUpload={addFile} />}
      />

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="surface-card h-fit p-2">
          <FolderRow
            label="All Assets"
            count={files.length}
            active={folderId === "root"}
            onClick={() => setFolderId("root")}
          />
          {topLevel.map((f) => (
            <div key={f.id}>
              <FolderRow
                label={f.name}
                count={files.filter((file) => file.folderId === f.id).length}
                active={folderId === f.id}
                onClick={() => setFolderId(f.id)}
              />
              {childrenOf(f.id).map((child) => (
                <FolderRow
                  key={child.id}
                  label={child.name}
                  count={files.filter((file) => file.folderId === child.id).length}
                  active={folderId === child.id}
                  onClick={() => setFolderId(child.id)}
                  indent
                />
              ))}
            </div>
          ))}
        </div>

        <div>
          <div className="surface-card mb-4 space-y-3 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search assets…"
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {typeFilters.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                    typeFilter === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSharedOnly((v) => !v)}
                className={cn(
                  "ml-auto rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  sharedOnly
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                Shared
              </button>
              <button
                type="button"
                onClick={() => setExpiringOnly((v) => !v)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  expiringOnly
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                Expiring
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="surface-card">
              <EmptyState
                icon={Folder}
                title="No assets found"
                description="Try a different folder or filter."
              />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((f) => {
                const Icon = TYPE_ICONS[f.type];
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedId(f.id)}
                    className="surface-card flex flex-col gap-3 p-4 text-left transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground">
                        <Icon className="size-5" />
                      </span>
                      <div className="flex items-center gap-1.5">
                        {f.shared && <Share2 className="size-3.5 text-muted-foreground" />}
                        {f.expiring && (
                          <Badge variant="destructive" className="h-5 gap-1 px-1.5 text-[10px]">
                            <Clock3 className="size-3" /> Expiring
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{f.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {f.size} · Updated {f.updated}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {f.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center gap-2 pt-1">
                      <Avatar className="size-6">
                        <AvatarFallback className="bg-primary-soft text-[10px] text-accent-foreground">
                          {f.ownerInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{f.ownerName}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DrawerPanel
        open={!!selected}
        onOpenChange={(v) => !v && setSelectedId(null)}
        title={selected?.name ?? ""}
        description={selected ? `${selected.size} · Updated ${selected.updated}` : undefined}
        footer={
          selected && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => toggleShared(selected.id)}
            >
              <Share2 className="size-4" />
              {selected.shared ? "Unshare" : "Share"}
            </Button>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            {selected.expiring && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <Clock3 className="size-4 shrink-0" />
                This asset is expiring soon.
              </div>
            )}
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">Owner</p>
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary-soft text-xs text-accent-foreground">
                    {selected.ownerInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{selected.ownerName}</span>
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.length === 0 && (
                  <span className="text-sm text-muted-foreground">No tags</span>
                )}
                {selected.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase text-muted-foreground">
                Version history
              </p>
              <ul className="space-y-2">
                {selected.versions.map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">{v.label}</p>
                      <p className="text-xs text-muted-foreground">{v.author}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{v.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </DrawerPanel>
    </section>
  );
}

export function FolderRow({
  label,
  count,
  active,
  onClick,
  indent,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  indent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
        indent && "ml-4",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Folder className="size-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      <span
        className={cn("text-xs", active ? "text-primary-foreground/80" : "text-muted-foreground")}
      >
        {count}
      </span>
    </button>
  );
}
