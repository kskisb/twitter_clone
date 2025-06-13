import { client } from './client';
import type { User } from '../types/user';

export const getAllUsers = async (): Promise<User[]> => {
  const response = await client.get<User[]>('/users');
  return response.data;
}

export const getUserDetail = async (userId: number): Promise<User> => {
  const response = await client.get<User>(`/users/${userId}`);
  return response.data;
}