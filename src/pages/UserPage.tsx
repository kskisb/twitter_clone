import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserDetail } from '../api/users';
import { getUserPosts } from '../api/posts';
import type { User } from '../types/user';
import type { Post } from '../types/post';
import PostCard from '../components/PostCard';

const UserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const fetchUserData = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const userData = await getUserDetail(parseInt(userId));
      setUser(userData);

      const userPosts = await getUserPosts(parseInt(userId));
      setPosts(userPosts);
    } catch (err) {
      console.error('ユーザー情報の取得に失敗しました:', err);
      setError('ユーザー情報の取得に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchUserData();
    }
  }, [isAuthenticated, userId])

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  }

  const handlePostDeleted = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
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

      <div className="user-content">
        <h2 className="section-title">投稿</h2>
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
      </div>
    </div>
  );
};

export default UserPage;