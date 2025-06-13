import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllPosts, getFollowingPosts } from '../api/posts';
import type { Post } from '../types/post';
import CreatePostForm from '../components/CreatePostForm';
import CreatePostButton from '../components/CreatePostButton';
import PostCard from '../components/PostCard';

type TabType = 'all' | 'following';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(true);
  const [error, setError] = useState('');
  const [followingError, setFollowingError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const fetchAllPosts = async () => {
    setIsLoading(true);
    try {
      const postsData = await getAllPosts();
      setPosts(postsData);
      setError('');
    } catch (err) {
      console.error('投稿の取得に失敗しました:', err);
      setError('投稿の取得に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowingPosts = async () => {
    setIsLoadingFollowing(true);
    try {
      const postsData = await getFollowingPosts();
      setFollowingPosts(postsData);
      setFollowingError('');
    } catch (err) {
      console.error('フォロー中の投稿の取得に失敗しました:', err);
      setFollowingError('フォロー中の投稿の取得に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  // 初期ロード時と認証状態変更時に全ての投稿を取得
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllPosts();
    }
  }, [isAuthenticated]);

  // タブが切り替わった時にそのタブの投稿を取得
  useEffect(() => {
    if (!isAuthenticated) return;
    
    if (activeTab === 'following') {
      fetchFollowingPosts();
    }
  }, [activeTab, isAuthenticated]);

  const handlePostCreated = () => {
    fetchAllPosts();
    if (activeTab === 'following') {
      fetchFollowingPosts();
    }
  };

  const handlePostUpdated = (updatedPost: Post) => {
    // 全ての投稿リストを更新
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    
    // フォロー中の投稿リストも更新
    setFollowingPosts(followingPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const handlePostDeleted = (postId: number) => {
    // 全ての投稿リストから削除
    setPosts(posts.filter(p => p.id !== postId));
    
    // フォロー中の投稿リストからも削除
    setFollowingPosts(followingPosts.filter(p => p.id !== postId));
  };

  const handleLikeToggled = (postId: number, liked: boolean) => {
    // いいねの状態を更新する処理
    const updatePostsWithLike = (postsList: Post[]) => {
      return postsList.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes_count: liked ? (post.likes_count || 0) + 1 : Math.max((post.likes_count || 0) - 1, 0),
            liked_by_current_user: liked
          };
        }
        return post;
      });
    };

    // 両方の投稿リストを更新
    setPosts(updatePostsWithLike(posts));
    setFollowingPosts(updatePostsWithLike(followingPosts));
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  if (!isAuthenticated) {
    return (
      <div className="home-container not-authenticated">
        <h2>ログインが必要です</h2>
        <p>投稿を見るにはログインしてください。</p>
      </div>
    );
  }

  // 表示する投稿リストを決定
  const displayedPosts = activeTab === 'all' ? posts : followingPosts;
  const currentError = activeTab === 'all' ? error : followingError;
  const isCurrentlyLoading = activeTab === 'all' ? isLoading : isLoadingFollowing;

  const renderContent = () => {
    if (isCurrentlyLoading && displayedPosts.length === 0) {
      return <div className="loading-container"><p>読み込み中...</p></div>;
    }

    if (currentError && displayedPosts.length === 0) {
      return <p className="error-message">{currentError}</p>;
    }

    if (displayedPosts.length === 0) {
      return <p className="no-posts">
        {activeTab === 'following' ? 'フォロー中のユーザーの投稿はありません。' : '投稿がありません。'}
      </p>;
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
  };

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