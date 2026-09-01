// Types & seed data for the Assets module.
export type AssetFile = {
  id: string;
  name: string;
  type: "doc" | "sheet" | "image" | "video" | "pdf" | "slide" | "archive";
  size: string;
  ownerId: string;
  ownerName: string;
  ownerInitials: string;
  tags: string[];
  updated: string;
  shared: boolean;
  expiring: boolean;
  folderId: string;
  versions: { id: string; label: string; date: string; author: string }[];
};

export type AssetFolder = {
  id: string;
  name: string;
  parentId: string | null;
};

export const assetFolders: AssetFolder[] = [
  { id: "root", name: "All Assets", parentId: null },
  { id: "fld-brand", name: "Brand Guidelines", parentId: "root" },
  { id: "fld-contracts", name: "Client Contracts", parentId: "root" },
  { id: "fld-media", name: "Media Kits", parentId: "root" },
  { id: "fld-legal", name: "Legal", parentId: "root" },
  { id: "fld-brand-logos", name: "Logo Files", parentId: "fld-brand" },
];

export const assetFiles: AssetFile[] = [];
