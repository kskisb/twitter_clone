import { client } from './client';
import type { User } from '../types/user';

// フォロー関係を作成（フォローする）
export const followUser = async (followedId: number): Promise<{ relationshipId: number }> => {
  const response = await client.post('/relationships', { followed_id: followedId });
  return response.data;
};

// フォロー関係を削除（フォロー解除する）
export const unfollowUser = async (relationshipId: number): Promise<void> => {
  await client.delete(`/relationships/${relationshipId}`);
};

// ユーザーがフォローしているかどうかを確認
export const checkFollowingStatus = async (userId: number): Promise<{ isFollowing: boolean, relationshipId?: number }> => {
  const response = await client.get(`/relationships/check/${userId}`);
  return response.data;
};

// ユーザーがフォローしているユーザー一覧を取得
export const getFollowing = async (userId: number): Promise<User[]> => {
  const response = await client.get(`/users/${userId}/following`);
  return response.data;
};

// ユーザーのフォロワー一覧を取得
export const getFollowers = async (userId: number): Promise<User[]> => {
  const response = await client.get(`/users/${userId}/followers`);
  return response.data;
};