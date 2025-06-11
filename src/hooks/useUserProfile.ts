import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserDetail } from '../api/users';
import type { User } from '../types/user';

export const useUserProfile = (userId: string | undefined) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const userData = await getUserDetail(parseInt(userId));
        setUser(userData);
      } catch (err) {
        console.error('ユーザー情報の取得に失敗しました:', err);
        setError('ユーザー情報の取得に失敗しました。後でもう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && userId) {
      fetchUserData();
    }
  }, [isAuthenticated, userId]);

  return { user, isLoading, error, isAuthenticated };
}