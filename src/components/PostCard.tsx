import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { ja } from 'date-fns/locale';
import { AuthContext } from '../context/AuthContext';
import PostActions from './PostActions';
import LikeButton from './LikeButton';
import { likePost, unlikePost } from '../api/likes';
import type { Post } from '../types/post';

interface PostCardProps {
  post: Post;
  onPostUpdated?: (post: Post) => void;
  onPostDeleted?: (postId: number) => void;
  onLikeToggled?: (postId: number, liked: boolean) => void;
  isDetail?: boolean;
}

const PostCard = ({ post, onPostUpdated, onPostDeleted, onLikeToggled, isDetail = false }: PostCardProps) => {
  const { user } = useContext(AuthContext);
  const isOwner = user?.id === (post.user?.id || post.user_id);
  const navigate = useNavigate();

  const handleEditSuccess = (updatedPost: Post) => {
    if (onPostUpdated) {
      onPostUpdated(updatedPost);
    }
  }

  const handleDeleteSuccess = () => {
    if (onPostDeleted) {
      onPostDeleted(post.id);
    }
  }

  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (post.user?.id) {
      navigate(`/user/${post.user.id}`);
    }
  };

  const handleLike = async () => {
    try {
      await likePost(post.id);
      if (onLikeToggled) {
        onLikeToggled(post.id, true);
      }
    } catch (error) {
      console.error('いいねエラー:', error);
    }
  };

  const handleUnlike = async () => {
    try {
      await unlikePost(post.id);
      if (onLikeToggled) {
        onLikeToggled(post.id, false);
      }
    } catch (error) {
      console.error('いいね解除エラー:', error);
    }
  };

  const cardContent = (
    <>
      <div className="post-header" onClick={handleHeaderClick}>
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
            isDetail={isDetail}
          />
        )}
      </div>

      <div className="post-content">{post.content}</div>

      <div className="post-time">
        {formatDistance(new Date(post.created_at), new Date(), {
          addSuffix: true,
          locale: ja
        })}
      </div>

      <div className="post-actions-bar">
        <LikeButton
          likesCount={post.likes_count || 0}
          isLiked={post.liked_by_current_user || false}
          onLike={handleLike}
          onUnlike={handleUnlike}
        />
      </div>
    </>
  );

  if (isDetail) {
    return <div className={`post-card ${isDetail ? 'detail' : ''}`}>{cardContent}</div>;
  }

  return (
    <Link to={`/post/${post.id}`} className={`post-card ${isDetail ? 'detail' : ''}`}>
      {cardContent}
    </Link>
  );
};

export default PostCard;