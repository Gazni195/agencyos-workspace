// Client-side Assets state. Seeded from src/data/workspace.ts. Mutations
// live only in memory for this session — swap for API calls later
// without touching the UI layer.
import { create } from "zustand";
import { assetFiles as seedFiles, assetFolders, type AssetFile } from "@/data/workspace";

type AssetsState = {
  files: AssetFile[];
  toggleShared: (id: string) => void;
  addFile: (file: AssetFile) => void;
};

export const useAssetsStore = create<AssetsState>((set) => ({
  files: seedFiles,
  toggleShared: (id) =>
    set((s) => ({ files: s.files.map((f) => (f.id === id ? { ...f, shared: !f.shared } : f)) })),
  addFile: (file) => set((s) => ({ files: [file, ...s.files] })),
}));

export { assetFolders };
