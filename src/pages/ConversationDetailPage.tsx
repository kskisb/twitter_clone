import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getConversation, sendMessage } from '../api/conversations';
import { cable } from '../utils/cable';
import type { ConversationDetail, Message } from '../types/conversation';
import '../styles/ConversationDetail.css';

const ConversationDetailPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const subscription = useRef<any>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationId || !isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const conversationData = await getConversation(parseInt(conversationId));
        setConversation(conversationData);
      } catch (err) {
        console.error('会話の取得に失敗しました:', err);
        setError('会話の取得に失敗しました。後でもう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId, isAuthenticated]);

  // WebSocketの購読設定
  useEffect(() => {
    if (!conversationId || !isAuthenticated) return;

    // ActionCableを使って会話のチャネルをサブスクライブ
    subscription.current = cable.subscriptions.create(
      { 
        channel: 'ConversationChannel', 
        conversation_id: conversationId 
      },
      {
        connected() {
          console.log('Connected to ConversationChannel');
        },
        disconnected() {
          console.log('Disconnected from ConversationChannel');
        },
        received(data: Message) {
          // 新しいメッセージを受信したら会話オブジェクトを更新
          setConversation(prev => {
            if (!prev) return null;
            
            // 自分が送信したメッセージは既に追加済みの場合があるので重複確認
            if (prev.messages.some(m => m.id === data.id)) {
              return prev;
            }
            
            return {
              ...prev,
              messages: [...prev.messages, data]
            };
          });
        }
      }
    );

    // クリーンアップ関数
    return () => {
      if (subscription.current) {
        subscription.current.unsubscribe();
      }
    };
  }, [conversationId, isAuthenticated]);

  // メッセージが追加されたらスクロールを一番下に移動
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !conversationId || !user) return;
    
    setIsSending(true);
    try {
      const sentMessage = await sendMessage(parseInt(conversationId), newMessage);
      
      // 楽観的更新
      setConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, sentMessage]
        };
      });
      
      setNewMessage('');
    } catch (err) {
      console.error('メッセージの送信に失敗しました:', err);
      setError('メッセージの送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated) {
    return (
      <div className="conversation-detail not-authenticated">
        <h2>ログインが必要です</h2>
        <p>メッセージを見るにはログインしてください。</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="conversation-detail loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="conversation-detail error">
        <p className="error-message">{error || '会話が見つかりません。'}</p>
        <button className="back-button" onClick={() => navigate('/messages')}>
          メッセージ一覧に戻る
        </button>
      </div>
    );
  }

  return (
    <div className="conversation-detail">
      <div className="conversation-detail-header">
        <button className="back-button" onClick={() => navigate('/messages')}>
          ← 戻る
        </button>
        <div className="conversation-with">
          <span className="other-user-name">{conversation.other_user.name}</span>
        </div>
      </div>

      <div className="messages-container">
        {conversation.messages.length === 0 ? (
          <div className="no-messages">
            <p>メッセージがありません。最初のメッセージを送信しましょう。</p>
          </div>
        ) : (
          conversation.messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.user_id === user?.id ? 'outgoing' : 'incoming'}`}
            >
              {message.user_id !== user?.id && (
                <div className="message-avatar">
                  {message.user_name.charAt(0)}
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble">{message.body}</div>
                <div className="message-time">
                  {formatMessageTime(message.created_at)}
                  {message.user_id === user?.id && (
                    message.read ? <span className="read-status">既読</span> : null
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="メッセージを入力..."
          className="message-input"
          disabled={isSending}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!newMessage.trim() || isSending}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ConversationDetailPage;