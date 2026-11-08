export type FileType = 'folder' | 'pdf' | 'markdown' | 'image' | 'link' | 'vcard';

export type FinderViewMode = 'icons' | 'list' | 'columns';

export interface FinderItem {
  id: string;
  name: string;
  type: FileType;
  size?: string;
  kind?: string;
  dateModified: string;
  parentId?: string; // id of parent folder, e.g. "documents", "projects", "desktop", "downloads"
  content?: string; // PDF url, image url, or raw markdown/text
  externalUrl?: string; // For external link shortcuts
  thumbnail?: string; // Thumbnail image path
  tags?: string[]; // e.g., ["Featured", "Production", "Active"]
  description?: string;
  badge?: string;
}

export interface SidebarSection {
  id: string;
  title: string;
  items: {
    id: string;
    label: string;
    icon: string;
    folderId: string;
    badge?: number;
    color?: string;
  }[];
}
