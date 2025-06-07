import { client } from './client';

export const likePost = async (postId: number) => {
  const response = await client.post(`/posts/${postId}/like`);
  return response.data;
};

export const unlikePost = async (postId: number) => {
  const response = await client.delete(`/posts/${postId}/like`);
  return response.data;
};

export const getLikedUsers = async (postId: number) => {
  const response = await client.get(`/posts/${postId}/liked_users`);
  return response.data;
};

export const getLikedPosts = async (userId: number) => {
  const response = await client.get(`/users/${userId}/likes`);
  return response.data;
};