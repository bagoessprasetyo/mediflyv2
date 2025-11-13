"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import {
  Search,
  Mic,
  ArrowUp,
  Plus,
  FileText,
  Code,
  BookOpen,
  PenTool,
  BrainCircuit,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModernChatInterface from "./modern-chat-interface";
import type { ChatConfig, Message } from "./modern-chat-interface";

interface AIAssistantInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  searchContext?: {
    query?: string;
    location?: string;
    hospitalCount?: number;
    doctorCount?: number;
    relevantSpecialties?: string[];
  };
  className?: string;
}

export function AIAssistantInterface({
  isOpen,
  onClose,
  searchContext,
  className
}: AIAssistantInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [deepResearchEnabled, setDeepResearchEnabled] = useState(false);
  const [reasonEnabled, setReasonEnabled] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showUploadAnimation, setShowUploadAnimation] = useState(false);
  const [activeCommandCategory, setActiveCommandCategory] = useState<
    string | null
  >(null);
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandSuggestions = {
    learn: [
      "Find rehabilitation hospitals for stroke patients",
      "What are the best cardiology treatments?",
      "How does cardiac surgery work?",
      "Explain different types of medical imaging",
      "What is minimally invasive surgery?",
    ],
    code: [
      "Find specialists near me",
      "Compare hospital ratings in Singapore",
      "Search for emergency care facilities",
      "Show me top-rated orthopedic doctors",
      "Find hospitals accepting new patients",
    ],
    write: [
      "Help me prepare for a medical consultation",
      "Write questions to ask my doctor",
      "Create a health diary template",
      "Draft a medical history summary",
      "Prepare for a surgery consultation",
    ],
  };

  const handleUploadFile = () => {
    setShowUploadAnimation(true);

    // Simulate file upload with timeout
    setTimeout(() => {
      const newFile = `Medical_Record.pdf`;
      setUploadedFiles((prev) => [...prev, newFile]);
      setShowUploadAnimation(false);
    }, 1500);
  };

  const handleCommandSelect = (command: string) => {
    setInputValue(command);
    setActiveCommandCategory(null);
    
    // Automatically send the selected command
    setTimeout(() => handleSendMessage(command), 100);
  };

  const sendMessageToAPI = useCallback(async (userMessage: string) => {
    try {
      setIsLoading(true);
      
      const chatMessages = [
        ...messages.map(msg => ({
          role: msg.sender === 'right' ? ('user' as const) : ('assistant' as const),
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: userMessage
        }
      ];

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatMessages,
          searchContext
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let aiResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        aiResponse += chunk;
        
        // Update AI message in real-time
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'left') {
            lastMessage.content = aiResponse;
          } else {
            newMessages.push({
              id: Date.now() + 1,
              sender: 'left',
              type: 'text-with-thinking',
              content: aiResponse
            });
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'left',
        type: 'text',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, searchContext]);

  const handleSendMessage = useCallback((message?: string) => {
    const messageToSend = message || inputValue.trim();
    if (messageToSend) {
      // Switch to chat mode if not already
      if (!chatMode) {
        setChatMode(true);
      }
      
      // Add user message
      const userMessage: Message = {
        id: Date.now(),
        sender: 'right',
        type: 'text',
        content: messageToSend
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue("");
      
      // Send to API
      sendMessageToAPI(messageToSend);
    }
  }, [inputValue, chatMode, sendMessageToAPI]);

  // Chat configuration
  const chatConfig: ChatConfig = {
    leftPerson: {
      name: "Aira",
      avatar: "/api/placeholder/32/32" // You can replace with actual avatar
    },
    rightPerson: {
      name: "You",
      avatar: "/api/placeholder/32/32" // You can replace with actual avatar
    },
    messages: messages
  };

  // No UI config needed for modern interface

  if (!isOpen) {
    return null;
  }

  if (chatMode) {
    return (
      <div className="min-h-screen bg-white p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 z-10"
        >
          <X className="h-6 w-6" />
        </button>
        
        {/* Modern Chat Interface */}
        <ModernChatInterface
          config={chatConfig}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 z-10"
      >
        <X className="h-6 w-6" />
      </button>

        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          {/* Logo with animated gradient */}
        

          {/* Welcome message with search context */}
          <div className="mb-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 mb-2">
                {searchContext?.query ? 'Hi I am Aira' : 'Hi I am Aira'}
              </h1>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300 mb-2">
                {searchContext?.query ? 'Ready to help with your search' : 'Ready to assist you'}
              </h1>
              <p className="text-gray-500 max-w-md">
                {searchContext?.query 
                  ? `Discussing "${searchContext.query}"${searchContext.location ? ` in ${searchContext.location}` : ''}`
                  : 'Ask me about healthcare options or try one of the suggestions below'
                }
              </p>
              {searchContext && (searchContext.hospitalCount || searchContext.doctorCount) && (
                <p className="text-sm text-gray-400 mt-2">
                  Found {searchContext.hospitalCount || 0} hospitals, {searchContext.doctorCount || 0} doctors
                </p>
              )}
            </motion.div>
          </div>

          {/* Input area with integrated functions and file upload */}
          <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
            <div className="p-4">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask me about healthcare options..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full text-gray-700 text-base outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="px-4 pb-3">
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 py-1 px-2 rounded-md border border-gray-200"
                    >
                      <FileText className="w-3 h-3 text-teal-600" />
                      <span className="text-xs text-gray-700">{file}</span>
                      <button
                        onClick={() =>
                          setUploadedFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search, Deep Research, Reason functions and actions */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSearchEnabled(!searchEnabled)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    searchEnabled
                      ? "bg-teal-50 text-teal-600 hover:bg-teal-100"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
                <button
                  onClick={() => setDeepResearchEnabled(!deepResearchEnabled)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    deepResearchEnabled
                      ? "bg-teal-50 text-teal-600 hover:bg-teal-100"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={
                      deepResearchEnabled ? "text-teal-600" : "text-gray-400"
                    }
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="8" cy="8" r="3" fill="currentColor" />
                  </svg>
                  <span>Deep Research</span>
                </button>
                <button
                  onClick={() => setReasonEnabled(!reasonEnabled)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    reasonEnabled
                      ? "bg-teal-50 text-teal-600 hover:bg-teal-100"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <BrainCircuit
                    className={`w-4 h-4 ${
                      reasonEnabled ? "text-teal-600" : "text-gray-400"
                    }`}
                  />
                  <span>Reason</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                    inputValue.trim()
                      ? "bg-[#ade4ff] text-white hover:bg-[#ade4ff]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Upload files */}
            <div className="px-4 py-2 border-t border-gray-100">
              <button
                onClick={handleUploadFile}
                className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900 transition-colors"
              >
                {showUploadAnimation ? (
                  <motion.div
                    className="flex space-x-1"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 bg-[#ade4ff] rounded-full"
                        variants={{
                          hidden: { opacity: 0, y: 5 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.4,
                              repeat: Infinity,
                              repeatType: "mirror",
                              delay: i * 0.1,
                            },
                          },
                        }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Upload Medical Records</span>
              </button>
            </div>
          </div>

          {/* Command categories - Healthcare focused */}
          <div className="w-full grid grid-cols-3 gap-4 mb-4">
            <CommandButton
              icon={<BookOpen className="w-5 h-5" />}
              label="Learn"
              isActive={activeCommandCategory === "learn"}
              onClick={() =>
                setActiveCommandCategory(
                  activeCommandCategory === "learn" ? null : "learn"
                )
              }
            />
            <CommandButton
              icon={<Search className="w-5 h-5" />}
              label="Find"
              isActive={activeCommandCategory === "code"}
              onClick={() =>
                setActiveCommandCategory(
                  activeCommandCategory === "code" ? null : "code"
                )
              }
            />
            <CommandButton
              icon={<PenTool className="w-5 h-5" />}
              label="Prepare"
              isActive={activeCommandCategory === "write"}
              onClick={() =>
                setActiveCommandCategory(
                  activeCommandCategory === "write" ? null : "write"
                )
              }
            />
          </div>

          {/* Command suggestions */}
          <AnimatePresence>
            {activeCommandCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full mb-6 overflow-hidden"
              >
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700">
                      {activeCommandCategory === "learn"
                        ? "Healthcare learning"
                        : activeCommandCategory === "code"
                        ? "Find healthcare services"
                        : "Prepare for appointments"}
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {commandSuggestions[
                      activeCommandCategory as keyof typeof commandSuggestions
                    ].map((suggestion, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleCommandSelect(suggestion)}
                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-75"
                      >
                        <div className="flex items-center gap-3">
                          {activeCommandCategory === "learn" ? (
                            <BookOpen className="w-4 h-4 text-teal-600" />
                          ) : activeCommandCategory === "code" ? (
                            <Search className="w-4 h-4 text-teal-600" />
                          ) : (
                            <PenTool className="w-4 h-4 text-teal-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            {suggestion}
                          </span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
}

interface CommandButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function CommandButton({ icon, label, isActive, onClick }: CommandButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
        isActive
          ? "bg-teal-50 border-teal-200 shadow-sm"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className={`${isActive ? "text-teal-600" : "text-gray-500"}`}>
        {icon}
      </div>
      <span
        className={`text-sm font-medium ${
          isActive ? "text-teal-700" : "text-gray-700"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}