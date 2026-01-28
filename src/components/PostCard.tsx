import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { ja } from 'date-fns/locale';
import { AuthContext } from '../context/AuthContext';
import PostActions from './PostActions';
import LikeButton from './LikeButton';
import RepostButton from './RepostButton';
import { likePost, unlikePost } from '../api/likes';
import type { Post } from '../types/post';

interface PostCardProps {
  post: Post;
  onPostUpdated?: (post: Post) => void;
  onPostDeleted?: (postId: number) => void;
  onLikeToggled?: (postId: number, liked: boolean) => void;
  onRepostToggled?: (postId: number, reposted: boolean) => void;
  isDetail?: boolean;
  repostedBy?: {
    id: number;
    name: string;
  };
}

const PostCard = ({
  post,
  onPostUpdated,
  onPostDeleted,
  onLikeToggled,
  onRepostToggled,
  isDetail = false,
  repostedBy
}: PostCardProps) => {
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

  const handleRepostChange = (reposted: boolean, count: number) => {
    if (onRepostToggled) {
      onRepostToggled(post.id, reposted);
    }
  };

  const cardContent = (
    <>
      {repostedBy && (
        <div className="repost-indicator">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#00ba7c">
            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
          </svg>
          <span className="repost-text">{repostedBy.name}がリポストしました</span>
        </div>
      )}

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
        <RepostButton
          postId={post.id}
          initialReposted={post.reposted_by_current_user || false}
          initialCount={post.reposts_count || 0}
          onRepostChange={handleRepostChange}
        />
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