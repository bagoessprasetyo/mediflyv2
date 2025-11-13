"use client";

import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { useEffect, useRef, useState } from "react";

interface AIThinkingBlockProps {
  content?: string;
  title?: string;
  className?: string;
}

export default function AIThinkingBlock({ 
  content,
  title = "Aira is thinking",
  className 
}: AIThinkingBlockProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const defaultThinkingContent = `I need to carefully analyze this healthcare query to provide the most helpful and accurate information.

First, let me consider what the user is asking for. They're looking for medical guidance, which means I need to be particularly careful to provide helpful information while avoiding direct medical diagnosis or treatment advice.

I should consider the search context if available. This includes any previous search results for hospitals, doctors, or medical specialties that might be relevant to their question.

Let me think about the most appropriate way to structure my response. I should use clear markdown formatting to make the medical information easy to read and understand. This might include:

- Using headers to organize different aspects of their healthcare query
- Bullet points for listing different options or considerations
- Bold text to highlight important medical terms or key information
- Proper formatting for any medical guidelines or steps they should follow

I need to make sure my response is warm and empathetic, as healthcare concerns can be stressful for patients. At the same time, I must maintain professional standards and always recommend consulting with qualified medical professionals.

If there are specific hospitals or doctors in the search results, I should help them understand how to evaluate these options, what questions to ask, and what factors to consider when making healthcare decisions.

I should also consider any relevant specialties or treatments that might apply to their situation, helping them understand the different types of care available and when each might be appropriate.

Throughout my response, I'll maintain MediFly's focus on helping patients navigate the healthcare system effectively while always emphasizing the importance of professional medical consultation for actual medical decisions.`;

  const thinkingContent = content || defaultThinkingContent;

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      const clientHeight = contentRef.current.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      scrollIntervalRef.current = setInterval(() => {
        setScrollPosition((prev) => {
          const newPosition = prev + 1;
          if (newPosition >= maxScroll) {
            return 0;
          }
          return newPosition;
        });
      }, 8); // Slower scroll for better readability

      return () => {
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
        }
      };
    }
  }, [thinkingContent]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <>
      <div className={`flex flex-col p-4 max-w-2xl ${className || ''}`}>
        <div className="flex items-center justify-start gap-3 mb-4">
          <Loader size="sm" variant="primary" />
          <p
            className="bg-gradient-to-r from-teal-600 via-teal-400 to-teal-600 bg-[length:200%_100%] bg-clip-text text-base font-medium text-transparent animate-pulse"
            style={{
              animation: "shimmer 3s linear infinite",
            }}
          >
            {title}
          </p>
          <span className="text-sm text-muted-foreground font-mono">
            {timer}s
          </span>
          <style jsx>{`
            @keyframes shimmer {
              0% {
                background-position: 200% 0;
              }
              100% {
                background-position: -200% 0;
              }
            }
          `}</style>
        </div>
        
        <Card className="relative h-[180px] overflow-hidden bg-gradient-to-br from-teal-50/50 via-white to-cyan-50/30 border border-teal-200/60 shadow-sm">
          {/* Top fade overlay */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white/90 via-white/70 to-transparent z-10 pointer-events-none h-[60px]" />

          {/* Bottom fade overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 via-white/70 to-transparent z-10 pointer-events-none h-[60px]" />

          {/* Scrolling content */}
          <div
            ref={contentRef}
            className="h-full overflow-hidden p-4 text-gray-700"
            style={{
              scrollBehavior: "auto",
            }}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {thinkingContent}
            </p>
          </div>
          
          {/* Subtle border glow */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500/10 to-cyan-500/10 pointer-events-none" />
        </Card>
      </div>
    </>
  );
}