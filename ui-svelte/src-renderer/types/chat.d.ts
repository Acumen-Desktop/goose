export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
}

export interface Conversation {
  id: string;
  messages: Message[];
  title?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatState {
  currentConversation?: Conversation;
  conversations: Conversation[];
  isTyping: boolean;
  error?: string;
}
