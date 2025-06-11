import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserPosts } from '../api/posts';
import PostCard from '../components/PostCard';
import UserProfileHeader from '../components/UserProfileHeader';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePosts } from '../hooks/usePosts';

const UserPostsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoading, error, isAuthenticated } = useUserProfile(userId);
  const { posts, setPosts, updatePost, deletePost, toggleLike } = usePosts([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId || !isAuthenticated) return;

      try {
        const userPosts = await getUserPosts(parseInt(userId));
        setPosts(userPosts);
      } catch (err) {
        console.error('投稿の取得に失敗しました:', err);
      }
    };

    fetchPosts();
  }, [userId, isAuthenticated, setPosts]);

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
      <UserProfileHeader user={user} userId={userId!} activeTab="posts" />

      <div className="user-content">
        <div className="posts-container">
          {posts.length === 0 ? (
            <p className="no-posts">投稿がありません。</p>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={updatePost}
                onPostDeleted={deletePost}
                onLikeToggled={toggleLike}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPostsPage;