'use client';

import React, { useState, useCallback } from 'react';
import { PureMultimodalInput } from "@/components/ui/multimodal-ai-chat-input"

type VisibilityType = 'public' | 'private' | 'unlisted' | string;

interface Attachment {
    url: string;
    name: string;
    contentType: string;
    size: number;
}

interface UIMessage {
  id: string;
  content: string;
  role: string;
  attachments?: Attachment[];
}

export function DemoHealthcareChatbox() {
  // Minimal state and handlers required by PureMultimodalInput
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatId] = useState('demo-healthcare-chatbox');

  const handleSendMessage = useCallback(({ input, attachments }: { input: string; attachments: Attachment[] }) => {
    console.log("--- Healthcare Search Request ---");
    console.log("Health Concern:", input);
    console.log("Attachments:", attachments);
    console.log("Navigation: Would navigate to /search?q=" + encodeURIComponent(input));
    console.log("-------------------------------");

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000); // Simulate a 2 second response time

  }, []);

  const handleStopGenerating = useCallback(() => {
    console.log("Stop button clicked (simulated).");
    setIsGenerating(false);
  }, []);

  // Other necessary props for PureMultimodalInput
  const canSend = true;
  const messages: UIMessage[] = [];
  const selectedVisibilityType: VisibilityType = 'private';

  return (
    <div className="w-full max-w-3xl mx-auto p-4"> 
      <PureMultimodalInput
        chatId={chatId}
        messages={messages}
        attachments={attachments}
        setAttachments={setAttachments}
        onSendMessage={handleSendMessage}
        onStopGenerating={handleStopGenerating}
        isGenerating={isGenerating}
        canSend={canSend}
        selectedVisibilityType={selectedVisibilityType}
      />
    </div>
  );
}