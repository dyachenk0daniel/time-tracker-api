export interface Group {
  id: string;
  userId: string;
  parentGroupId?: string | null;
  name: string;
  createdAt: string;
}
