export interface Conversation {
  id: number;
  other_user: {
    id: number;
    name: string;
  };
  last_message: string | null;
  unread_count: number;
  updated_at: string;
}

export interface Message {
  id: number;
  body: string;
  created_at: string;
  user_id: number;
  read: boolean;
  user_name: string;
}

export interface ConversationDetail {
  id: number;
  other_user: {
    id: number;
    name: string;
  };
  messages: Message[];
}