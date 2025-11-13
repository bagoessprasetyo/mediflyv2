'use client';

import React from 'react';
import { AIChatAssistantAnimated } from '@/app/(public)/search/components/ai-chat-animated';

export default function ChatDemoThinking() {
  const demoContext = {
    query: 'emergency hospitals',
    location: 'Singapore',
    hasSearched: true,
    resultsCount: 15,
    hospitalCount: 10,
    doctorCount: 5,
    relevantSpecialties: ['Emergency Medicine', 'Cardiology', 'Trauma Surgery']
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-blue-600 text-white">
              <h1 className="text-2xl font-bold">Enhanced AI Chat Demo</h1>
              <p className="text-blue-100 mt-2">
                Testing thinking sections and markdown rendering
              </p>
            </div>
            <div className="h-[600px]">
              <AIChatAssistantAnimated
                searchContext={demoContext}
                onFilterSuggestion={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}