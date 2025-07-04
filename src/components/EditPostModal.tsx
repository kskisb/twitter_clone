import { useState, useEffect } from 'react';
import { updatePost } from '../api/posts';
import type { Post } from '../types/post';
import '../styles/Modal.css';

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
  onEditSuccess: (post: Post) => void;
}

const EditPostModal = ({ post, onClose, onEditSuccess }: EditPostModalProps) => {
  const [content, setContent] = useState(post.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;
    setIsSubmitting(true);
    setError('');

    try {
      const updatedPost = await updatePost(post.id, content);
      // 元の投稿のユーザー情報を保持
      const postWithUser = {
        ...updatedPost,
        user: post.user,
        user_id: post.user_id
      };
      onEditSuccess(postWithUser);
    } catch (err: any) {
      console.error('更新エラー:', err);
      setError('投稿の更新に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">投稿を編集</h2>

        <form onSubmit={handleSubmit} className="edit-post-form">
          {error && <div className="error-message">{error}</div>}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
            rows={5}
            disabled={isSubmitting}
            className="edit-post-textarea"
            autoFocus
          />

          <div className="edit-form-actions">
            <div className="character-count">
              {content.length}/280
            </div>

            <button
              type="submit"
              disabled={!content.trim() || isSubmitting || content === post.content}
              className="post-button"
            >
              {isSubmitting ? '更新中...' : '更新'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;