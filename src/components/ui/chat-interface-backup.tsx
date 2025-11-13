// Backup of the original chat interface
// This is kept as a backup while using the modern-chat-interface.tsx

'use client';

import React from 'react';

// Simple fallback component to prevent build errors
export default function ChatComponent() {
  return (
    <div>
      <p>This component has been replaced with modern-chat-interface.tsx</p>
    </div>
  );
}

export type { ModernChatComponentProps as HealthcareChatComponentProps, ChatConfig, Message, Person } from './modern-chat-interface';