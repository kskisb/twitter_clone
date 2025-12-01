import { client } from './client';
import type { Post } from '../types/post';

export const repostPost = async (postId: number): Promise<{ message: string; repost_id: number; reposts_count: number }> => {
  const response = await client.post(`/posts/${postId}/repost`);
  return response.data;
}

export const unrepostPost = async (postId: number): Promise<{ message: string; reposts_count: number }> => {
  const response = await client.delete(`/posts/${postId}/repost`);
  return response.data;
}

export const getRepostedUsers = async (postId: number) => {
  const response = await client.get(`/posts/${postId}/reposted_users`);
  return response.data;
}

export const getUserRepostedPosts = async (userId: number): Promise<Post[]> => {
  const response = await client.get<Post[]>(`/users/${userId}/reposts`);
  return response.data;
}