import { useEffect } from 'react';
import CreatePostForm from './CreatePostForm';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal = ({ onClose, onPostCreated }: CreatePostModalProps) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  const handlePostCreated = () => {
    onPostCreated();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <CreatePostForm
          onPostCreated={handlePostCreated}
          placeholder="いまどうしてる？"
          buttonText="投稿"
          className='modal-post-form'
        />
      </div>
    </div>
  );
};

export default CreatePostModal;