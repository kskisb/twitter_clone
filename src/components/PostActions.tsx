import { useState } from 'react';
import { deletePost } from '../api/posts';
import EditPostModal from './EditPostModal';
import type { Post } from '../types/post';

interface PostActionsProps {
  post: Post;
  onEditSuccess?: (post: Post) => void;
  onDeleteSuccess?: () => void;
}

const PostActions = ({ post, onEditSuccess, onDeleteSuccess } : PostActionsProps) => {
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
      onEditSuccess(updatedPost);
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
        <svg viewBox="0 0 24 24" width="18" height="18">
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
            <button className="dropdown-item edit" onClick={handleEdit}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <g>
                  <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z" />
                </g>
              </svg>
              編集する
            </button>
            <button className="dropdown-item delete" onClick={handleDelete}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <g>
                  <path d="M20.746 5.236h-3.75V4.25c0-1.24-1.01-2.25-2.25-2.25h-5.5c-1.24 0-2.25 1.01-2.25 2.25v.986h-3.75c-.414 0-.75.336-.75.75s.336.75.75.75h.368l1.583 13.262c.216 1.193 1.31 2.027 2.658 2.027h8.282c1.35 0 2.442-.834 2.664-2.072l1.577-13.217h.368c.414 0 .75-.336.75-.75s-.335-.75-.75-.75zM8.496 4.25c0-.413.337-.75.75-.75h5.5c.413 0 .75.337.75.75v.986h-7V4.25zm8.822 15.48c-.1.55-.664.795-1.18.795H7.854c-.517 0-1.083-.246-1.175-.75L5.126 6.735h13.74L17.32 19.732z" />
                  <path d="M10 17.75c.414 0 .75-.336.75-.75v-7c0-.414-.336-.75-.75-.75s-.75.336-.75.75v7c0 .414.336.75.75.75zm4 0c.414 0 .75-.336.75-.75v-7c0-.414-.336-.75-.75-.75s-.75.336-.75.75v7c0 .414.336.75.75.75z" />
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