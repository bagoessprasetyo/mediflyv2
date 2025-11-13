'use client';

import React from 'react';
import ChatComponent, { ChatConfig, UiConfig } from "@/components/ui/chat-interface";

export default function ChatDemo() {
  // ==========================================
  // UI CONFIGURATION - MediFly Theme
  // ==========================================
  const uiConfig: UiConfig = {
    // Container dimensions
    containerWidth: 550,                    // Width of the chat container in pixels
    containerHeight: 450,                   // Height of the chat container in pixels
    backgroundColor: '#F8FAFC',             // Light healthcare-friendly background

    // Auto-restart settings
    autoRestart: true,                      // Enable/disable auto restart after all messages
    restartDelay: 4000,                     // Delay in ms before restarting (4 seconds)

    // Loading indicator
    loader: {
      dotColor: '#3B82F6'                   // Blue loading dots matching healthcare theme
    },

    // Link badges styling
    linkBubbles: {
      backgroundColor: '#EFF6FF',           // Light blue background
      textColor: '#1E40AF',                 // Deep blue text
      iconColor: '#3B82F6',                 // Medium blue icon
      borderColor: '#BFDBFE'                // Light blue border
    },

    // Left side chat bubbles (Patient/User)
    leftChat: {
      backgroundColor: '#FFFFFF',           // White background for user messages
      textColor: '#1F2937',                 // Dark gray text
      borderColor: '#E5E7EB',               // Light gray border
      showBorder: true,                     // Show border for clarity
      nameColor: '#6B7280'                  // Medium gray for username
    },

    // Right side chat bubbles (MediFly AI/Doctor)
    rightChat: {
      backgroundColor: '#3B82F6',           // Medical blue background
      textColor: '#FFFFFF',                 // White text for contrast
      borderColor: '#2563EB',               // Darker blue border
      showBorder: false,                    // No border needed with strong background
      nameColor: '#93C5FD'                  // Light blue for username
    }
  };

  // ==========================================
  // CHAT CONFIGURATION - Healthcare Scenario
  // ==========================================
  const chatConfig: ChatConfig = {
    // Chat participants
    leftPerson: {
      name: "Sarah",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face&auto=format"
    },
    rightPerson: {
      name: "Dr. MediFly AI",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face&auto=format"
    },

    // Healthcare conversation sequence
    messages: [
      {
        id: 1,
        sender: 'left',
        type: 'text',
        content: 'Hi! I\'ve been having chest pain and shortness of breath. Can you help me find a cardiologist nearby?',
        maxWidth: 'max-w-sm',
        loader: {
          enabled: true,
          delay: 1000,
          duration: 2000
        }
      },
      {
        id: 2,
        sender: 'right',
        type: 'text',
        content: 'I understand your concern about chest pain and breathing issues. Let me help you find qualified cardiologists in your area right away.',
        maxWidth: 'max-w-md',
        loader: {
          enabled: true,
          delay: 3500,
          duration: 2500
        }
      },
      {
        id: 3,
        sender: 'right',
        type: 'text-with-links',
        content: 'I found several excellent cardiologists near you. Here are some additional resources while you wait:',
        maxWidth: 'max-w-sm',
        links: [
          {
            text: 'Emergency Guidelines'
          },
          {
            text: 'Heart Health Tips'
          },
          {
            text: 'Insurance Info'
          }
        ],
        loader: {
          enabled: true,
          delay: 6500,
          duration: 2000
        }
      },
      {
        id: 4,
        sender: 'left',
        type: 'text',
        content: 'Thank you! That\'s very helpful. How quickly can I get an appointment?',
        loader: {
          enabled: true,
          delay: 9000,
          duration: 1500
        }
      },
      {
        id: 5,
        sender: 'right',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop&auto=format',
        loader: {
          enabled: true,
          delay: 11000,
          duration: 2000
        }
      },
      {
        id: 6,
        sender: 'right',
        type: 'text',
        content: 'Most of our partner cardiologists have same-day or next-day availability for urgent concerns like yours. I\'ll connect you with their scheduling team now.',
        maxWidth: 'max-w-md',
        loader: {
          enabled: true,
          delay: 13500,
          duration: 2000
        }
      }
    ]
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">MediFly AI Chat Interface</h1>
          <p className="text-gray-600">Healthcare-focused conversation with smooth animations</p>
        </div>
        <ChatComponent config={chatConfig} uiConfig={uiConfig} />
        <div className="text-center text-sm text-gray-500 max-w-md">
          <p>This demo showcases the animated chat interface with healthcare-themed styling, sequential message loading, and interactive elements.</p>
        </div>
      </div>
    </div>
  );
}