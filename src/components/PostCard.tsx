import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { ja } from 'date-fns/locale';
import { AuthContext } from '../context/AuthContext';
import PostActions from './PostActions';
import type { Post } from '../types/post';

interface PostCardProps {
  post: Post;
  onPostUpdated?: (post: Post) => void;
  onPostDeleted?: (postId: number) => void;
  isDetail?: boolean;
}

const PostCard = ({ post, onPostUpdated, onPostDeleted, isDetail = false }: PostCardProps) => {
  const { user } = useContext(AuthContext);
  const isOwner = user?.id === post.user_id;

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

  const cardContent = (
    <>
      <div className="post-header" onClick={handleHeaderClick}>
        <div className="post-user-info">
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
        {/* いいねボタン等 */}
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