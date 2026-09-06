// Client-side Assets state, backed by Supabase's `asset_files` table (see
// supabase/migrations/0009_assets.sql). Folders stay a fixed, hardcoded
// taxonomy — there's no create/rename/delete UI for them.
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { assetFolders, type AssetFile } from "@/data/workspace";

type AssetFileRow = {
  id: string;
  name: string;
  type: AssetFile["type"];
  size: string;
  owner_id: string;
  owner_name: string;
  owner_initials: string;
  tags: string[];
  shared: boolean;
  expiring: boolean;
  folder_id: string;
  versions: AssetFile["versions"];
};

function fromRow(row: AssetFileRow): AssetFile {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    size: row.size,
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    ownerInitials: row.owner_initials,
    tags: row.tags,
    updated: "",
    shared: row.shared,
    expiring: row.expiring,
    folderId: row.folder_id,
    versions: row.versions,
  };
}

export type NewAssetFileInput = Omit<AssetFile, "id" | "updated">;

type AssetsState = {
  files: AssetFile[];
  loaded: boolean;
  fetchFiles: () => Promise<void>;
  toggleShared: (id: string) => Promise<void>;
  addFile: (file: NewAssetFileInput) => Promise<AssetFile | null>;
};

export const useAssetsStore = create<AssetsState>((set, get) => ({
  files: [],
  loaded: false,
  fetchFiles: async () => {
    const { data, error } = await supabase
      .from("asset_files")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("Failed to load assets", error);
      set({ loaded: true });
      return;
    }
    set({
      files: (data as (AssetFileRow & { updated_at: string })[]).map((row) => ({
        ...fromRow(row),
        updated: row.updated_at.slice(0, 10),
      })),
      loaded: true,
    });
  },
  toggleShared: async (id) => {
    const file = get().files.find((f) => f.id === id);
    if (!file) return;
    const shared = !file.shared;
    const { error } = await supabase.from("asset_files").update({ shared }).eq("id", id);
    if (error) {
      console.error("Failed to update asset", error);
      return;
    }
    set((s) => ({ files: s.files.map((f) => (f.id === id ? { ...f, shared } : f)) }));
  },
  addFile: async (file) => {
    const { data, error } = await supabase
      .from("asset_files")
      .insert({
        name: file.name,
        type: file.type,
        size: file.size,
        owner_id: file.ownerId,
        owner_name: file.ownerName,
        owner_initials: file.ownerInitials,
        tags: file.tags,
        shared: file.shared,
        expiring: file.expiring,
        folder_id: file.folderId,
        versions: file.versions,
      })
      .select()
      .single();
    if (error || !data) {
      console.error("Failed to upload asset", error);
      return null;
    }
    const row = data as AssetFileRow & { updated_at: string };
    const created = { ...fromRow(row), updated: row.updated_at.slice(0, 10) };
    set((s) => ({ files: [created, ...s.files] }));
    return created;
  },
}));

export { assetFolders };
