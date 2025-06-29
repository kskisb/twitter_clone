import { client } from './client';
import type { Conversation, ConversationDetail, Message } from '../types/conversation';

// 全ての会話リストを取得
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await client.get('/conversations');
  return response.data;
};

// 特定の会話の詳細を取得
export const getConversation = async (conversationId: number): Promise<ConversationDetail> => {
  const response = await client.get(`/conversations/${conversationId}`);
  return response.data;
};

// 新しい会話を作成
export const createConversation = async (recipientId: number): Promise<{ conversation_id: number }> => {
  const response = await client.post('/conversations', { recipient_id: recipientId });
  return response.data;
};

// メッセージを送信
export const sendMessage = async (conversationId: number, body: string): Promise<Message> => {
  const response = await client.post(`/conversations/${conversationId}/messages`, {
    message: { body }
  });
  return response.data;
};