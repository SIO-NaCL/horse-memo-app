export type Horse = {
  id: number;
  name: string;
};

export type Note = {
  id: number;
  horse: number;
  title: string;
  body: string;
  url: string;
  created_at: string;
  updated_at: string;
};

export type SortKey = "created_at" | "updated_at";
export type SortOrder = "asc" | "desc";