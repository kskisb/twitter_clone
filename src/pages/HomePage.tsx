import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllPosts, getFollowingPosts } from '../api/posts';
import type { Post } from '../types/post';
import CreatePostForm from '../components/CreatePostForm';
import CreatePostButton from '../components/CreatePostButton';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PostSkeleton from '../components/PostSkeleton';
import '../styles/HomePage.css';

type TabType = 'all' | 'following';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useContext(AuthContext);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const fetchAllPosts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('投稿の取得に失敗しました:', err);
      setError('投稿の取得中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFollowingPosts = async () => {
    try {
      setIsLoadingFollowing(true);
      setError('');
      const fetchedPosts = await getFollowingPosts();
      setFollowingPosts(fetchedPosts);
    } catch (err) {
      console.error('フォロー中の投稿の取得に失敗しました:', err);
      setError('フォロー中の投稿の取得中にエラーが発生しました。');
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllPosts();
      fetchFollowingPosts();
    }
  }, [isAuthenticated]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handlePostCreated = () => {
    setIsCreatingPost(true);
    fetchAllPosts().finally(() => {
      setIsCreatingPost(false);
    });
    fetchFollowingPosts();
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map(post => {
      if (post.id === updatedPost.id) {
        // 元の投稿のユーザー情報を保持
        return {
          ...updatedPost,
          user: post.user,
          user_id: post.user_id
        };
      }
      return post;
    }));
    setFollowingPosts(followingPosts.map(post => {
      if (post.id === updatedPost.id) {
        // 元の投稿のユーザー情報を保持
        return {
          ...updatedPost,
          user: post.user,
          user_id: post.user_id
        };
      }
      return post;
    }));
  };

  const handlePostDeleted = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
    setFollowingPosts(followingPosts.filter(post => post.id !== postId));
  };

  const handleLikeToggled = (postId: number, liked: boolean) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes_count: liked ? (post.likes_count || 0) + 1 : Math.max(0, (post.likes_count || 0) - 1),
          liked_by_current_user: liked
        };
      }
      return post;
    }));

    setFollowingPosts(followingPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes_count: liked ? (post.likes_count || 0) + 1 : Math.max(0, (post.likes_count || 0) - 1),
          liked_by_current_user: liked
        };
      }
      return post;
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="home-container not-authenticated">
        <h2>ログインが必要です</h2>
        <p>投稿を見るにはログインしてください。</p>
      </div>
    );
  }

  const displayedPosts = activeTab === 'all' ? posts : followingPosts;
  const currentLoading = activeTab === 'all' ? isLoading : isLoadingFollowing;

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
      
      {user && (
        <div className="home-post-form-container">
          <CreatePostForm 
            onPostCreated={handlePostCreated} 
            placeholder="いまどうしてる？" 
          />
        </div>
      )}

      <div className="posts-container">
        {error && <p className="error-message">{error}</p>}
        
        {/* ポスト作成中のローディング表示 */}
        {isCreatingPost && (
          <div className="creating-post-indicator">
            <LoadingSpinner size="small" text="投稿を作成中..." />
          </div>
        )}
        
        {/* 投稿読み込み中のUI改善 */}
        {currentLoading ? (
          <PostSkeleton count={5} />
        ) : (
          <>
            {displayedPosts.length === 0 ? (
              <div className="no-posts">
                {activeTab === 'all' 
                  ? '投稿がありません。最初の投稿をしてみましょう！' 
                  : 'フォロー中のユーザーの投稿がありません。ユーザーをフォローしてみましょう！'}
              </div>
            ) : (
              displayedPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostUpdated={handlePostUpdated}
                  onPostDeleted={handlePostDeleted}
                  onLikeToggled={handleLikeToggled}
                />
              ))
            )}
          </>
        )}
      </div>

      <CreatePostButton onPostCreated={handlePostCreated} />
    </div>
  );
};

export default HomePage;