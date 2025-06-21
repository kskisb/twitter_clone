import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { checkFollowingStatus, followUser, unfollowUser } from '../api/relationships';
import { getFollowing, getFollowers } from '../api/relationships';
import MessageButton from './MessageButton'; // 追加
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
  const [_error, setError] = useState('');
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
        const followers = await getFollowers(parseInt(userId));
        setFollowingCount(following.length);
        setFollowersCount(followers.length);

        // 自分のプロフィールでない場合はフォロー状態を確認
        if (!isOwnProfile && currentUser) {
          const status = await checkFollowingStatus(parseInt(userId));
          setIsFollowing(status.isFollowing);
          setRelationshipId(status.relationshipId);
        }
      } catch (err) {
        console.error('フォロー情報の取得に失敗しました:', err);
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
        // フォロワー数を減らす
        setFollowersCount(prev => Math.max(prev - 1, 0));
      } else {
        const response = await followUser(parseInt(userId));
        setIsFollowing(true);
        setRelationshipId(response.relationshipId);
        // フォロワー数を増やす
        setFollowersCount(prev => prev + 1);
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
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <div className="user-title">
          <h1>{user.name}</h1>
        </div>
      </div>

      <div className="user-profile">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0)}
          </div>
          <div className="profile-actions">
            {isOwnProfile ? (
              <button className="edit-profile-button" onClick={handleEditProfile}>
                プロフィール編集
              </button>
            ) : (
              <div className="user-action-buttons">
                <MessageButton userId={parseInt(userId)} isOwnProfile={isOwnProfile} />
                <button
                  className={`follow-button ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollowToggle}
                  disabled={isLoading}
                >
                  {isFollowing ? 'フォロー中' : 'フォローする'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-info">
          <h2 className="profile-name">{user.name}</h2>
          <div className="profile-stats">
            <div className="stat-item" onClick={navigateToFollowingPage}>
              <span className="stat-value">{followingCount}</span>
              <span className="stat-label">フォロー中</span>
            </div>
            <div className="stat-item" onClick={navigateToFollowersPage}>
              <span className="stat-value">{followersCount}</span>
              <span className="stat-label">フォロワー</span>
            </div>
          </div>
        </div>
      </div>

      <div className="user-tabs">
        <Link
          to={`/user/${userId}`}
          className={`user-tab ${activeTab === 'posts' ? 'active' : ''}`}
        >
          投稿
        </Link>
        <Link
          to={`/user/${userId}/likes`}
          className={`user-tab ${activeTab === 'likes' ? 'active' : ''}`}
        >
          いいね
        </Link>
      </div>
    </>
  );
};

export default UserProfileHeader;