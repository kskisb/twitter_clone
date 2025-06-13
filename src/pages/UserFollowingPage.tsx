import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getFollowing } from '../api/relationships';
import { getUserDetail } from '../api/users';
import UserFollowTabs from '../components/UserFollowTabs';
import type { User } from '../types/user';

const UserFollowingPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !isAuthenticated) return;

      try {
        const userData = await getUserDetail(parseInt(userId));
        setUser(userData);

        const following = await getFollowing(parseInt(userId));
        setFollowingUsers(following);
      } catch (err) {
        console.error('データの取得に失敗しました:', err);
        setError('ユーザーデータの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container">
        <p>このページを表示するにはログインが必要です。</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container">
        <p>{error || 'ユーザーが見つかりません。'}</p>
        <button onClick={() => navigate(-1)}>戻る</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <h1>{user.name}</h1>
      </div>

      <UserFollowTabs user={user} activeTab="following" />

      {followingUsers.length === 0 ? (
        <p className="empty-message">フォローしているユーザーはいません。</p>
      ) : (
        <ul className="user-list">
          {followingUsers.map(followingUser => (
            <li key={followingUser.id} className="user-item">
              <button
                className="user-link"
                onClick={() => navigate(`/user/${followingUser.id}`)}
              >
                <div className="user-avatar">{followingUser.name.charAt(0)}</div>
                <div className="user-info">
                  <h3 className="user-name">{followingUser.name}</h3>
                  <p className="user-email">{followingUser.email}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserFollowingPage;