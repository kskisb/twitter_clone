import { useState } from 'react';
import { deletePost } from '../api/posts';
import EditPostModal from './EditPostModal';
import type { Post } from '../types/post';

interface PostActionsProps {
  post: Post;
  onEditSuccess?: (post: Post) => void;
  onDeleteSuccess?: () => void;
  isDetail?: boolean;
}

const PostActions = ({ post, onEditSuccess, onDeleteSuccess, isDetail = false } : PostActionsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('本当にこの投稿を削除しますか？')) {
      setIsDropdownOpen(false);
      setIsDeleting(true);

      try {
        await deletePost(post.id);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } catch (err) {
        console.error('削除エラー:', err);
        setError('投稿の削除に失敗しました。');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditSuccess = (updatedPost: Post) => {
    setIsEditModalOpen(false);
    if (onEditSuccess) {
      // 元の投稿のユーザー情報を保持して更新されたPostに追加
      const postWithUser = {
        ...updatedPost,
        user: post.user,
        user_id: post.user_id
      };
      onEditSuccess(postWithUser);
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(false);
  };

  return (
    <div className="post-actions-container" onClick={(e) => e.stopPropagation()}>
      {error && <div className="error-message">{error}</div>}

      <button className="post-menu-button" onClick={toggleDropdown}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <g>
            <circle cx="5" cy="12" r="2"></circle>
            <circle cx="12" cy="12" r="2"></circle>
            <circle cx="19" cy="12" r="2"></circle>
          </g>
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          <div className="dropdown-overlay" onClick={handleClickOutside}></div>
          <div className="post-dropdown-menu">
            { isDetail && (
              <button className="dropdown-item edit" onClick={handleEdit}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <g>
                    <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"/>
                  </g>
                </svg>
                編集する
              </button>
            )}
            <button className="dropdown-item delete" onClick={handleDelete}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <g>
                  <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-2.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
                </g>
              </svg>
              削除する
            </button>
          </div>
        </>
      )}

      {isEditModalOpen && (
        <EditPostModal
          post={post}
          onClose={() => setIsEditModalOpen(false)}
          onEditSuccess={handleEditSuccess}
        />
      )}

      {isDeleting && <div className="loading-overlay">削除中...</div>}
    </div>
  );
};

export default PostActions;