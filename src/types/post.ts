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
  reposts_count: number;
  reposted_by_current_user: boolean;
}

export interface PostItem {
  type: 'post' | 'repost';
  data: Post;
  reposted_by?: {
    id: number;
    name: string;
  };
  timestamp: string;
}