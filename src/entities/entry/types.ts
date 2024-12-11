export interface Entry {
  id: string;
  groupId: string;
  title: string;
  username: string;
  password: string;
  url?: string | null;
  notes?: string | null;
  lastModified: string;
  createdAt: string;
}
