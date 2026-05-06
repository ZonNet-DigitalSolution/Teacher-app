export interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  student?: { id: number; name: string; grade?: string } | null;
  created_at?: string;
  date?: string;
  class_name?: string;
}
