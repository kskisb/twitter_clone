import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllPosts, getFollowingPosts } from '../api/posts';
import type { Post, PostItem } from '../types/post';
import CreatePostForm from '../components/CreatePostForm';
import CreatePostButton from '../components/CreatePostButton';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PostSkeleton from '../components/PostSkeleton';
import '../styles/HomePage.css';

type TabType = 'all' | 'following';

const HomePage = () => {
  const [postItems, setPostItems] = useState<PostItem[]>([]);
  const [followingPostItems, setFollowingPostItems] = useState<PostItem[]>([]);
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
      const fetchedPostItems = await getAllPosts();
      setPostItems(fetchedPostItems);
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
      const fetchedPostItems = await getFollowingPosts();
      setFollowingPostItems(fetchedPostItems);
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
    const updateItems = (items: PostItem[]) => items.map(item => {
      if (item.data.id === updatedPost.id) {
        return {
          ...item,
          data: {
            ...updatedPost,
            user: item.data.user,
            user_id: item.data.user_id
          }
        };
      }
      return item;
    });

    setPostItems(updateItems(postItems));
    setFollowingPostItems(updateItems(followingPostItems));
  };

  const handlePostDeleted = (postId: number) => {
    setPostItems(postItems.filter(item => item.data.id !== postId));
    setFollowingPostItems(followingPostItems.filter(item => item.data.id !== postId));
  };

  const handleLikeToggled = (postId: number, liked: boolean) => {
    const updateItems = (items: PostItem[]) => items.map(item => {
      if (item.data.id === postId) {
        return {
          ...item,
          data: {
            ...item.data,
            likes_count: liked ? (item.data.likes_count || 0) + 1 : Math.max(0, (item.data.likes_count || 0) - 1),
            liked_by_current_user: liked
          }
        };
      }
      return item;
    });

    setPostItems(updateItems(postItems));
    setFollowingPostItems(updateItems(followingPostItems));
  };

  const handleRepostToggled = (postId: number, reposted: boolean) => {
    const updateItems = (items: PostItem[]) => items.map(item => {
      if (item.data.id === postId) {
        return {
          ...item,
          data: {
            ...item.data,
            reposts_count: reposted ? (item.data.reposts_count || 0) + 1 : Math.max(0, (item.data.reposts_count || 0) - 1),
            reposted_by_current_user: reposted
          }
        };
      }
      return item;
    });

    setPostItems(updateItems(postItems));
    setFollowingPostItems(updateItems(followingPostItems));
    
    // リポストした場合はリフレッシュ
    if (reposted) {
      fetchAllPosts();
      fetchFollowingPosts();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="home-container not-authenticated">
        <h2>ログインが必要です</h2>
        <p>投稿を見るにはログインしてください。</p>
      </div>
    );
  }

  const displayedItems = activeTab === 'all' ? postItems : followingPostItems;
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
        
        {isCreatingPost && (
          <div className="creating-post-indicator">
            <LoadingSpinner size="small" text="投稿を作成中..." />
          </div>
        )}
        
        {currentLoading ? (
          <PostSkeleton count={5} />
        ) : (
          <>
            {displayedItems.length === 0 ? (
              <div className="no-posts">
                {activeTab === 'all' 
                  ? '投稿がありません。最初の投稿をしてみましょう！' 
                  : 'フォロー中のユーザーの投稿がありません。ユーザーをフォローしてみましょう！'}
              </div>
            ) : (
              displayedItems.map((item, index) => (
                <PostCard
                  key={`${item.type}-${item.data.id}-${index}`}
                  post={item.data}
                  onPostUpdated={handlePostUpdated}
                  onPostDeleted={handlePostDeleted}
                  onLikeToggled={handleLikeToggled}
                  onRepostToggled={handleRepostToggled}
                  repostedBy={item.type === 'repost' ? item.reposted_by : undefined}
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