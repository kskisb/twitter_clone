import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { followUser, unfollowUser, checkFollowingStatus, getFollowing, getFollowers } from '../api/relationships';
import type { User } from '../types/user';

interface UserProfileHeaderProps {
  user: User;
  userId: string;
  activeTab: 'posts' | 'likes';
}

const UserProfileHeader = ({ user, userId, activeTab }: UserProfileHeaderProps) => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [relationshipId, setRelationshipId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);

  // 現在のユーザーとプロフィールページのユーザーが同じかどうかを確認
  const isOwnProfile = currentUser?.id === parseInt(userId);

  // フォロー状態とフォロー/フォロワー数を取得
  useEffect(() => {
    const fetchUserRelationships = async () => {
      try {
        // フォローしているユーザー一覧を取得し、数をカウント
        const following = await getFollowing(parseInt(userId));
        setFollowingCount(following.length);

        // フォロワー一覧を取得し、数をカウント
        const followers = await getFollowers(parseInt(userId));
        setFollowersCount(followers.length);

        // 自分のプロフィールでない場合、フォロー状態も確認
        if (!isOwnProfile && currentUser) {
          const result = await checkFollowingStatus(parseInt(userId));
          setIsFollowing(result.isFollowing);
          setRelationshipId(result.relationshipId);
        }
      } catch (err) {
        console.error('ユーザー関係の取得に失敗しました:', err);
      }
    };

    if (userId) {
      fetchUserRelationships();
    }
  }, [userId, currentUser, isOwnProfile]);

  // フォローボタンをクリックしたときの処理
  const handleFollowToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      if (isFollowing && relationshipId) {
        await unfollowUser(relationshipId);
        setIsFollowing(false);
        setRelationshipId(undefined);
        setFollowersCount(prev => Math.max(prev - 1, 0)); // フォロワー数を更新
      } else {
        const response = await followUser(parseInt(userId));
        setIsFollowing(true);
        setRelationshipId(response.relationshipId);
        setFollowersCount(prev => prev + 1); // フォロワー数を更新
      }
    } catch (err: any) {
      console.error('フォロー操作に失敗しました:', err);
      setError(err.response?.data?.error || 'フォロー操作に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // プロフィール編集ボタンをクリックしたときの処理
  const handleEditProfile = () => {
    // ここにプロフィール編集のロジックを追加することができます
    alert('プロフィール編集機能は準備中です');
  };

  // フォロー/フォロワー一覧ページへのナビゲーション
  const navigateToFollowingPage = () => {
    navigate(`/user/${userId}/following`);
  };

  const navigateToFollowersPage = () => {
    navigate(`/user/${userId}/followers`);
  };

  return (
    <>
      <div className="user-page-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← 戻る
        </button>
      </div>

      <div className="user-profile">
        <div className="user-avatar">
          {user.name.charAt(0)}
        </div>
        <h1 className="user-name">{user.name}</h1>
        <p className="user-email">{user.email}</p>

        {/* フォロー/フォロワー数の表示 */}
        <div className="user-stats">
          <button 
            className="stat-button" 
            onClick={navigateToFollowingPage}
            aria-label="フォロー一覧を見る"
          >
            <span className="stat-count">{followingCount}</span>
            <span className="stat-label">フォロー中</span>
          </button>
          <button 
            className="stat-button" 
            onClick={navigateToFollowersPage}
            aria-label="フォロワー一覧を見る"
          >
            <span className="stat-count">{followersCount}</span>
            <span className="stat-label">フォロワー</span>
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* 自分のプロフィールの場合は編集ボタン、他のユーザーの場合はフォローボタンを表示 */}
        {isOwnProfile ? (
          <button
            className="edit-profile-button"
            onClick={handleEditProfile}
          >
            プロフィールを編集
          </button>
        ) : (
          <button
            className={`follow-button ${isFollowing ? 'following' : ''}`}
            onClick={handleFollowToggle}
            disabled={isLoading}
          >
            {isLoading
              ? '処理中...'
              : isFollowing
                ? 'フォロー中'
                : 'フォローする'}
          </button>
        )}
      </div>

      <div className="user-tabs">
        <button
          className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => navigate(`/user/${userId}`)}
        >
          投稿
        </button>
        <button
          className={`tab-button ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => navigate(`/user/${userId}/likes`)}
        >
          いいね
        </button>
      </div>
    </>
  );
};

export default UserProfileHeader;