import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getConversations } from '../api/conversations';
import type { Conversation } from '../types/conversation';
import '../styles/Conversations.css';

const ConversationsPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const conversationsData = await getConversations();
        setConversations(conversationsData);
      } catch (err) {
        console.error('会話の取得に失敗しました:', err);
        setError('会話の取得に失敗しました。後でもう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [isAuthenticated]);
  
  const handleUserClick = (e: React.MouseEvent, userId: number) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/user/${userId}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="conversations-page not-authenticated">
        <h2>ログインが必要です</h2>
        <p>メッセージを見るにはログインしてください。</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="conversations-page loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversations-page error">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // 今日の場合は時間を表示
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      // 1週間以内は曜日を表示
      return date.toLocaleDateString('ja-JP', { weekday: 'short' });
    } else {
      // それ以外は日付を表示
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="conversations-page">
      <div className="conversations-header">
        <h1>メッセージ</h1>
      </div>

      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div className="no-conversations">
            <p>メッセージがありません。</p>
            <p>他のユーザーのプロフィールからメッセージを送ってみましょう。</p>
          </div>
        ) : (
          conversations.map(conversation => (
            <Link 
              to={`/messages/${conversation.id}`} 
              key={conversation.id} 
              className="conversation-item"
            >
              <div 
                className="conversation-avatar" 
                onClick={(e) => handleUserClick(e, conversation.other_user.id)}
              >
                {conversation.other_user.name.charAt(0)}
              </div>
              <div className="conversation-content">
                <div className="conversation-header">
                  <span className="other-user-name">{conversation.other_user.name}</span>
                  <span className="last-updated">{formatLastUpdated(conversation.updated_at)}</span>
                </div>
                <div className="conversation-last-message">
                  {conversation.last_message || "メッセージがありません"}
                </div>
              </div>
              {conversation.unread_count > 0 && (
                <div className="unread-badge">{conversation.unread_count}</div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;