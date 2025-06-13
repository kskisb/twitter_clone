import { client } from './client';
import type { Post } from '../types/post';

export const getAllPosts = async (): Promise<Post[]> => {
  const response = await client.get<Post[]>('/posts');
  return response.data;
}

export const getUserPosts = async (userId: number): Promise<Post[]> => {
  const response = await client.get<Post[]>(`/users/${userId}/posts`);
  return response.data;
}

export const getFollowingPosts = async (): Promise<Post[]> => {
  const response = await client.get<Post[]>('/posts/following');
  return response.data;
}

export const getPost = async (postId: number): Promise<Post> => {
  const response = await client.get<Post>(`/posts/${postId}`);
  return response.data;
}

export const createPost = async (content: string): Promise<Post> => {
  const response = await client.post<Post>('/posts', { post: { content } });
  return response.data;
}

export const updatePost = async (postId: number, content: string): Promise<Post> => {
  const response = await client.put<Post>(`/posts/${postId}`, {
    post: { content }
  });
  return response.data;
}

export const deletePost = async (postId: number): Promise<void> => {
  await client.delete(`/posts/${postId}`);
}