import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { checkFollowingStatus, followUser, unfollowUser } from '../api/relationships';
import { getFollowing, getFollowers } from '../api/relationships';
import MessageButton from './MessageButton';
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
        // フォロー/フォロワー数の取得
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

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      if (isFollowing && relationshipId) {
        await unfollowUser(relationshipId);
        setIsFollowing(false);
        setRelationshipId(undefined);
        setFollowersCount(prev => Math.max(prev - 1, 0));
      } else {
        const response = await followUser(parseInt(userId));
        setIsFollowing(true);
        setRelationshipId(response.relationshipId);
        setFollowersCount(prev => prev + 1);
      }
    } catch (err: any) {
      console.error('フォロー操作に失敗しました:', err);
      setError(err.response?.data?.error || 'フォロー操作に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-profile-container">
      {/* ヘッダー部分 */}
      <div className="user-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 戻る
        </button>
        <div className="user-title">
          <h1>{user.name}</h1>
        </div>
      </div>

      {/* プロフィール情報部分 */}
      <div className="user-profile">
        <div className="profile-banner"></div>

        <div className="profile-main">
          <div className="profile-avatar-container">
            <div className="profile-avatar">{user.name.charAt(0)}</div>
          </div>

          <div className="profile-actions">
            {isOwnProfile ? (
              <button className="edit-profile-button">プロフィール編集</button>
            ) : (
              <div className="user-action-buttons">
                <MessageButton userId={parseInt(userId)} isOwnProfile={isOwnProfile} />
                <button
                  className={`follow-button ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollowToggle}
                  disabled={isLoading}
                >
                  <span>{isFollowing ? 'フォロー中' : 'フォローする'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="profile-info">
            <h2 className="profile-name">{user.name}</h2>

            <div className="profile-stats">
              <div className="stat-item" onClick={() => navigate(`/user/${userId}/following`)}>
                <span className="stat-value">{followingCount}</span>
                <span className="stat-label">フォロー中</span>
              </div>
              <div className="stat-item" onClick={() => navigate(`/user/${userId}/followers`)}>
                <span className="stat-value">{followersCount}</span>
                <span className="stat-label">フォロワー</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* タブ部分 */}
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
    </div>
  );
};

export default UserProfileHeader;