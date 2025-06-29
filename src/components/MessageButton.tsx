import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createConversation } from '../api/conversations';
import '../styles/MessageButton.css';

interface MessageButtonProps {
  userId: number;
  isOwnProfile: boolean;
}

const MessageButton = ({ userId, isOwnProfile }: MessageButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleMessageClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOwnProfile) return;

    setIsLoading(true);
    try {
      const response = await createConversation(userId);
      navigate(`/messages/${response.conversation_id}`);
    } catch (err) {
      console.error('会話の作成に失敗しました:', err);
      alert('会話の作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  if (isOwnProfile) {
    return null;
  }

  return (
    <button
      className="message-button"
      onClick={handleMessageClick}
      disabled={isLoading}
      aria-label="メッセージを送信"
      type="button"
    >
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path
          d="M19.25 3.018H4.75C3.233 3.018 2 4.252 2 5.77v12.495c0 1.518 1.233 2.753 2.75 2.753h14.5c1.517 0 2.75-1.235 2.75-2.753V5.77c0-1.518-1.233-2.752-2.75-2.752zm-14.5 1.5h14.5c.69 0 1.25.56 1.25 1.25v.714l-8.05 5.367c-.273.18-.626.182-.9-.002L3.5 6.482v-.714c0-.69.56-1.25 1.25-1.25zm14.5 14.998H4.75c-.69 0-1.25-.56-1.25-1.25V8.24l7.24 4.83c.383.256.822.384 1.26.384.44 0 .877-.128 1.26-.383l7.24-4.83v10.022c0 .69-.56 1.25-1.25 1.25z" 
          fill="currentColor"
        />
      </svg>
      <span>メッセージ</span>
    </button>
  );
};

export default MessageButton;