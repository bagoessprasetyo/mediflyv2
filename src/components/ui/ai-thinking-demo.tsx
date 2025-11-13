import AIThinkingBlock from "@/components/ui/ai-thinking-block";

export default function AIThinkingDemo() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">AI Thinking Block Demo</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Default Healthcare Thinking Block</h2>
          <AIThinkingBlock />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Custom Content Thinking Block</h2>
          <AIThinkingBlock 
            content="I'm analyzing this patient's symptoms and medical history. Let me consider the various treatment options available and evaluate which healthcare facilities would be most appropriate for their specific needs. This requires careful consideration of their location, insurance coverage, and the severity of their condition..."
            title="Analyzing medical options"
          />
        </div>
      </div>
    </div>
  );
}