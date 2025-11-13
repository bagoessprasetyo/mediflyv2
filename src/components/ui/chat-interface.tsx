// Legacy chat interface component - replaced by modern-chat-interface.tsx
'use client';

import React from 'react';

// Simple interfaces for compatibility
export interface ChatStyle {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  showBorder: boolean;
  nameColor?: string;
}

export interface LinkBubbleStyle {
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  borderColor: string;
}

export interface Message {
  id: number;
  sender: 'left' | 'right';
  type: 'text' | 'image' | 'text-with-links' | 'text-with-thinking';
  content: string;
  maxWidth?: string;
  links?: Array<{ text: string }>;
  thinking?: string;
  loader?: {
    enabled: boolean;
    delay?: number;
    duration?: number;
  };
}

export interface Person {
  name: string;
  avatar: string;
}

export interface UiConfig {
  containerWidth?: number;
  containerHeight?: number;
  backgroundColor?: string;
  autoRestart?: boolean;
  restartDelay?: number;
  loader?: {
    dotColor?: string;
  };
  linkBubbles?: LinkBubbleStyle;
  leftChat?: ChatStyle;
  rightChat?: ChatStyle;
}

export interface ChatConfig {
  leftPerson: Person;
  rightPerson: Person;
  messages: Message[];
}

export interface HealthcareChatComponentProps {
  config: ChatConfig;
  uiConfig?: UiConfig;
  onSendMessage?: (content: string) => void;
  isLoading?: boolean;
  showInput?: boolean;
}

// Simple fallback component - the real implementation is in modern-chat-interface.tsx
const ChatComponent: React.FC<HealthcareChatComponentProps> = () => {
  return (
    <div className="p-4 text-center text-gray-500">
      <p>Legacy chat interface - please use ModernChatInterface instead</p>
    </div>
  );
};

export default ChatComponent;

// Re-export types for compatibility
export type { HealthcareChatComponentProps as ChatComponentProps };