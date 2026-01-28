import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { AuthContext } from '../context/AuthContext';
import { getPost } from '../api/posts';
import { likePost, unlikePost } from '../api/likes';
import PostActions from '../components/PostActions';
import LikeButton from '../components/LikeButton';
import RepostButton from '../components/RepostButton';
import type { Post } from '../types/post';

const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchPost = async () => {
    if (!postId) return;

    setIsLoading(true);
    try {
      const postData = await getPost(parseInt(postId));
      setPost(postData);
    } catch (err) {
      console.error('投稿の取得に失敗しました: ', err);
      setError('投稿の取得に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const handleEditSuccess = (updatedPost: Post) => {
    // 元の投稿のユーザー情報を保持
    const postWithUser = {
      ...updatedPost,
      user: post?.user,
      user_id: post?.user_id
    };
    setPost(postWithUser);
  }

  const handleDeleteSuccess = () => {
    navigate('/home');
  };

  const handleLikeToggled = (_postId: number, liked: boolean) => {
    if (!post) return;

    setPost({
      ...post,
      likes_count: liked ? post.likes_count + 1 : Math.max(post.likes_count - 1, 0),
      liked_by_current_user: liked
    });
  };

  const handleRepostToggled = (reposted: boolean, count: number) => {
    if (!post) return;

    setPost({
      ...post,
      reposts_count: count,
      reposted_by_current_user: reposted
    });
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      await likePost(post.id);
      handleLikeToggled(post.id, true);
    } catch (error) {
      console.error('いいねエラー:', error);
    }
  };

  const handleUnlike = async () => {
    if (!post) return;

    try {
      await unlikePost(post.id);
      handleLikeToggled(post.id, false);
    } catch (error) {
      console.error('いいね解除エラー:', error);
    }
  };

  const handleUserClick = () => {
    if (post?.user?.id) {
      navigate(`/user/${post.user.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="post-detail-loading">
        <p>読み込み中...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="post-detail-error">
        <p className="error-message">{error || '投稿が見つかりません。'}</p>
      </div>
    );
  }

  const isOwner = user?.id === (post.user?.id || post.user_id);

  return (
    <div className="post-detail-container">
      <div className="post-detail-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← 戻る
        </button>
        <h1 className="page-title">投稿</h1>
      </div>

      <div className="post-detail-card">
        <div className="post-header">
          <div className="post-user-info" onClick={handleUserClick}>
            <div className="avatar">
              {post.user?.name.charAt(0) || '?'}
            </div>
            <div className="user-details">
              <span className="user-name">{post.user?.name || '不明なユーザー'}</span>
            </div>
          </div>

          {isOwner && (
            <PostActions
              post={post}
              onEditSuccess={handleEditSuccess}
              onDeleteSuccess={handleDeleteSuccess}
              isDetail={true}
            />
          )}
        </div>

        <div className="post-detail-content">
          {post.content}
        </div>

        <div className="post-detail-time">
          {format(new Date(post.created_at), 'yyyy年M月d日 HH:mm', { locale: ja })}
        </div>

        <div className="post-detail-actions">
          <RepostButton
            postId={post.id}
            initialReposted={post.reposted_by_current_user || false}
            initialCount={post.reposts_count || 0}
            onRepostChange={handleRepostToggled}
          />
          <LikeButton
            likesCount={post.likes_count || 0}
            isLiked={post.liked_by_current_user || false}
            onLike={handleLike}
            onUnlike={handleUnlike}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;