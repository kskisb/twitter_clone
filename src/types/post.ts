export interface Post {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id?: number;
  user?: {
    id: number;
    name: string;
    email?: string;
  };
  likes_count: number;
  liked_by_current_user: boolean;
}