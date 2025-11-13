'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AIChatAssistantProps {
  searchContext: {
    query: string;
    location?: string;
    hasSearched: boolean;
    resultsCount: number;
    hospitalCount: number;
    doctorCount: number;
    relevantSpecialties: string[];
  };
  onFilterSuggestion?: (filters: any) => void;
}

interface AnimatedMessage {
  id: string;
  sender: 'left' | 'right';
  type: 'text' | 'text-with-links' | 'tool-call' | 'thinking';
  content: string;
  thinkingContent?: string; // For displaying thinking process separately
  maxWidth?: string;
  loader?: {
    enabled: boolean;
    delay?: number;
    duration?: number;
  };
  links?: Array<{ text: string }>;
  timestamp?: Date;
  isStreaming?: boolean;
  toolCall?: any;
}

interface Person {
  name: string;
  avatar: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert AI SDK message to animated chat format
 */
function convertAIMessageToAnimated(message: any, index: number): AnimatedMessage[] {
  const animatedMessages: AnimatedMessage[] = [];
  
  // Determine sender and basic properties
  const sender = message.role === 'user' ? 'right' : 'left';
  const baseId = `${message.role}-${message.id || Date.now()}-${index}`;
  
  // Handle different message structures
  if (message.parts) {
    // New message structure with parts
    message.parts.forEach((part: any, partIndex: number) => {
      const messageId = `${baseId}-part-${partIndex}`;
      
      switch (part.type) {
        case 'text':
          // Process thinking content and main content
          const { thinking, content } = processAIContent(part.text);
          
          // Check if main content contains action buttons/links
          const actionButtons = extractActionButtons(content);
          const msgType = actionButtons.length > 0 ? 'text-with-links' : 'text';
          
          // Create a single message with both thinking and content
          if (content || thinking) {
            animatedMessages.push({
              id: messageId,
              sender,
              type: msgType,
              content: content || '', // Main content
              thinkingContent: thinking || undefined, // Thinking content for expandable section
              maxWidth: sender === 'left' ? 'max-w-md' : 'max-w-sm',
              links: actionButtons.map(action => ({ text: action })),
              timestamp: message.createdAt || new Date(),
              isStreaming: part.isStreaming,
              loader: {
                enabled: !part.isStreaming,
                delay: partIndex * 500,
                duration: 1500
              }
            });
          }
          break;
          
        case 'tool-call':
          animatedMessages.push({
            id: messageId,
            sender,
            type: 'tool-call',
            content: getToolDescription(part.toolName),
            toolCall: part,
            maxWidth: 'max-w-sm',
            timestamp: message.createdAt || new Date(),
            loader: {
              enabled: true,
              delay: partIndex * 300,
              duration: 1000
            }
          });
          break;
          
        case 'reasoning':
        case 'reasoning-start':
        case 'reasoning-delta':
        case 'reasoning-end':
          if (part.text || part.delta) {
            animatedMessages.push({
              id: messageId,
              sender,
              type: 'thinking',
              content: part.text || part.delta || 'Processing...',
              maxWidth: 'max-w-sm',
              timestamp: message.createdAt || new Date(),
              loader: {
                enabled: true,
                delay: partIndex * 200,
                duration: 800
              }
            });
          }
          break;
      }
    });
  } else if (message.content) {
    // Legacy message structure
    const { thinking, content } = processAIContent(message.content);
    
    // Process main content and thinking together
    if (content || thinking) {
      const actionButtons = extractActionButtons(content);
      const msgType = actionButtons.length > 0 ? 'text-with-links' : 'text';
      
      animatedMessages.push({
        id: baseId,
        sender,
        type: msgType,
        content: content || '', // Main content
        thinkingContent: thinking || undefined, // Thinking content for expandable section
        maxWidth: sender === 'left' ? 'max-w-md' : 'max-w-sm',
        links: actionButtons.map(action => ({ text: action })),
        timestamp: message.createdAt || new Date(),
        loader: {
          enabled: true,
          delay: 500,
          duration: 1500
        }
      });
    }
  }
  
  return animatedMessages;
}

/**
 * Extract action buttons from AI response text
 */
function extractActionButtons(text: string): string[] {
  const actionButtons: string[] = [];
  
  // Patterns to identify actionable content
  const patterns = [
    /Try:?\s*([^.\n]+)/gi,
    /Consider:?\s*([^.\n]+)/gi,
    /You (?:could|can):?\s*([^.\n]+)/gi,
    /^[•-]\s*((?:Ask|Find|Check|Compare|Look|Search|Filter|Contact|Visit|Call|Book|Schedule)[^.\n]+)/gmi,
    /What about\s+([^?.\n]+)/gi,
    /How about\s+([^?.\n]+)/gi
  ];

  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        let cleanMatch = match
          .replace(/^(Try|Consider|You (?:could|can)|What about|How about):?\s*/i, '')
          .replace(/^[•-]\s*/, '')
          .replace(/\?+$/, '')
          .trim();
        
        if (cleanMatch.length > 10 && cleanMatch.length < 80) {
          cleanMatch = cleanMatch.charAt(0).toUpperCase() + cleanMatch.slice(1);
          actionButtons.push(cleanMatch);
        }
      });
    }
  });

  return [...new Set(actionButtons)].slice(0, 3); // Limit to 3 unique actions
}

/**
 * Get tool description for display
 */
function getToolDescription(toolName: string): string {
  const descriptions: Record<string, string> = {
    'searchHealthcareCombined': 'Searching hospitals and doctors...',
    'searchHospitals': 'Finding hospitals for you...',
    'searchDoctors': 'Looking for specialists...',
    'getHospitalDetails': 'Getting hospital information...',
    'getDoctorDetails': 'Fetching doctor details...',
    'getHealthcareRecommendations': 'Getting personalized recommendations...',
    'compareHealthcareOptions': 'Comparing your options...'
  };
  return descriptions[toolName] || `Processing ${toolName}...`;
}

/**
 * Process AI text to separate thinking sections and main content
 */
function processAIContent(text: string): { thinking: string | null; content: string } {
  // Extract thinking content between <thinking> tags
  const thinkingMatch = text.match(/<thinking>([\s\S]*?)<\/thinking>/);
  const thinking = thinkingMatch ? thinkingMatch[1].trim() : null;
  
  // Remove thinking tags from main content
  const content = text.replace(/<thinking>[\s\S]*?<\/thinking>/g, '').trim();
  
  return { thinking, content };
}

// ============================================================================
// ANIMATED COMPONENTS
// ============================================================================

/**
 * Animated loading indicator with bouncing dots
 */
const MessageLoader = React.memo<{ dotColor?: string }>(({ dotColor = '#3B82F6' }) => {
  const dotAnimation = {
    y: [0, -6, 0]
  };

  const dotTransition = (delay = 0) => ({
    duration: 0.6,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay
  });

  return (
    <motion.div
      className="flex items-center gap-1 px-3 py-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
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

/**
 * Markdown content renderer with healthcare-appropriate styling
 */
const MarkdownContent = React.memo<{ content: string; isAI: boolean }>(({ content, isAI }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Paragraph styling
        p: ({ children }) => (
          <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>
        ),
        // Strong text
        strong: ({ children }) => (
          <strong className={`font-semibold ${isAI ? 'text-white' : 'text-gray-900'}`}>{children}</strong>
        ),
        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto my-3">
            <table className={`min-w-full border-collapse text-sm ${
              isAI 
                ? 'border border-gray-600 bg-gray-800 rounded-lg overflow-hidden' 
                : 'border border-gray-300 bg-white'
            }`}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className={isAI ? 'bg-gray-700' : 'bg-blue-50'}>{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className={`${isAI ? 'divide-y divide-gray-600' : 'divide-y divide-gray-200'}`}>{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className={`${isAI ? 'hover:bg-gray-700' : 'border-b border-gray-200'}`}>{children}</tr>
        ),
        th: ({ children }) => (
          <th className={`px-3 py-2 text-left font-semibold ${
            isAI 
              ? 'text-gray-100 border-r border-gray-600 last:border-r-0' 
              : 'text-blue-900 border border-gray-300'
          }`}>
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className={`px-3 py-2 ${
            isAI 
              ? 'text-gray-200 border-r border-gray-600 last:border-r-0' 
              : 'text-gray-800 border border-gray-300'
          }`}>
            {children}
          </td>
        ),
        // Lists
        ul: ({ children }) => (
          <ul className={`list-inside space-y-1 my-2 ${isAI ? 'list-none' : 'list-disc'}`}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className={`text-sm leading-relaxed ${isAI ? 'before:content-["•"] before:text-white before:mr-2' : ''}`}>
            {children}
          </li>
        ),
        // Headers
        h1: ({ children }) => (
          <h1 className={`text-lg font-bold mb-2 ${isAI ? 'text-white' : 'text-blue-900'}`}>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className={`text-base font-bold mb-2 ${isAI ? 'text-gray-100' : 'text-blue-800'}`}>{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className={`text-sm font-bold mb-1 ${isAI ? 'text-gray-200' : 'text-blue-700'}`}>{children}</h3>
        ),
        // Code
        code: ({ children }) => (
          <code className={`px-1 py-0.5 rounded text-xs font-mono ${
            isAI 
              ? 'bg-gray-800 text-gray-200' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {children}
          </code>
        ),
        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className={`border-l-4 pl-3 my-2 text-sm italic ${
            isAI 
              ? 'border-gray-400 text-gray-200' 
              : 'border-blue-300'
          }`}>
            {children}
          </blockquote>
        )
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

MarkdownContent.displayName = 'MarkdownContent';

/**
 * Action button component
 */
const ActionButton = React.memo<{ action: string; onClick: () => void }>(({ action, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs border tracking-wider bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
  >
    <span>{action}</span>
  </button>
));

ActionButton.displayName = 'ActionButton';

/**
 * Expandable thinking section component like ChatGPT
 */
const ThinkingSection = React.memo<{ content: string }>(({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-900 bg-opacity-25 border border-white border-opacity-30 rounded-lg overflow-hidden">
      {/* Header with toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-gray-800 hover:bg-opacity-20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-white" />
          <span className="text-sm font-medium text-white">Thought process</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3.5 w-3.5 text-white opacity-80" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-white border-opacity-20">
              <div className="mt-3 text-sm text-white leading-relaxed">
                <MarkdownContent content={content} isAI={true} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ThinkingSection.displayName = 'ThinkingSection';

/**
 * Tool call display component
 */
const ToolCallBubble = React.memo<{ toolCall: any; content: string }>(({ toolCall, content }) => {
  const getToolIcon = (toolName: string) => {
    if (toolName.includes('Hospital')) return '🏥';
    if (toolName.includes('Doctor')) return '👨‍⚕️';
    if (toolName.includes('Combined')) return '🔍';
    return '🔧';
  };

  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{getToolIcon(toolCall.toolName)}</span>
        <span className="text-sm font-medium text-blue-800">{content}</span>
        {toolCall.status === 'running' && (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        )}
      </div>
      {toolCall.args && (
        <div className="text-xs text-blue-700">
          {toolCall.args.query && <span>Query: "{toolCall.args.query}"</span>}
          {toolCall.args.location && <span> • Location: {toolCall.args.location}</span>}
        </div>
      )}
    </div>
  );
});

ToolCallBubble.displayName = 'ToolCallBubble';

/**
 * Enhanced message bubble with animations and healthcare theming
 */
const MessageBubble = React.memo<{
  message: AnimatedMessage;
  isLeft: boolean;
  onContentReady?: () => void;
  isLoading: boolean;
  isVisible: boolean;
  onActionClick: (action: string) => void;
}>(({ message, isLeft, onContentReady, isLoading, isVisible, onActionClick }) => {
  const isAI = isLeft;
  
  useEffect(() => {
    if (isVisible && (message.type === 'text' || message.type === 'text-with-links')) {
      onContentReady?.();
    }
  }, [isVisible, message.type, onContentReady]);

  const bubbleStyle = useMemo(() => ({
    backgroundColor: isAI ? '#3B82F6' : '#FFFFFF',
    color: isAI ? '#FFFFFF' : '#1F2937',
    borderColor: isAI ? '#2563EB' : '#E5E7EB',
    borderWidth: isAI ? '0' : '1px'
  }), [isAI]);

  const roundedClass = isLeft
    ? "rounded-br-lg rounded-tl-lg rounded-tr-lg"
    : "rounded-bl-lg rounded-tl-lg rounded-tr-lg";

  const maxWidthClass = message.maxWidth || 'max-w-sm';

  return (
    <div
      className={`${roundedClass} p-4 ${maxWidthClass} border-solid relative`}
      style={bubbleStyle}
    >
      <AnimatePresence mode="wait">
        {isLoading && !isVisible ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <MessageLoader dotColor={isAI ? '#FFFFFF' : '#3B82F6'} />
          </motion.div>
        ) : isVisible ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Text message */}
            {message.type === 'text' && (
              <div>
                {/* Show thinking section if available */}
                {message.thinkingContent && isAI && (
                  <div className="mb-3">
                    <ThinkingSection content={message.thinkingContent} />
                  </div>
                )}
                {message.content && (
                  <MarkdownContent content={message.content} isAI={isAI} />
                )}
                {message.isStreaming && (
                  <span className="inline-block w-0.5 h-4 bg-current animate-pulse ml-0.5 align-middle"></span>
                )}
              </div>
            )}

            {/* Text with action links */}
            {message.type === 'text-with-links' && (
              <div>
                {/* Show thinking section if available */}
                {message.thinkingContent && isAI && (
                  <div className="mb-3">
                    <ThinkingSection content={message.thinkingContent} />
                  </div>
                )}
                {message.content && (
                  <div className="mb-3">
                    <MarkdownContent content={message.content} isAI={isAI} />
                    {message.isStreaming && (
                      <span className="inline-block w-0.5 h-4 bg-current animate-pulse ml-0.5 align-middle"></span>
                    )}
                  </div>
                )}
                {message.links && message.links.length > 0 && !message.isStreaming && (
                  <div className="flex flex-wrap gap-2">
                    {message.links.map((link, index) => (
                      <ActionButton
                        key={index}
                        action={link.text}
                        onClick={() => onActionClick(link.text)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tool call display */}
            {message.type === 'tool-call' && message.toolCall && (
              <ToolCallBubble toolCall={message.toolCall} content={message.content} />
            )}

          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

/**
 * Message wrapper with avatar and animations
 */
const MessageWrapper = React.memo<{
  message: AnimatedMessage;
  leftPerson: Person;
  rightPerson: Person;
  previousMessageComplete: boolean;
  onMessageComplete?: (messageId: string) => void;
  previousMessage: AnimatedMessage | null;
  nextMessage: AnimatedMessage | null;
  onVisibilityChange?: (messageId: string) => void;
  isNextVisible: boolean;
  onActionClick: (action: string) => void;
}>(({
  message,
  leftPerson,
  rightPerson,
  previousMessageComplete,
  onMessageComplete,
  previousMessage,
  nextMessage,
  onVisibilityChange,
  isNextVisible,
  onActionClick
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messageCompleted, setMessageCompleted] = useState(false);

  const isLeft = message.sender === 'left';
  const person = isLeft ? leftPerson : rightPerson;

  // Message grouping logic
  const isContinuation = previousMessage?.sender === message.sender;
  const nextMessageSameSender = nextMessage?.sender === message.sender;
  const shouldShowAvatar = !nextMessageSameSender || !isNextVisible;

  // Sequential message loading
  useEffect(() => {
    if (!previousMessageComplete) return;

    const { loader } = message;
    const loaderDelay = 300;
    const totalDelay = loaderDelay + (loader?.duration || 1000);

    if (loader?.enabled) {
      const loaderTimeout = setTimeout(() => setIsLoading(true), loaderDelay);
      const messageTimeout = setTimeout(() => {
        setIsLoading(false);
        setIsVisible(true);
        onVisibilityChange?.(message.id);
      }, totalDelay);

      return () => {
        clearTimeout(loaderTimeout);
        clearTimeout(messageTimeout);
      };
    } else {
      // For streaming messages, show immediately
      setIsVisible(true);
      onVisibilityChange?.(message.id);
    }
  }, [message, previousMessageComplete, onVisibilityChange]);

  // Handle content ready
  const handleContentReady = useCallback(() => {
    if (!messageCompleted) {
      setMessageCompleted(true);
      setTimeout(() => onMessageComplete?.(message.id), 300);
    }
  }, [messageCompleted, onMessageComplete, message.id]);

  const messageClass = useMemo(() =>
    isLeft ? "flex items-end gap-3" : "flex items-end gap-3 flex-row-reverse",
    [isLeft]
  );

  if (!isLoading && !isVisible) return null;

  return (
    <div className={messageClass}>
      {/* Avatar with animation */}
      <AnimatePresence mode="wait">
        {shouldShowAvatar ? (
          <motion.img
            key="avatar"
            src={person.avatar}
            alt={person.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
          />
        ) : (
          <div className="w-8 h-8 flex-shrink-0" key="spacer" />
        )}
      </AnimatePresence>

      {/* Message content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col"
        style={{ alignItems: isLeft ? 'flex-start' : 'flex-end' }}
      >
        {/* Username (only for first message in group) */}
        {!isContinuation && (
          <motion.div
            className={`text-xs mb-1 leading-relaxed ${isLeft ? 'text-gray-600' : 'text-gray-500'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
          >
            {person.name}
          </motion.div>
        )}

        <MessageBubble
          message={message}
          isLeft={isLeft}
          onContentReady={handleContentReady}
          isLoading={isLoading}
          isVisible={isVisible}
          onActionClick={onActionClick}
        />
      </motion.div>
    </div>
  );
});

MessageWrapper.displayName = 'MessageWrapper';

// ============================================================================
// MAIN ANIMATED AI CHAT COMPONENT
// ============================================================================

export function AIChatAssistantAnimated({ searchContext, onFilterSuggestion }: AIChatAssistantProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // AI SDK messages (actual conversation data)
  const [aiMessages, setAiMessages] = useState<any[]>([]);
  
  // Animated messages (for display)
  const [animatedMessages, setAnimatedMessages] = useState<AnimatedMessage[]>([]);
  const [completedMessages, setCompletedMessages] = useState<string[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);

  // Personas for the chat
  const leftPerson: Person = {
    name: 'Aira',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face&auto=format'
  };

  const rightPerson: Person = {
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face&auto=format'
  };

  // Convert AI messages to animated format
  useEffect(() => {
    const converted = aiMessages.flatMap((msg, index) => 
      convertAIMessageToAnimated(msg, index)
    );
    setAnimatedMessages(converted);
  }, [aiMessages]);

  // Welcome message
  const welcomeMessage: AnimatedMessage = useMemo(() => ({
    id: 'welcome-message',
    sender: 'left',
    type: 'text-with-links',
    content: generateWelcomeMessage(searchContext),
    maxWidth: 'max-w-md',
    links: getQuickSuggestions(searchContext).map(suggestion => ({ text: suggestion })),
    loader: {
      enabled: true,
      delay: 500,
      duration: 2000
    }
  }), [searchContext]);

  // Combine messages
  const allAnimatedMessages = showWelcome 
    ? [welcomeMessage, ...animatedMessages] 
    : animatedMessages;

  // Handle message completion
  const handleMessageComplete = useCallback((messageId: string) => {
    setCompletedMessages(prev => [...prev, messageId]);
  }, []);

  // Handle visibility change
  const handleVisibilityChange = useCallback((messageId: string) => {
    setVisibleMessages(prev =>
      prev.includes(messageId) ? prev : [...prev, messageId]
    );
  }, []);

  // Handle action button clicks
  const handleActionClick = useCallback((action: string) => {
    setInputValue(action);
  }, []);

  // Send message to AI
  const sendMessage = async (text: string) => {
    try {
      setIsGenerating(true);
      setError(null);
      setShowWelcome(false);

      // Add user message (matching original structure)
      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        parts: [{
          type: 'text',
          text: text
        }],
        createdAt: new Date()
      };

      setAiMessages(prev => [...prev, userMessage]);

      // Prepare messages for API (use the same structure as original)
      const messagesToSend = [...aiMessages, userMessage];
      
      // Debug logging
      console.log('🚀 Sending messages to API:', messagesToSend.length, 'messages');
      console.log('📝 Latest message structure:', JSON.stringify(userMessage, null, 2));
      console.log('🔍 Search context:', searchContext);
      
      // Validate message structure
      const isValidMessage = (msg: any) => {
        return msg && msg.role && msg.parts && Array.isArray(msg.parts);
      };
      
      const invalidMessages = messagesToSend.filter(msg => !isValidMessage(msg));
      if (invalidMessages.length > 0) {
        console.error('❌ Invalid message structure detected:', invalidMessages);
      }

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesToSend,
          searchContext
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, response.statusText);
        console.error('📄 Response body:', errorText);
        throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
      }

      // Handle streaming response (matching original implementation)
      const assistantMessageId = `assistant-${Date.now()}`;
      let assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        parts: [] as any[],
        createdAt: new Date()
      };

      setAiMessages(prev => [...prev, assistantMessage]);

      // Parse AI SDK streaming response with optimized batching
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        let accumulatedText = '';
        let textPartId = 'text-0';
        let lastUpdateTime = 0;
        const UPDATE_INTERVAL = 50; // Update UI every 50ms for smooth streaming
        
        // Add initial text part with placeholder
        setAiMessages(prev => prev.map(msg => {
          if (msg.id === assistantMessageId) {
            return {
              ...msg,
              parts: [{ type: 'text', text: '', id: textPartId, isStreaming: true }]
            };
          }
          return msg;
        }));
        
        // Function to update UI with batched text
        const updateUI = () => {
          setAiMessages(prev => prev.map(msg => {
            if (msg.id === assistantMessageId) {
              const updatedParts = [...msg.parts];
              const textIndex = updatedParts.findIndex(p => p.type === 'text' && p.id === textPartId);
              if (textIndex >= 0) {
                // Process content to separate thinking and main text during streaming
                const { thinking, content } = processAIContent(accumulatedText);
                updatedParts[textIndex] = {
                  ...updatedParts[textIndex],
                  text: accumulatedText, // Keep full text for processing
                  processedContent: content, // Store processed content
                  thinkingContent: thinking, // Store thinking content
                  isStreaming: true
                };
              }
              return { ...msg, parts: updatedParts };
            }
            return msg;
          }));
        };
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          
          // Batch updates for smoother performance
          const now = Date.now();
          if (now - lastUpdateTime >= UPDATE_INTERVAL) {
            updateUI();
            lastUpdateTime = now;
          }
        }
        
        // Final update to ensure all content is displayed
        updateUI();
        
        // Mark streaming as complete
        setAiMessages(prev => prev.map(msg => {
          if (msg.id === assistantMessageId) {
            const updatedParts = [...msg.parts];
            const textIndex = updatedParts.findIndex(p => p.type === 'text' && p.id === textPartId);
            if (textIndex >= 0) {
              updatedParts[textIndex] = {
                ...updatedParts[textIndex],
                text: accumulatedText,
                isStreaming: false
              };
            }
            return { ...msg, parts: updatedParts };
          }
          return msg;
        }));
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(err as Error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [allAnimatedMessages, scrollToBottom]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200 bg-white">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">Aira</h3>
            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">AI</span>
          </div>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Ready to help you find care
          </p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {allAnimatedMessages.map((message, index) => {
          const previousMessageComplete = index === 0 || completedMessages.includes(allAnimatedMessages[index - 1].id);
          const previousMessage = index > 0 ? allAnimatedMessages[index - 1] : null;
          const nextMessage = index < allAnimatedMessages.length - 1 ? allAnimatedMessages[index + 1] : null;
          const isNextVisible = nextMessage ? visibleMessages.includes(nextMessage.id) : false;
          const isContinuation = previousMessage?.sender === message.sender;

          const spacingClass = index === 0 ? "" : (isContinuation ? "mt-2" : "mt-6");

          return (
            <div key={message.id} className={spacingClass}>
              <MessageWrapper
                message={message}
                leftPerson={leftPerson}
                rightPerson={rightPerson}
                previousMessageComplete={previousMessageComplete}
                onMessageComplete={handleMessageComplete}
                onVisibilityChange={handleVisibilityChange}
                previousMessage={previousMessage}
                nextMessage={nextMessage}
                isNextVisible={isNextVisible}
                onActionClick={handleActionClick}
              />
            </div>
          );
        })}

        {/* Loading indicator */}
        {isGenerating && (
          <div className="flex gap-4 justify-start">
            <img
              src={leftPerson.avatar}
              alt={leftPerson.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
            />
            <div className="bg-blue-500 p-4 rounded-br-lg rounded-tl-lg rounded-tr-lg max-w-sm">
              <MessageLoader dotColor="#FFFFFF" />
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Chat error: {error.message}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <div className="border-t border-gray-200 p-6 bg-white">
        <form onSubmit={(e) => {
          e.preventDefault();
          const messageText = inputValue?.trim();
          if (messageText) {
            sendMessage(messageText);
            setInputValue('');
          }
        }}>
          <div className="relative flex items-center">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Aira anything about your healthcare search..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder:text-gray-500 transition-all"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              disabled={isGenerating || !inputValue?.trim()}
              size="sm"
              className="absolute right-2 w-8 h-8 p-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateWelcomeMessage(context: AIChatAssistantProps['searchContext']): string {
  const { query, location, hospitalCount, doctorCount, hasSearched } = context;

  if (!hasSearched) {
    return `👋 **Hello! I'm Aira, your AI Medical Concierge**

I'm here to help you find the perfect healthcare options for **"${query}"**${location ? ` in **${location}**` : ''}. 

✨ **I can help you:**
• Find the best hospitals and specialists
• Compare ratings and reviews
• Check availability and services
• Get personalized recommendations

💡 **Quick tip:** Ask me anything! I can filter results, compare options, or answer questions about your healthcare search.`;
  }

  if (hospitalCount === 0 && doctorCount === 0) {
    return `👋 **Hello! I'm Aira, your AI Medical Concierge**

I searched for **"${query}"**${location ? ` in **${location}**` : ''}, but didn't find specific results. Let me help you explore other options!`;
  }

  const totalResults = hospitalCount + doctorCount;
  return `👋 **Great! I found ${totalResults} healthcare options for you**

🏥 **Search Results for "${query}"**${location ? ` in **${location}**` : ''}:
• **${hospitalCount} hospitals** with relevant services
• **${doctorCount} specialists** in your area

✨ **I can help you filter and compare these options to find the perfect match for your needs.**`;
}

function getQuickSuggestions(context: AIChatAssistantProps['searchContext']): string[] {
  const { hasSearched, hospitalCount, doctorCount } = context;
  
  if (!hasSearched) {
    return [
      'What services should I look for?',
      'How do you find the best hospitals?',
      'What questions should I ask doctors?'
    ];
  }

  if (hospitalCount === 0 && doctorCount === 0) {
    return [
      'Expand search to nearby areas',
      'Find related specialties',
      'Look for telehealth options'
    ];
  }

  return [
    'Show only emergency hospitals',
    'Filter by highest ratings',
    'Find doctors accepting new patients'
  ];
}