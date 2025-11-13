'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone, 
  Mail, 
  Clock,
  User,
  Bot
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Sarah, your healthcare advisor. How can I help you find the right specialist today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    'Find a cardiologist',
    'Compare destinations', 
    'Get pricing info',
    'Schedule consultation'
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message! Let me connect you with the right specialist. Could you tell me more about your specific health concern?',
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: action,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate response based on action
    setIsTyping(true);
    setTimeout(() => {
      let responseText = '';
      switch (action) {
        case 'Find a cardiologist':
          responseText = 'I can help you find top cardiologists across our network. Which region are you considering? We have excellent specialists in Malaysia, Singapore, and Thailand.';
          break;
        case 'Compare destinations':
          responseText = 'Great! I can show you our most popular destinations. What type of treatment are you looking for? This will help me recommend the best locations.';
          break;
        case 'Get pricing info':
          responseText = 'I\'d be happy to provide pricing information. What specific procedure or consultation are you interested in?';
          break;
        case 'Schedule consultation':
          responseText = 'Perfect! I can help you schedule a consultation. Would you prefer a virtual consultation first, or would you like to book directly with a specialist?';
          break;
        default:
          responseText = 'Thank you for reaching out! How can I best assist you today?';
      }

      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full gradient-teal text-white shadow-lifted hover:shadow-float group relative"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            1
          </div>
          
          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-full bg-medifly-teal opacity-30 animate-ping" />
        </Button>
        
        {/* Tooltip */}
        <div className="absolute bottom-20 right-0 bg-medifly-dark text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Talk to a healthcare advisor
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-float border-0 overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-medifly-teal text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
                <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-white">Healthcare Advisor</CardTitle>
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  Online now
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick stats */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
            <Badge className="bg-white/20 text-white border-0 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Usually replies in 2 min
            </Badge>
            <div className="text-xs text-white/80">500+ Specialists Available</div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="p-0">
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender !== 'user' && (
                  <div className="w-7 h-7 bg-medifly-teal rounded-full flex items-center justify-center flex-shrink-0">
                    {message.sender === 'bot' ? (
                      <Bot className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                )}
                
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-medifly-teal text-white'
                      : 'bg-gray-100 text-medifly-dark'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-medifly-teal rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="text-xs text-medifly-gray mb-3">Quick actions:</div>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    className="text-xs h-8 hover:bg-medifly-teal hover:text-white hover:border-medifly-teal"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medifly-teal focus:border-transparent"
              />
              <Button 
                onClick={handleSendMessage}
                className="gradient-teal text-white px-3"
                disabled={!inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Alternative contact */}
            <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <Button variant="ghost" size="sm" className="text-xs">
                <Phone className="h-3 w-3 mr-1" />
                Call Us
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}