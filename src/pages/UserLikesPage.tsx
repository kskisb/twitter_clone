import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getLikedPosts } from '../api/likes';
import PostCard from '../components/PostCard';
import UserProfileHeader from '../components/UserProfileHeader';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePosts } from '../hooks/usePosts';
import type { Post } from '../types/post';

const UserLikesPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoading, error, isAuthenticated } = useUserProfile(userId);
  const { posts: likedPosts, setPosts: setLikedPosts, updatePost, deletePost, toggleLike } = usePosts([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (!userId || !isAuthenticated) return;

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
      } finally {
        setIsLoadingLikes(false);
      }
    };

    fetchLikedPosts();
  }, [userId, isAuthenticated, currentUser, setLikedPosts]);

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
      <UserProfileHeader user={user} userId={userId!} activeTab="likes" />

      <div className="user-content">
        {isLoadingLikes ? (
          <p className="loading-likes">いいねした投稿を読み込み中...</p>
        ) : (
          <div className="posts-container">
            {likedPosts.length === 0 ? (
              <p className="no-posts">いいねした投稿はありません。</p>
            ) : (
              likedPosts.map(post => (
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
        )}
      </div>
    </div>
  );
};

export default UserLikesPage;