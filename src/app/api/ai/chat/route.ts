import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

export async function POST(req: Request) {
  try {
    const { messages, searchContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('🤖 AI Chat - Processing request');
    console.log('📝 Messages count:', messages.length);
    console.log('🔍 Search context:', searchContext);
    console.log('📄 Raw messages:', JSON.stringify(messages, null, 2));

    // Use messages directly since they're already in the correct format
    console.log('✅ Using messages directly:', messages.length);
    console.log('🔄 Message structure:', JSON.stringify(messages, null, 2));
    
    try {
      // Check for required environment variables
      if (!process.env.GROQ_API_KEY) {
        console.error('❌ GROQ_API_KEY environment variable is missing');
        throw new Error('GROQ_API_KEY is required but not configured');
      }

      // Initialize Groq with AI SDK
      const groq = createGroq({
        apiKey: process.env.GROQ_API_KEY,
      });
      
      console.log('🔧 Groq client initialized successfully');

      // Use AI SDK streamText with Groq (no tools, just reasoning)
      const result = await streamText({
        model: groq('openai/gpt-oss-120b'),
        messages: messages,
        system: `You are Aira, a helpful AI Medical Concierge for MediFly.

Your role is to help patients understand their healthcare options and provide guidance about finding the right hospitals and doctors for their needs.

**IMPORTANT: Response Format**
You MUST structure your responses in this exact format:

<thinking>
[Show your internal reasoning process here. Analyze the user's question, consider the search context, think through the medical considerations, evaluate the options, and plan your response. Be thorough in your analysis.]
</thinking>

[Your final response to the user - Use **markdown formatting** to make your responses clear and well-structured. Use headings, bullet points, bold text, and code blocks when appropriate. Be warm, empathetic, and professional.]

**Your Capabilities:**
- Provide general healthcare guidance and advice
- Help interpret search results and medical information
- Explain different types of healthcare facilities and specialties
- Offer suggestions for healthcare decisions
- Answer questions about medical conditions and treatments

**Search Context Available:**
${searchContext ? `
- User's query: "${searchContext.query || ''}"
- Location: "${searchContext.location || 'Not specified'}"
- Previous search results: ${searchContext.hospitalCount || 0} hospitals, ${searchContext.doctorCount || 0} doctors found
- Relevant specialties: ${searchContext.relevantSpecialties?.join(', ') || 'None identified'}
` : 'No previous search context'}

**Important Guidelines:**
- Be warm, empathetic, and professional
- Use **markdown formatting** extensively for clear presentation:
  - Use ## for main sections, ### for subsections
  - Use **bold** for important points and key information
  - Use bullet points (- or *) for lists
  - Use numbered lists (1.) for step-by-step instructions
  - Use > for important quotes or highlights
  - Use 'code' for specific medical terms or technical details
- Use the search context to provide relevant insights about the results
- ALWAYS start with <thinking> tags to show your reasoning process
- Ask clarifying questions when needed
- Never provide direct medical advice or diagnoses
- Always recommend consulting with qualified medical professionals
- Focus on helping users understand their options and make informed decisions

Remember: Always show your thinking process in <thinking> tags before your main response, and use rich markdown formatting in your responses.`,
        temperature: 0.7
      });

      // Use AI SDK's built-in streaming response
      return result.toTextStreamResponse({
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Accel-Buffering': 'no'
        },
      });
    } catch (error: any) {
      console.error('AI Chat error:', error);
      
      // Return simple error response
      return new Response(
        JSON.stringify({ 
          error: 'AI service temporarily unavailable',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }), 
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}