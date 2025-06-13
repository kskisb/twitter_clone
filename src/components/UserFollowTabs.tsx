import { useNavigate } from 'react-router-dom';
import type { User } from '../types/user';

interface UserFollowTabsProps {
  user: User;
  activeTab: 'following' | 'followers';
}

const UserFollowTabs = ({ user, activeTab }: UserFollowTabsProps) => {
  const navigate = useNavigate();

  return (
    <div className="follow-tabs">
      <button
        className={`follow-tab-button ${activeTab === 'following' ? 'active' : ''}`}
        onClick={() => navigate(`/user/${user.id}/following`)}
      >
        フォロー中
      </button>
      <button
        className={`follow-tab-button ${activeTab === 'followers' ? 'active' : ''}`}
        onClick={() => navigate(`/user/${user.id}/followers`)}
      >
        フォロワー
      </button>
    </div>
  );
};

export default UserFollowTabs;