import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllPosts } from '../api/posts';
import type { Post } from '../types/post';
import CreatePostForm from '../components/CreatePostForm';
import CreatePostButton from '../components/CreatePostButton';
import PostCard from '../components/PostCard';

type TabType = 'all' | 'following';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const postsData = await getAllPosts();
      setPosts(postsData);
    } catch (err) {
      console.error('投稿の取得に失敗しました:', err);
      setError('投稿の取得に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  const handlePostDeleted = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handleLikeToggled = (postId: number, liked: boolean) => {
    // いいねの状態を更新する処理
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  }

  if (!isAuthenticated) {
    return (
      <div className="home-container not-authenticated">
        <h2>ログインが必要です</h2>
        <p>投稿を見るにはログインしてください。</p>
      </div>
    );
  }

  const displayedPosts = activeTab === 'all' ? posts : []

  const renderContent = () => {
    if (isLoading && displayedPosts.length === 0) {
      return <div className="loading-container"><p>読み込み中...</p></div>;
    }

    if (error && displayedPosts.length === 0) {
      return <p className="error-message">{error}</p>;
    }

    if (activeTab === 'following' && displayedPosts.length === 0) {
      return <p className="no-posts">フォロー中のユーザーの投稿はありません。</p>;
    }

    if (displayedPosts.length === 0) {
      return <p className="no-posts">投稿がありません。</p>;
    }

    return displayedPosts.map(post => (
      <PostCard
        key={post.id}
        post={post}
        onPostUpdated={handlePostUpdated}
        onPostDeleted={handlePostDeleted}
        onLikeToggled={handleLikeToggled}
      />
    ));
  }

  return (
    <div className="home-container">
      <h1 className="page-title">ホーム</h1>

      <div className="home-tabs">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTabChange('all')}
        >
          すべての投稿
        </button>
        <button
          className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => handleTabChange('following')}
        >
          フォロー中
        </button>
      </div>

      <div className="home-post-form-container">
        <CreatePostForm onPostCreated={handlePostCreated} />
      </div>

      <div className="posts-container">
        {renderContent()}
      </div>

      <CreatePostButton onPostCreated={handlePostCreated} />
    </div>
  );
};

export default HomePage;