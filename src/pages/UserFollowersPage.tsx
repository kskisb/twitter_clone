import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getFollowers } from '../api/relationships';
import { getUserDetail } from '../api/users';
import UserFollowTabs from '../components/UserFollowTabs';
import type { User } from '../types/user';

const UserFollowersPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !isAuthenticated) return;

      try {
        const userData = await getUserDetail(parseInt(userId));
        setUser(userData);

        const followerUsers = await getFollowers(parseInt(userId));
        setFollowers(followerUsers);
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
      <div className="user-page not-authenticated">
        <p>このページを表示するにはログインが必要です。</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="user-page loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-page error">
        <p className="error-message">{error || 'ユーザーが見つかりません。'}</p>
        <button onClick={() => navigate(-1)}>戻る</button>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>{user.name}</h1>
      </div>

      <UserFollowTabs user={user} activeTab="followers" />

      {followers.length === 0 ? (
        <p className="empty-message">フォロワーはいません。</p>
      ) : (
        <ul className="user-list">
          {followers.map(follower => (
            <li key={follower.id} className="user-item">
              <button
                className="user-link"
                onClick={() => navigate(`/user/${follower.id}`)}
              >
                <div className="user-avatar">{follower.name.charAt(0)}</div>
                <div className="user-info">
                  <h3 className="user-name">{follower.name}</h3>
                  <p className="user-email">{follower.email}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserFollowersPage;