import { client } from './client';
import type { SignupFormData } from '../types/user';
import type { AuthResponse } from '../types/user';

export const signup = async (userData: SignupFormData): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/users', { user: userData });
  return response.data;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/auth/login', {
    user: { email, password }
  });
  return response.data;
}

export const getCurrentUser = async () => {
  const response = await client.get('/users/me');
  return response.data;
};
