import { useState, useContext } from 'react';
import { createPost } from '../api/posts';
import { AuthContext } from '../context/AuthContext';

interface CreatePostFormProps {
  onPostCreated: () => void;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

const CreatePostForm = ({
  onPostCreated,
  placeholder = "いまどうしてる？",
  buttonText = "投稿する",
  className = "",
}: CreatePostFormProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await createPost(content);
      setContent('');
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err: any) {
      console.error('投稿エラー: ', err);
      setError('投稿に失敗しました。もう一度お試してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`create-post-form ${className}`}>
      {user && (
        <div className="create-post-avatar">
          <div className="avatar">{user.name.charAt(0)}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-post-content">
        {error && <div className="error-message">{error}</div>}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          maxLength={280}
          rows={3}
          disabled={isSubmitting}
          className="create-post-textarea"
        />

        <div className="create-post-actions">
          <div className={`character-count ${
            content.length > 260 ? 'danger' : content.length > 220 ? 'warning' : ''
          }`}>
            {content.length > 0 && `${content.length}/280`}
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="post-button"
          >
            {isSubmitting ? '投稿中...' : buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;