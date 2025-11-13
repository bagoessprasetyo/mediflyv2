'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Brain, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
// import 'highlight.js/styles/github.css';
import AIThinkingBlock from './ai-thinking-block';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Message {
  id: number;
  sender: 'left' | 'right';
  type: 'text' | 'image' | 'text-with-links' | 'text-with-thinking';
  content: string;
  links?: Array<{ text: string }>;
  maxWidth?: string;
  thinking?: string;
  loader?: {
    enabled: boolean;
    delay?: number;
    duration?: number;
  };
}

interface Person {
  name: string;
  avatar: string;
}

interface ChatConfig {
  leftPerson: Person;
  rightPerson: Person;
  messages: Message[];
}

interface ModernChatComponentProps {
  config: ChatConfig;
  onSendMessage?: (content: string) => void;
  isLoading?: boolean;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const parseThinking = (content: string) => {
  const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
  const thinking = thinkingMatch ? thinkingMatch[1].trim() : '';
  const response = content.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim();
  return { thinking, response };
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const MessageLoader = React.memo<{ dotColor?: string }>(({ dotColor = '#14B8A6' }) => {
  const dotAnimation = { y: [0, -6, 0] };
  const dotTransition = (delay = 0) => ({
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay
  });

  return (
    <motion.div className="flex items-center gap-1 px-3 py-2">
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
          animate={dotAnimation}
          transition={dotTransition(delay)}
        />
      ))}
    </motion.div>
  );
});

MessageLoader.displayName = 'MessageLoader';

const ThinkingProcess = React.memo<{ content: string; isLoading?: boolean }>(({ content, isLoading = false }) => {
  const [showThinking, setShowThinking] = useState(false);

  if (!content && !isLoading) return null;

  if (isLoading) {
    return (
      <div className="mb-6">
        <AIThinkingBlock content={content} title="Aira is thinking" />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setShowThinking(!showThinking)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Brain className="w-4 h-4" />
        <span>{showThinking ? 'Hide' : 'Show'} thinking process</span>
        <motion.div
          animate={{ rotate: showThinking ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence>
        {showThinking && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2"
          >
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 whitespace-pre-wrap">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ThinkingProcess.displayName = 'ThinkingProcess';

// Code Block Component with Copy Button
const CodeBlock = React.memo<{ 
  children: string; 
  className?: string; 
  inline?: boolean 
}>(({ children, className, inline }) => {
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-sm font-mono">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-200 text-xs font-medium rounded-t-lg">
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto bg-gray-50 border border-gray-200 rounded-b-lg">
        <code className={`block p-4 text-sm font-mono ${className || ''}`}>
          {children}
        </code>
      </pre>
    </div>
  );
});

CodeBlock.displayName = 'CodeBlock';

// Markdown Components for Custom Styling
const MarkdownComponents = {
  code: CodeBlock,
  pre: ({ children, ...props }: any) => <pre {...props}>{children}</pre>,
  h1: ({ children, ...props }: any) => (
    <h1 className="text-xl font-semibold text-gray-900 mt-6 mb-3 first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-lg font-semibold text-gray-900 mt-5 mb-3 first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-base font-semibold text-gray-900 mt-4 mb-2 first:mt-0" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className="mb-3 last:mb-0" {...props}>{children}</p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc pl-6 mb-3 space-y-1" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal pl-6 mb-3 space-y-1" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-gray-800" {...props}>{children}</li>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-teal-500 pl-4 py-2 my-3 bg-teal-50 text-gray-700 italic" {...props}>
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-gray-200 rounded-lg" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-left font-semibold text-gray-900" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-4 py-2 border-b border-gray-200 text-gray-800" {...props}>
      {children}
    </td>
  ),
  a: ({ href, children, ...props }: any) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-teal-600 hover:text-teal-700 underline"
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-gray-900" {...props}>{children}</strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic" {...props}>{children}</em>
  ),
};

// ============================================================================
// MESSAGE COMPONENTS
// ============================================================================

const AIMessage = React.memo<{ message: Message; isLoading: boolean; isVisible: boolean }>(
  ({ message, isLoading, isVisible }) => {
    const { thinking, response } = parseThinking(message.content);

    return (
      <div className="w-full mb-6">
        {/* Show thinking block while loading, or collapsible thinking when complete */}
        {isLoading && !isVisible ? (
          <ThinkingProcess content={thinking} isLoading={true} />
        ) : thinking && isVisible ? (
          <ThinkingProcess content={thinking} isLoading={false} />
        ) : null}
        
        {/* Message Content */}
        <AnimatePresence mode="wait">
          {isLoading && !isVisible ? (
            <motion.div
              key="ai-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4"
            >
              {/* The thinking block is shown above, so we don't need the basic loader here */}
              <div className="h-4" />
            </motion.div>
          ) : isVisible ? (
            <motion.div
              key="ai-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="py-2"
            >
              <div className="text-gray-800 leading-7 text-[15px] font-normal prose prose-gray max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={MarkdownComponents as any}
                >
                  {response}
                </ReactMarkdown>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

AIMessage.displayName = 'AIMessage';

const UserMessage = React.memo<{ message: Message; isLoading: boolean; isVisible: boolean }>(
  ({ message, isLoading, isVisible }) => {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-3xl px-4 py-3 rounded-2xl bg-[#ade4ff] text-white shadow-sm">
          <AnimatePresence mode="wait">
            {isLoading && !isVisible ? (
              <motion.div key="user-loader" className="flex justify-center">
                <MessageLoader dotColor="#ffffff" />
              </motion.div>
            ) : isVisible ? (
              <motion.div
                key="user-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-[15px] leading-6 font-medium text-black">
                  {message.content}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

UserMessage.displayName = 'UserMessage';

// ============================================================================
// MAIN CHAT COMPONENT
// ============================================================================

const ModernChatInterface: React.FC<ModernChatComponentProps> = ({ 
  config, 
  onSendMessage, 
  isLoading = false 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [config.messages, scrollToBottom]);

  // Show messages sequentially
  useEffect(() => {
    const timeout = setTimeout(() => {
      config.messages.forEach((message, index) => {
        setTimeout(() => {
          setVisibleMessages(prev => prev.includes(message.id) ? prev : [...prev, message.id]);
        }, index * 100);
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [config.messages]);

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <div className="flex-1 flex flex-col h-full max-w-5xl mx-auto bg-white">
      {/* Messages Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        <div className="min-h-full flex flex-col justify-end max-w-4xl mx-auto">
          {config.messages.map((message, index) => {
            const isVisible = visibleMessages.includes(message.id);
            const messageIsLoading = isLoading && index === config.messages.length - 1;
            
            return (
              <div key={message.id} className="mb-1">
                {message.sender === 'left' ? (
                  <AIMessage 
                    message={message} 
                    isLoading={messageIsLoading} 
                    isVisible={isVisible} 
                  />
                ) : (
                  <UserMessage 
                    message={message} 
                    isLoading={messageIsLoading} 
                    isVisible={isVisible} 
                  />
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200/60 bg-white/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Aira..."
                disabled={isLoading}
                rows={1}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 placeholder:text-gray-400"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                inputValue.trim() && !isLoading
                  ? 'bg-[#ade4ff] text-white hover:bg-teal-700 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernChatInterface;
export type { ModernChatComponentProps, ModernChatComponentProps as HealthcareChatComponentProps, ChatConfig, Message, Person };