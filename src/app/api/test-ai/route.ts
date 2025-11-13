import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function GET() {
  try {
    console.log('🧪 Testing OpenAI connection...');
    
    const { text } = await generateText({
      model: openai('gpt-3.5-turbo'),
      prompt: 'Say hello in exactly 3 words.',
    });

    console.log('✅ OpenAI response:', text);
    
    return Response.json({ 
      success: true, 
      response: text,
      message: 'OpenAI API is working' 
    });
  } catch (error) {
    console.error('❌ OpenAI test failed:', error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}