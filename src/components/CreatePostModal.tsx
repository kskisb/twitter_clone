import { useEffect } from 'react';
import CreatePostForm from './CreatePostForm';

interface CreatePostModalProps {
  onClose: () => void;
}

const CreatePostModal = ({ onClose }: CreatePostModalProps) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  const handlePostCreated = () => {
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