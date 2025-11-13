import { HealthcareChatDemo } from '@/components/ui/healthcare-chat-demo';

export default function HealthcareChatDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Healthcare Chat Interface Demo
        </h1>
        <HealthcareChatDemo />
      </div>
    </div>
  );
}