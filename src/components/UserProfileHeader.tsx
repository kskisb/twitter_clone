import { useNavigate } from 'react-router-dom';
import type { User } from '../types/user';

interface UserProfileHeaderProps {
  user: User;
  userId: string;
  activeTab: 'posts' | 'likes';
}

const UserProfileHeader = ({ user, userId, activeTab }: UserProfileHeaderProps) => {
  const navigate = useNavigate();

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