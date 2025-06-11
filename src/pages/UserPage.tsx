import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserDetail } from '../api/users';
import { getUserPosts } from '../api/posts';
import { getLikedPosts } from '../api/likes';
import type { User } from '../types/user';
import type { Post } from '../types/post';
import PostCard from '../components/PostCard';

// タブの種類を定義
type TabType = 'posts' | 'likes';

const UserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  // URLからタブを取得し、なければデフォルト値を使用
  const [activeTab, setActiveTab] = useState<TabType>(
    (searchParams.get('tab') as TabType) || 'posts'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useContext(AuthContext);

  // ユーザー情報と投稿を取得
  const fetchUserData = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // ユーザー情報を取得
      const userData = await getUserDetail(parseInt(userId));
      setUser(userData);

      // ユーザーの投稿を取得
      const userPosts = await getUserPosts(parseInt(userId));
      setPosts(userPosts);
    } catch (err) {
      console.error('ユーザー情報の取得に失敗しました:', err);
      setError('ユーザー情報の取得に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // いいねした投稿を取得
  const fetchLikedPosts = async () => {
    if (!userId) return;

    setIsLoadingLikes(true);
    try {
      let liked = await getLikedPosts(parseInt(userId));

      // 現在のユーザーとプロフィールページのユーザーが同じ場合のみ、いいね済みとして扱う
      const isCurrentUserProfile = currentUser?.id === parseInt(userId);

      liked = liked.map((post: Post) => ({
        ...post,
        // 自分自身のプロフィールを見ている場合のみ、いいねを強制的にtrueにする
        liked_by_current_user: isCurrentUserProfile ? true : post.liked_by_current_user
      }));

      setLikedPosts(liked);
    } catch (err) {
      console.error('いいねした投稿の取得に失敗しました:', err);
      setLikedPosts([]);
    } finally {
      setIsLoadingLikes(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchUserData();
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    // タブに応じたコンテンツの読み込み
    if (activeTab === 'likes' && likedPosts.length === 0 && !isLoadingLikes) {
      fetchLikedPosts();
    }

    // URLのクエリパラメータを更新
    setSearchParams({ tab: activeTab });
  }, [activeTab, userId]);

  // ページロード時にURLからタブを復元
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'likes' || tabParam === 'posts') {
      setActiveTab(tabParam as TabType);
    }
  }, []);

  // タブ切り替え処理
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // URLのクエリパラメータを更新
    setSearchParams({ tab });

    if (tab === 'likes' && likedPosts.length === 0) {
      fetchLikedPosts();
    }
  };

  const handlePostUpdated = (updatedPost: Post) => {
    if (activeTab === 'posts') {
      setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    } else {
      setLikedPosts(likedPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
    }
  };

  const handlePostDeleted = (postId: number) => {
    if (activeTab === 'posts') {
      setPosts(posts.filter(p => p.id !== postId));
    } else {
      setLikedPosts(likedPosts.filter(p => p.id !== postId));
    }
  };

  const handleLikeToggled = (postId: number, liked: boolean) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes_count: liked ? post.likes_count + 1 : Math.max(post.likes_count - 1, 0),
          liked_by_current_user: liked
        };
      }
      return post;
    }));

    if (activeTab === 'likes') {
      if (liked) {
        setLikedPosts(likedPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes_count: post.likes_count + 1,
              liked_by_current_user: true
            };
          }
          return post;
        }));
      } else {
        setLikedPosts(likedPosts.filter(post => post.id !== postId));
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="user-page not-authenticated">
        <h2>ログインが必要です</h2>
        <p>ユーザー情報を見るにはログインしてください。</p>
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
      </div>
    );
  }

  // 表示するコンテンツを決定
  const renderContent = () => {
    if (activeTab === 'posts') {
      return (
        <div className="posts-container">
          {posts.length === 0 ? (
            <p className="no-posts">投稿がありません。</p>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
                onLikeToggled={handleLikeToggled}
              />
            ))
          )}
        </div>
      );
    } else {
      if (isLoadingLikes) {
        return <p className="loading-likes">いいねした投稿を読み込み中...</p>;
      }

      return (
        <div className="posts-container">
          {likedPosts.length === 0 ? (
            <p className="no-posts">いいねした投稿はありません。</p>
          ) : (
            likedPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
                onLikeToggled={handleLikeToggled}
              />
            ))
          )}
        </div>
      );
    }
  };

  return (
    <div className="user-page">
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
          onClick={() => handleTabChange('posts')}
        >
          投稿
        </button>
        <button
          className={`tab-button ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => handleTabChange('likes')}
        >
          いいね
        </button>
      </div>

      <div className="user-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserPage;