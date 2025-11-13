'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, AlertTriangle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// Thinking process markdown renderer (simplified for smaller text)
function ThinkingMarkdown({ content }: { content: string }) {
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  return (
    <div className="space-y-2">
      {paragraphs.map((paragraph, index) => {
        const trimmed = paragraph.trim();
        
        // Handle bullet points
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const lines = trimmed.split('\n');
          const listItems: string[] = [];
          let currentItem = '';
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
              if (currentItem) {
                listItems.push(currentItem);
              }
              currentItem = trimmedLine.replace(/^[•\-*]\s*/, '').trim();
            } else if (trimmedLine && currentItem) {
              currentItem += ' ' + trimmedLine;
            }
          }
          if (currentItem) {
            listItems.push(currentItem);
          }
          
          return (
            <ul key={index} className="space-y-1.5 ml-3">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <span className="text-indigo-500/70 text-xs mt-0.5 font-medium">•</span>
                  <span className="flex-1 text-xs text-slate-600">{formatText(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        
        // Handle numbered lists
        if (/^\d+\./.test(trimmed)) {
          const lines = trimmed.split('\n').filter(line => line.trim());
          const listItems: string[] = [];
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (/^\d+\./.test(trimmedLine)) {
              listItems.push(trimmedLine.replace(/^\d+\.\s*/, ''));
            } else if (listItems.length > 0) {
              listItems[listItems.length - 1] += ' ' + trimmedLine;
            }
          }
          
          return (
            <ol key={index} className="space-y-1.5 ml-3">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <span className="text-indigo-600/70 text-xs font-semibold mt-0.5 min-w-[1rem]">{itemIndex + 1}.</span>
                  <span className="flex-1 text-xs text-slate-600">{formatText(item)}</span>
                </li>
              ))}
            </ol>
          );
        }
        
        // Regular paragraphs
        return (
          <p key={index} className="text-xs leading-relaxed text-slate-600 mb-2">
            {formatText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Enhanced markdown content renderer
function MarkdownContent({ content }: { content: string }) {
  const [showThinking, setShowThinking] = useState(false);
  
  // Check for thinking process and extract it
  const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
  let thinkingContent = '';
  let mainContent = content;
  
  if (thinkingMatch) {
    thinkingContent = thinkingMatch[1].trim();
    mainContent = content.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim();
  }
  
  // Better paragraph detection - split on double newlines but preserve structure
  const paragraphs = mainContent.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  return (
    <div className="space-y-3 will-change-auto" style={{ transform: 'translate3d(0, 0, 0)' }}>
      {/* Render thinking process if present */}
      {thinkingContent && (
        <div className="group relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 border border-slate-200/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 mb-4">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          
          <button
            onClick={() => setShowThinking(!showThinking)}
            className="relative w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/40 transition-all duration-200 group-hover:bg-white/30"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  Thinking Process
                  <span className="text-xs text-slate-500 font-normal">
                    {showThinking ? 'Hide' : 'Show'} reasoning
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${showThinking ? 'bg-green-500' : 'bg-slate-400'}`} />
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 delay-75 ${showThinking ? 'bg-green-500' : 'bg-slate-300'}`} />
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 delay-150 ${showThinking ? 'bg-green-500' : 'bg-slate-200'}`} />
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${showThinking ? 'rotate-180' : ''}`}
              />
            </div>
          </button>
          
          {/* Expandable content with smooth animation */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showThinking ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-4 pb-4 border-t border-slate-200/50 bg-gradient-to-br from-white/60 to-slate-50/40">
              <div className="mt-3 p-3 bg-white/70 rounded-lg border border-slate-200/40 backdrop-blur-sm">
                <div className="text-xs text-slate-700 leading-relaxed">
                  <ThinkingMarkdown content={thinkingContent} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Render main content */}
      {paragraphs.map((paragraph, index) => {
        const trimmed = paragraph.trim();
        
        // Tables - detect lines with | separators
        if (trimmed.includes('|') && trimmed.split('\n').length > 1) {
          const lines = trimmed.split('\n').map(line => line.trim()).filter(line => line.includes('|'));
          if (lines.length >= 2) {
            // Parse table
            const headerRow = lines[0];
            const separatorRow = lines[1];
            const dataRows = lines.slice(2);
            
            // Check if it's actually a table (separator row should have dashes)
            if (separatorRow.includes('-')) {
              const headers = headerRow.split('|').map(h => h.trim()).filter(h => h.length > 0);
              const rows = dataRows.map(row => 
                row.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0)
              );
              
              return (
                <div key={index} className="overflow-x-auto my-4 border border-gray-200 rounded-lg shadow-sm">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-teal-50 to-blue-50">
                        {headers.map((header, headerIndex) => (
                          <th key={headerIndex} className="border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-900 last:border-r-0">
                            <div className="flex items-center gap-1">
                              {formatText(header)}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={`transition-colors hover:bg-gray-50/50 ${
                          rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border-r border-gray-100 px-4 py-3 text-gray-700 last:border-r-0 align-top">
                              <div className="min-w-0 break-words">
                                {formatText(cell)}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
          }
        }
        
        // Headers - improved styling
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={index} className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
              {formatText(trimmed.slice(2))}
            </h1>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={index} className="text-lg font-semibold text-gray-900 mb-2 mt-4">
              {formatText(trimmed.slice(3))}
            </h2>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={index} className="text-base font-semibold text-gray-800 mb-1.5 mt-3">
              {formatText(trimmed.slice(4))}
            </h3>
          );
        }
        if (trimmed.startsWith('#### ')) {
          return (
            <h4 key={index} className="text-sm font-semibold text-gray-700 mb-1 mt-2">
              {formatText(trimmed.slice(5))}
            </h4>
          );
        }
        
        // Code blocks - improved styling
        if (trimmed.startsWith('```')) {
          const codeContent = trimmed.slice(3).replace(/```$/, '');
          const lines = codeContent.split('\n');
          const language = lines[0]?.trim();
          const code = language && !language.includes(' ') ? lines.slice(1).join('\n') : codeContent;
          
          return (
            <div key={index} className="my-4">
              {language && !language.includes(' ') && (
                <div className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-t font-mono">
                  {language}
                </div>
              )}
              <pre className={`bg-gray-900 text-gray-100 p-4 text-xs font-mono overflow-x-auto ${
                language && !language.includes(' ') ? 'rounded-b' : 'rounded'
              }`}>
                <code>{code}</code>
              </pre>
            </div>
          );
        }
        
        // Blockquotes
        if (trimmed.startsWith('>')) {
          const quoteContent = trimmed
            .split('\n')
            .map(line => line.trim().replace(/^>\s*/, ''))
            .join('\n');
          return (
            <blockquote key={index} className="border-l-4 border-blue-400 pl-4 py-2 my-3 bg-blue-50/50 rounded-r">
              <div className="text-sm text-blue-900/90 italic">
                {formatText(quoteContent)}
              </div>
            </blockquote>
          );
        }
        
        // Bullet lists - improved to handle multi-line content
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const lines = paragraph.split('\n');
          const listItems: string[] = [];
          let currentItem = '';
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
              if (currentItem) {
                listItems.push(currentItem);
              }
              currentItem = trimmedLine.replace(/^[•\-*]\s*/, '').trim();
            } else if (trimmedLine && currentItem) {
              // Continue previous item with line break
              currentItem += '\n' + trimmedLine;
            }
          }
          if (currentItem) {
            listItems.push(currentItem);
          }
          
          return (
            <ul key={index} className="space-y-2 ml-4 my-3">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3 text-sm">
                  <span className="text-teal-600 mt-1 text-sm flex-shrink-0 font-medium">•</span>
                  <div className="flex-1 leading-relaxed">
                    {item.includes('\n') ? (
                      <div className="space-y-1">
                        {item.split('\n').map((subLine, subIndex) => (
                          <div key={subIndex}>
                            {formatText(subLine.trim())}
                          </div>
                        ))}
                      </div>
                    ) : (
                      formatText(item)
                    )}
                  </div>
                </li>
              ))}
            </ul>
          );
        }
        
        // Numbered lists - improved
        if (/^\d+\./.test(trimmed)) {
          const lines = trimmed.split('\n').filter(line => line.trim());
          const listItems: string[] = [];
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (/^\d+\./.test(trimmedLine)) {
              listItems.push(trimmedLine.replace(/^\d+\.\s*/, ''));
            } else if (listItems.length > 0) {
              listItems[listItems.length - 1] += ' ' + trimmedLine;
            }
          }
          
          return (
            <ol key={index} className="space-y-2 ml-4 my-3">
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3 text-sm">
                  <span className="text-teal-600 mt-0.5 text-sm font-semibold flex-shrink-0 min-w-[1.25rem]">
                    {itemIndex + 1}.
                  </span>
                  <div className="flex-1 leading-relaxed">{formatText(item)}</div>
                </li>
              ))}
            </ol>
          );
        }
        
        // Special section headers (like "Quick take‑aways", "How to use this information")
        if (trimmed.length < 100 && !trimmed.includes('\n') && 
            (trimmed.includes('take‑away') || trimmed.includes('Next steps') || 
             trimmed.includes('How to use') || trimmed.toLowerCase().includes('information'))) {
          return (
            <h3 key={index} className="text-base font-semibold text-gray-900 mt-4 mb-2">
              {formatText(trimmed)}
            </h3>
          );
        }
        
        // Regular paragraphs with better line break handling
        if (trimmed) {
          // Handle paragraphs that might contain line breaks
          const lines = trimmed.split('\n').map(line => line.trim()).filter(line => line.length > 0);
          
          if (lines.length === 1) {
            // Single line paragraph
            return (
              <p key={index} className="text-sm leading-relaxed  my-2">
                {formatText(trimmed)}
              </p>
            );
          } else {
            // Multi-line content
            return (
              <div key={index} className="text-sm leading-relaxed text-gray-800 space-y-1 my-2">
                {lines.map((line, lineIndex) => (
                  <div key={lineIndex}>
                    {formatText(line)}
                  </div>
                ))}
              </div>
            );
          }
        }
        
        return null;
      }).filter(Boolean)}
    </div>
  );
}

// Format timestamp for chat messages
function formatMessageTime(timestamp?: string | number | Date): string {
  const now = new Date();
  const messageTime = timestamp ? new Date(timestamp) : now;
  const diffMs = now.getTime() - messageTime.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffMinutes < 1440) { // 24 hours
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffMinutes / 1440);
    return `${days}d ago`;
  }
}

// Enhanced text formatting with multiple markdown features and HTML support
function formatText(text: string): (string | React.ReactElement)[] {
  // First handle HTML tags
  let htmlProcessed = text;
  const htmlParts = [];
  let currentIndex = 0;
  
  // Handle <br> tags
  const brRegex = /<br\s*\/?>/gi;
  let match;
  while ((match = brRegex.exec(text)) !== null) {
    if (match.index > currentIndex) {
      htmlParts.push(text.slice(currentIndex, match.index));
    }
    htmlParts.push(<br key={`br-${match.index}`} />);
    currentIndex = match.index + match[0].length;
  }
  if (currentIndex < text.length) {
    htmlParts.push(text.slice(currentIndex));
  }
  
  // If we found HTML tags, process each text part separately
  if (htmlParts.length > 1) {
    return htmlParts.flatMap((part, partIndex) => {
      if (typeof part === 'string') {
        return processTextFormatting(part, partIndex);
      }
      return part;
    });
  }
  
  return processTextFormatting(text, 0);
}

// Process markdown formatting for text
function processTextFormatting(text: string, baseIndex: number): (string | React.ReactElement)[] {
  // Handle inline code
  let parts = text.split(/(`[^`]+`)/g);
  const formattedParts = parts.flatMap((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={`code-${baseIndex}-${index}`} className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    
    // Handle bold text
    return part.split(/(\*\*[^*]+\*\*)/g).map((boldPart, boldIndex) => {
      if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
        return (
          <strong key={`bold-${baseIndex}-${index}-${boldIndex}`} className="font-semibold text-gray-900">
            {boldPart.slice(2, -2)}
          </strong>
        );
      }
      
      // Handle italic text
      return boldPart.split(/(\*[^*]+\*)/g).map((italicPart, italicIndex) => {
        if (italicPart.startsWith('*') && italicPart.endsWith('*') && !italicPart.startsWith('**')) {
          return (
            <em key={`italic-${baseIndex}-${index}-${boldIndex}-${italicIndex}`} className="italic text-gray-800">
              {italicPart.slice(1, -1)}
            </em>
          );
        }
        return italicPart;
      });
    });
  });
  
  return formattedParts.flat();
}

// Minimal ChatGPT-style reasoning display component
function ReasoningDisplay({ text, messageId, partIndex }: { text: string; messageId: string; partIndex: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className=" border-l-2 border-gray-300 bg-teal-50 rounded-r-md">
      <button
        className="w-full px-3 py-2 flex items-center gap-2 text-left hover:bg-gray-100 transition-colors text-sm"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-gray-600 font-medium">Thinking...</span>
        <div className="flex-1"></div>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3 text-gray-500" />
        ) : (
          <ChevronDown className="w-3 h-3 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="px-3 pb-3">
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {text}
          </div>
        </div>
      )}
    </div>
  );
}

// Tool call display component
function ToolCallDisplay({ 
  toolCall 
}: { 
  toolCall: any;
}) {
  const getToolIcon = (toolName: string) => {
    if (toolName.includes('Hospital')) return '🏥';
    if (toolName.includes('Doctor')) return '👨‍⚕️';
    if (toolName.includes('Combined')) return '🔍';
    if (toolName.includes('Recommendation')) return '🎯';
    if (toolName.includes('Compare')) return '⚖️';
    return '🔧';
  };

  const getToolDescription = (toolName: string) => {
    const descriptions: Record<string, string> = {
      'searchHealthcareCombined': 'Searching hospitals and doctors',
      'searchHospitals': 'Searching hospitals',
      'searchDoctors': 'Searching doctors',
      'getHospitalDetails': 'Getting hospital details',
      'getDoctorDetails': 'Getting doctor details',
      'getHealthcareRecommendations': 'Getting recommendations',
      'compareHealthcareOptions': 'Comparing options'
    };
    return descriptions[toolName] || `Running ${toolName}`;
  };

  return (
    <div className="mb-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{getToolIcon(toolCall.toolName)}</span>
        <span className="text-sm font-medium text-teal-800">
          {getToolDescription(toolCall.toolName)}
        </span>
        {toolCall.status === 'running' && (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
          </div>
        )}
        {toolCall.status === 'completed' && (
          <span className="text-green-600 text-sm">✓</span>
        )}
      </div>
      
      {toolCall.args && Object.keys(toolCall.args).length > 0 && (
        <div className="text-xs text-teal-700 mb-2">
          {toolCall.args.query && <span>Query: "{toolCall.args.query}"</span>}
          {toolCall.args.location && <span> • Location: {toolCall.args.location}</span>}
        </div>
      )}
      
      {toolCall.result && toolCall.status === 'completed' && (
        <div className="mt-2 p-2 bg-white border border-teal-100 rounded text-xs">
          {toolCall.result.success ? (
            <div className="text-green-700">
              ✅ {toolCall.result.message || 'Search completed successfully'}
              {toolCall.result.hospitals && (
                <div className="mt-1 text-teal-700">
                  Found {toolCall.result.hospitals.length} hospitals
                </div>
              )}
              {toolCall.result.doctors && (
                <div className="mt-1 text-teal-700">
                  Found {toolCall.result.doctors.length} doctors
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-700">
              ❌ {toolCall.result.message || toolCall.result.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Action buttons component for AI responses
function ActionButtons({ 
  messageText, 
  setInputText 
}: { 
  messageText: string; 
  setInputText: (text: string) => void; 
}) {
  const actions = extractActionButtons(messageText);
  
  if (actions.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="text-xs font-medium text-gray-500 mb-2">Suggested actions</div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => setInputText(action)}
            className="text-xs px-3 py-1.5 bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 hover:text-teal-800 rounded-lg border border-teal-200 hover:border-teal-300 transition-all duration-200 hover:shadow-sm font-medium"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AIChatAssistant({ searchContext, onFilterSuggestion }: AIChatAssistantProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Simple user context - for now just use Guest, but this could be enhanced with actual auth
  const currentUser = {
    name: 'Guest', // TODO: Replace with actual user name from auth context
    isAuthenticated: false
  };

  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  // Auto-scroll during streaming for better UX
  useEffect(() => {
    if (isGenerating && isUserAtBottom) {
      // During streaming, scroll more frequently but without animation for better performance
      const scrollInterval = setInterval(() => {
        scrollToBottom(false, false);
      }, 100);
      
      return () => clearInterval(scrollInterval);
    }
  }, [isGenerating, isUserAtBottom]);
  
  // Scroll to bottom when new messages are added (non-streaming)
  useEffect(() => {
    if (!isGenerating) {
      scrollToBottom();
    }
  }, [messages.length, isGenerating]);
  
  const sendMessage = async (options: { text: string }) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Add user message immediately
      const userMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        parts: [{
          type: 'text',
          text: options.text
        }],
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send to API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          searchContext
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Handle streaming response properly
      const assistantMessageId = `assistant-${Date.now()}`;
      let assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        parts: [] as any[],
        createdAt: new Date()
      };
      
      // Add empty assistant message that we'll update
      setMessages(prev => [...prev, assistantMessage]);
      
      // Parse AI SDK streaming response with optimized batching
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (reader) {
        let accumulatedText = '';
        let textPartId = 'text-0';
        let lastUpdateTime = 0;
        const UPDATE_INTERVAL = 50; // Update UI every 50ms for smooth streaming
        
        // Add initial text part with placeholder
        setMessages(prev => prev.map(msg => {
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
          setMessages(prev => prev.map(msg => {
            if (msg.id === assistantMessageId) {
              const updatedParts = [...msg.parts];
              const textIndex = updatedParts.findIndex(p => p.type === 'text' && p.id === textPartId);
              if (textIndex >= 0) {
                updatedParts[textIndex] = {
                  ...updatedParts[textIndex],
                  text: accumulatedText,
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
        setMessages(prev => prev.map(msg => {
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

  // Create welcome message structure
  const welcomeMessage = {
    id: 'welcome-message',
    role: 'assistant' as const,
    parts: [
      {
        type: 'text' as const,
        text: generateWelcomeMessage(searchContext)
      }
    ]
  };

  // Combine welcome message with actual messages
  const allMessages = showWelcome ? [welcomeMessage, ...messages] : messages;

  // Check if user is scrolled to bottom
  const checkIfUserAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    const container = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom
    return container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;
  };

  // Handle scroll events to track user position
  const handleScroll = () => {
    setIsUserAtBottom(checkIfUserAtBottom());
  };

  // Optimized auto-scroll behavior for smooth streaming
  const scrollToBottom = (force = false, smooth = true) => {
    if ((isUserAtBottom || force) && messagesEndRef.current) {
      // Use requestAnimationFrame for better performance during streaming
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: smooth ? 'smooth' : 'instant',
          block: 'end'
        });
      });
    }
  };

  // Custom input change handler that updates our state
  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Function to set input value programmatically - using a different approach
  const setInputText = (text: string) => {
    setInputValue(text);
    
    // Use a more direct approach - update the DOM element directly
    setTimeout(() => {
      const inputElement = document.querySelector('input[placeholder*="Ask Aira"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = text;
        inputElement.focus();
        
        // Trigger input event to notify useChat
        const inputEvent = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(inputEvent);
        
        // Also trigger change event
        const changeEvent = new Event('change', { bubbles: true });
        inputElement.dispatchEvent(changeEvent);
      }
    }, 0);
  };

  // Auto-scroll when messages change, but only if user is at bottom
  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  // Auto-scroll when loading starts (new message being typed)
  useEffect(() => {
    if (isGenerating) {
      scrollToBottom();
    }
  }, [isGenerating]);

  // Hide welcome message when user starts chatting
  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Modern Chat header */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200 bg-white">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-medifly-teal via-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">Aira</h3>
            <span className="px-2 py-1 text-xs font-medium text-teal-700 bg-teal-100 rounded-full">AI</span>
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
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
        style={{ scrollBehavior: 'auto' }} // Prevent automatic smooth scrolling from interfering
      >
        {allMessages.map((message, messageIndex) => {
          const senderName = message.role === 'user' ? currentUser.name : 'Aira';
          const timestamp = message.createdAt || new Date();
          
          return (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } ${message.id === 'welcome-message' ? 'animate-in slide-in-from-left-4 fade-in duration-700' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
              
              <div className={`max-w-[85%] flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Message Header */}
                <div className={`flex items-center gap-2 mb-1 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-xs font-medium text-gray-600">{senderName}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{formatMessageTime(timestamp)}</span>
                </div>
                
                {/* Message Content */}
                <div
                  className={`rounded-lg transition-all duration-200 will-change-auto ${
                    message.role === 'user'
                      ? 'bg-gray-700 text-white px-3 py-2 text-sm'
                      : 'bg-white border border-gray-200 shadow-sm flex flex-col relative overflow-hidden'
                  }`}
                  style={{ 
                    // Prevent layout shifts during streaming
                    minHeight: message.role === 'assistant' ? '60px' : 'auto',
                    // Use transform3d for hardware acceleration
                    transform: 'translate3d(0, 0, 0)',
                    // Prevent content jumps
                    containIntrinsicSize: message.role === 'assistant' ? '100% 60px' : 'none'
                  }}
                >
              {/* Render message parts */}
              {message.parts ? (
                message.parts.map((part: any, index: number) => {
                  switch (part.type) {
                    case 'tool-call':
                      return (
                        <div key={index} className="p-2">
                          <ToolCallDisplay toolCall={part} />
                        </div>
                      );
                    case 'text':
                      return (
                        <div key={index} className={`text-sm leading-relaxed ${
                          message.role === 'user' ? 'text-white' : 'text-gray-800 p-3 flex-1'
                        }`}>
                          <div className="whitespace-pre-wrap relative">
                            <MarkdownContent content={part.text} />
                            {/* ChatGPT-style typing cursor for streaming */}
                            {message.role === 'assistant' && part.isStreaming && (
                              <span className="inline-block w-0.5 h-4 bg-gray-900 animate-pulse ml-0.5 align-middle"></span>
                            )}
                          </div>
                          {message.role === 'assistant' && !part.isStreaming && (
                            <ActionButtons messageText={part.text} setInputText={setInputText} />
                          )}
                        </div>
                      );
                    case 'reasoning':
                      return (
                        <ReasoningDisplay
                          key={index}
                          text={part.text}
                          messageId={message.id}
                          partIndex={index}
                        />
                      );
                    case 'reasoning-start':
                      return (
                        <div key={index} className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-blue-700 font-medium">Starting analysis...</span>
                          </div>
                        </div>
                      );
                    case 'reasoning-delta':
                      return (
                        <div key={index} className="text-sm text-blue-700 leading-relaxed whitespace-pre-wrap bg-blue-50/50 p-2 rounded border-l-2 border-blue-300">
                          {part.delta || part.text}
                        </div>
                      );
                    case 'reasoning-end':
                      return (
                        <div key={index} className="mb-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">✓</span>
                            </div>
                            <span className="text-xs text-green-700 font-medium">Analysis complete</span>
                          </div>
                        </div>
                      );
                    default:
                      // Handle tool invocations and other part types
                      if (part.type.startsWith('tool-')) {
                        return (
                          <div key={index} className="mt-2 p-2 bg-white/10 rounded text-xs">
                            <strong>🔍 Tool: {part.type.replace('tool-', '')}</strong>
                            <pre>{JSON.stringify(part, null, 2)}</pre>
                          </div>
                        );
                      }
                      return null;
                  }
                })
              ) : (
                // Fallback for backwards compatibility
                <div className="text-gray-800 p-4 leading-relaxed whitespace-pre-wrap">
                  <MarkdownContent content={message.content || ''} />
                  {message.role === 'assistant' && message.content && (
                    <ActionButtons messageText={message.content} setInputText={setInputText} />
                  )}
                </div>
              )}
              
              {/* Tool results display */}
              {message.toolInvocations?.map((toolInvocation: any, index: number) => (
                <div key={index} className="mt-2 p-2 bg-white/10 rounded text-xs">
                  {toolInvocation.state === 'result' && (
                    <div>
                      <strong>🔍 Search Result:</strong>
                      {JSON.stringify(toolInvocation.result, null, 2)}
                    </div>
                  )}
                </div>
              ))}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Modern Loading indicator with stable height */}
        {isGenerating && (
          <div className="flex gap-4 justify-start min-h-[60px]">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles className="h-4 w-4 text-white animate-pulse" />
            </div>
            <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-2xl max-w-[85%] min-h-[60px] flex items-center">
              <div className="flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-small">Chat error: {error.message}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input form */}
      <div className="border-t border-gray-200 p-6 bg-white">
        <form onSubmit={(e) => {
          e.preventDefault();
          const messageText = inputValue?.trim();
          if (messageText) {
            // Auto-scroll to bottom when user sends a message
            setTimeout(() => scrollToBottom(true), 100);
            sendMessage({
              text: messageText
            });
            setInputValue('');
          }
        }} className="relative">
          <div className="relative flex items-center">
            <input
              value={inputValue}
              onChange={handleCustomInputChange}
              placeholder="Ask Aira anything about your healthcare search..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm placeholder:text-gray-500 transition-all"
              disabled={isGenerating}
            />
            <Button
              type="submit"
              disabled={isGenerating || !inputValue?.trim()}
              size="sm"
              className="absolute right-2 w-8 h-8 p-0 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
        
        {/* Modern Quick suggestions */}
        <div className="mt-4 space-y-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quick actions</div>
          <div className="flex flex-wrap gap-2">
            {getQuickSuggestions(searchContext).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputText(suggestion)}
                className="text-sm px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-teal-50 hover:to-teal-100 text-gray-700 hover:text-teal-700 rounded-xl border border-gray-200 hover:border-teal-300 transition-all duration-200 hover:shadow-sm font-medium"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate personalized welcome message based on search context
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

I searched for **"${query}"**${location ? ` in **${location}**` : ''}, but didn't find specific results. Let me help you explore other options!

🔍 **Let's try:**
• Expanding your search area
• Looking for related specialties
• Finding nearby healthcare options
• Adjusting search criteria

Just tell me what you'd prefer, and I'll help you find the right care! 🌟`;
  }

  const totalResults = hospitalCount + doctorCount;
  return `👋 **Great! I found ${totalResults} healthcare options for you**

🏥 **Search Results for "${query}"**${location ? ` in **${location}**` : ''}:
• **${hospitalCount} hospitals** with relevant services
• **${doctorCount} specialists** in your area

✨ **I can help you:**
• Filter by ratings, emergency services, or availability
• Compare your top options side by side
• Find doctors accepting new patients
• Check specific services or specialties

💬 **Just ask me anything!** I'm here to make your healthcare search easier and more personalized.`;
}

// Extract actionable prompts from AI response text
function extractActionButtons(text: string): string[] {
  const actionButtons: string[] = [];
  
  // Patterns to identify actionable content
  const patterns = [
    // "Try:" followed by suggestions
    /Try:?\s*([^.\n]+)/gi,
    // "Consider:" followed by suggestions  
    /Consider:?\s*([^.\n]+)/gi,
    // "You could:" or "You can:" followed by suggestions
    /You (?:could|can):?\s*([^.\n]+)/gi,
    // Numbered action items (1. Do something)
    /^\d+\.\s*([^.\n]+)/gm,
    // Bullet points with action verbs
    /^[•-]\s*((?:Ask|Find|Check|Compare|Look|Search|Filter|Contact|Visit|Call|Book|Schedule)[^.\n]+)/gmi,
    // Questions that could be follow-ups
    /(\?[^?]+\?)/g,
    // "What about" suggestions
    /What about\s+([^?.\n]+)/gi,
    // "How about" suggestions  
    /How about\s+([^?.\n]+)/gi,
    // Explicit next steps
    /Next(?:\s+step)?:?\s*([^.\n]+)/gi
  ];

  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Clean up the match
        let cleanMatch = match
          .replace(/^\d+\.\s*/, '') // Remove numbering
          .replace(/^[•-]\s*/, '')  // Remove bullet points
          .replace(/^(Try|Consider|You (?:could|can)|What about|How about|Next(?:\s+step)?):?\s*/i, '') // Remove prefixes
          .replace(/\?+$/, '')      // Remove trailing question marks
          .trim();
        
        // Only add if it's a reasonable length and starts with a capital letter or common action words
        if (cleanMatch.length > 10 && cleanMatch.length < 100 && 
            (/^[A-Z]/.test(cleanMatch) || /^(ask|find|check|compare|look|search|filter|contact|visit|call|book|schedule)/i.test(cleanMatch))) {
          // Convert to proper question/prompt format
          if (!cleanMatch.endsWith('?') && !cleanMatch.includes('?')) {
            cleanMatch = cleanMatch.charAt(0).toUpperCase() + cleanMatch.slice(1);
          }
          actionButtons.push(cleanMatch);
        }
      });
    }
  });

  // Remove duplicates and limit to 3-4 most relevant actions
  const uniqueActions = [...new Set(actionButtons)];
  return uniqueActions.slice(0, 4);
}

// Generate contextual quick suggestions
function getQuickSuggestions(context: AIChatAssistantProps['searchContext']): string[] {
  const { hasSearched, hospitalCount, doctorCount, relevantSpecialties, location } = context;
  
  if (!hasSearched) {
    return [
      'What services should I look for?',
      'How do you find the best hospitals?',
      'Can you explain hospital ratings?',
      'What questions should I ask doctors?'
    ];
  }

  if (hospitalCount === 0 && doctorCount === 0) {
    return [
      'Expand search to nearby areas',
      'Find related specialties',
      'Search for general hospitals',
      'Look for telehealth options'
    ];
  }

  const suggestions = [
    'Show only emergency hospitals',
    'Filter by highest ratings',
    'Find doctors accepting new patients',
    'Compare top 3 options'
  ];

  if (hospitalCount > 5) {
    suggestions.push('Show hospitals with shortest wait times');
  }

  if (doctorCount > 5) {
    suggestions.push('Filter by years of experience');
  }

  if (relevantSpecialties.length > 0) {
    suggestions.push(`Focus on ${relevantSpecialties[0]} specialists`);
  }

  if (!location) {
    suggestions.push('Add location preferences');
  } else {
    suggestions.push('Expand to nearby cities');
  }

  return suggestions.slice(0, 4); // Limit to 4 suggestions
}