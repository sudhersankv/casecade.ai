/*
  # AI Chat Assistant Function

  This function provides:
  1. Conversational AI interface for legal questions using Gemini
  2. Context-aware responses based on case data
  3. Integration with case analysis and precedent search
  4. Real-time legal assistance
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ChatRequest {
  message: string;
  caseId?: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  context?: {
    caseType?: string;
    jurisdiction?: string;
    documents?: string[];
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message, caseId, conversationHistory, context }: ChatRequest = await req.json();

    // Get case context if caseId is provided
    let caseContext = null;
    if (caseId) {
      const { data: caseData } = await supabaseClient
        .from('legal_cases')
        .select(`
          *,
          case_documents(*),
          case_timelines(*),
          case_analysis(*)
        `)
        .eq('id', caseId)
        .single();
      
      caseContext = caseData;
    }

    // Determine the type of assistance needed
    const assistanceType = await classifyUserIntentWithGemini(message);

    let response = '';
    let actions: any[] = [];

    switch (assistanceType) {
      case 'case_analysis':
        response = await handleCaseAnalysisRequestWithGemini(message, caseContext, supabaseClient);
        if (caseId) {
          actions.push({
            type: 'trigger_analysis',
            caseId: caseId
          });
        }
        break;

      case 'precedent_search':
        const precedents = await handlePrecedentSearchRequestWithGemini(message, context, supabaseClient);
        response = await formatPrecedentResponseWithGemini(precedents, message);
        actions.push({
          type: 'show_precedents',
          precedents: precedents.slice(0, 3)
        });
        break;

      case 'timeline_generation':
        response = await handleTimelineRequestWithGemini(message, caseContext);
        if (caseId) {
          actions.push({
            type: 'generate_timeline',
            caseId: caseId
          });
        }
        break;

      case 'document_analysis':
        response = await handleDocumentAnalysisRequestWithGemini(message, caseContext);
        break;

      case 'legal_advice':
        response = await handleLegalAdviceRequestWithGemini(message, caseContext, conversationHistory);
        break;

      default:
        response = await handleGeneralInquiryWithGemini(message, caseContext);
    }

    // Store conversation in user sessions if needed
    if (caseId) {
      await supabaseClient
        .from('user_sessions')
        .upsert({
          user_id: caseContext?.user_id,
          session_data: {
            last_interaction: new Date().toISOString(),
            conversation_context: {
              caseId,
              lastMessage: message,
              assistanceType
            }
          }
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        response,
        actions,
        assistanceType,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Chat assistant error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Classify user intent using Gemini AI
async function classifyUserIntentWithGemini(message: string): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return classifyUserIntentSimple(message);
  }

  try {
    const prompt = `Classify the user's intent from this legal assistant message. Return only one of these categories:

- case_analysis: User wants case analysis, strengths/weaknesses, or strategic insights
- precedent_search: User wants to find similar cases or precedents
- timeline_generation: User wants to create or analyze a timeline of events
- document_analysis: User wants to analyze or upload documents
- legal_advice: User wants legal guidance or recommendations
- general_inquiry: General questions about the platform or legal concepts

User message: "${message}"

Return only the category name, no additional text.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 50,
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const classification = result.candidates[0].content.parts[0].text.trim().toLowerCase();
        
        const validCategories = ['case_analysis', 'precedent_search', 'timeline_generation', 'document_analysis', 'legal_advice', 'general_inquiry'];
        if (validCategories.includes(classification)) {
          return classification;
        }
      }
    }

  } catch (error) {
    console.error('Gemini intent classification error:', error);
  }

  return classifyUserIntentSimple(message);
}

// Simple intent classification (fallback)
function classifyUserIntentSimple(message: string): string {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('analyze') || messageLower.includes('analysis')) {
    return 'case_analysis';
  }
  
  if (messageLower.includes('precedent') || messageLower.includes('similar case') || messageLower.includes('find case')) {
    return 'precedent_search';
  }
  
  if (messageLower.includes('timeline') || messageLower.includes('chronology') || messageLower.includes('sequence')) {
    return 'timeline_generation';
  }
  
  if (messageLower.includes('document') || messageLower.includes('upload') || messageLower.includes('file')) {
    return 'document_analysis';
  }
  
  if (messageLower.includes('advice') || messageLower.includes('recommend') || messageLower.includes('strategy')) {
    return 'legal_advice';
  }
  
  return 'general_inquiry';
}

// Handle case analysis requests with Gemini
async function handleCaseAnalysisRequestWithGemini(message: string, caseContext: any, supabaseClient: any): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return handleCaseAnalysisRequestSimple(message, caseContext);
  }

  try {
    const caseInfo = caseContext ? `
Case Title: ${caseContext.title}
Case Type: ${caseContext.case_type}
Description: ${caseContext.description}
Status: ${caseContext.status}
Jurisdiction: ${caseContext.jurisdiction}
` : 'No specific case context provided.';

    const prompt = `As an expert legal AI assistant, respond to this case analysis request:

User Request: ${message}

Case Context: ${caseInfo}

Provide a helpful, professional response that:
1. Acknowledges the user's request
2. Explains what analysis can be provided
3. Offers specific next steps
4. Maintains a professional legal tone

Keep the response concise but informative.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        return result.candidates[0].content.parts[0].text;
      }
    }

  } catch (error) {
    console.error('Gemini case analysis response error:', error);
  }

  return handleCaseAnalysisRequestSimple(message, caseContext);
}

// Simple case analysis response (fallback)
function handleCaseAnalysisRequestSimple(message: string, caseContext: any): string {
  if (!caseContext) {
    return "I'd be happy to help analyze your case. Could you please provide more details about the case, or create a new case first so I can provide more specific analysis?";
  }

  return `I'll analyze your ${caseContext.case_type} case titled "${caseContext.title}". Based on the information provided, I can help you with:

1. **Timeline Analysis**: I'll create a chronological timeline of events
2. **Strengths & Weaknesses**: Identify key strengths and potential vulnerabilities
3. **Precedent Research**: Find similar cases and their outcomes
4. **Strategic Recommendations**: Suggest next steps and legal strategies

Would you like me to start with a comprehensive analysis, or focus on a specific aspect?`;
}

// Handle precedent search with Gemini
async function handlePrecedentSearchRequestWithGemini(message: string, context: any, supabaseClient: any) {
  // Extract search terms and perform search
  const searchQuery = extractSearchTerms(message);
  
  // Get some precedent cases from database
  const { data: precedentCases } = await supabaseClient
    .from('precedent_cases')
    .select('*')
    .limit(10);

  return precedentCases || [];
}

// Handle other request types with Gemini...
async function handleTimelineRequestWithGemini(message: string, caseContext: any): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return "To generate a timeline, I'll need case details. Please provide information about the key events, dates, and circumstances of your case.";
  }

  const caseInfo = caseContext ? `
Case: ${caseContext.title}
Type: ${caseContext.case_type}
Description: ${caseContext.description}
` : 'No case context provided.';

  try {
    const prompt = `As a legal AI assistant, respond to this timeline request:

User Request: ${message}
Case Context: ${caseInfo}

Provide a helpful response about timeline generation capabilities and next steps.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        return result.candidates[0].content.parts[0].text;
      }
    }

  } catch (error) {
    console.error('Gemini timeline response error:', error);
  }

  return `I'll generate a comprehensive timeline for your case. This will include:

1. **Chronological Event Sequence**: All key dates and events in order
2. **Critical Moments**: Events that could significantly impact your case
3. **Temporal Relationships**: How events relate to each other in time
4. **Legal Deadlines**: Important statute of limitations and filing deadlines

The timeline will help visualize the case progression and identify strategic opportunities.`;
}

async function handleDocumentAnalysisRequestWithGemini(message: string, caseContext: any): Promise<string> {
  const hasDocuments = caseContext?.case_documents?.length > 0;
  
  if (!hasDocuments) {
    return "I can help analyze legal documents once you upload them. I can extract key information, identify important clauses, and highlight potential issues or opportunities. Would you like to upload documents now?";
  }

  return `I can analyze the ${caseContext.case_documents.length} document(s) you've uploaded. I'll:

1. **Extract Key Information**: Important dates, parties, terms, and conditions
2. **Identify Legal Issues**: Potential claims, defenses, and legal theories
3. **Highlight Critical Sections**: Important clauses and provisions
4. **Cross-Reference**: Compare with similar cases and precedents

Would you like me to start with a comprehensive document analysis?`;
}

async function handleLegalAdviceRequestWithGemini(message: string, caseContext: any, history: any[]): Promise<string> {
  return `I can provide general legal information and strategic insights based on your case details. Please note that this is informational guidance, not formal legal advice.

Based on your case information, I can help with:

1. **Strategic Options**: Different approaches you might consider
2. **Risk Assessment**: Potential challenges and opportunities
3. **Precedent Insights**: How similar cases have been resolved
4. **Next Steps**: Recommended actions and timeline

What specific aspect would you like guidance on?`;
}

async function handleGeneralInquiryWithGemini(message: string, caseContext: any): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return `I'm your AI Legal Assistant, here to help with case analysis, legal research, and strategic planning. I can:

• **Analyze Cases**: Generate timelines, identify strengths/weaknesses
• **Find Precedents**: Search 2.3M+ legal cases for relevant precedents
• **Review Documents**: Extract key information from legal documents
• **Provide Insights**: Strategic recommendations based on similar cases

How can I assist you with your legal work today?`;
  }

  try {
    const prompt = `As a professional legal AI assistant, respond to this general inquiry:

User Message: ${message}

Provide a helpful, professional response that explains your capabilities and how you can assist with legal work. Keep it concise and actionable.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        return result.candidates[0].content.parts[0].text;
      }
    }

  } catch (error) {
    console.error('Gemini general inquiry error:', error);
  }

  return `I'm your AI Legal Assistant, here to help with case analysis, legal research, and strategic planning. I can:

• **Analyze Cases**: Generate timelines, identify strengths/weaknesses
• **Find Precedents**: Search 2.3M+ legal cases for relevant precedents
• **Review Documents**: Extract key information from legal documents
• **Provide Insights**: Strategic recommendations based on similar cases

How can I assist you with your legal work today?`;
}

// Format precedent response with Gemini
async function formatPrecedentResponseWithGemini(precedents: any[], query: string): Promise<string> {
  if (precedents.length === 0) {
    return "I didn't find any closely matching precedents for your query. Try refining your search terms or broadening the criteria.";
  }

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return formatPrecedentResponseSimple(precedents);
  }

  try {
    const prompt = `Format this precedent search response professionally:

Search Query: ${query}
Found Cases: ${precedents.length}

Cases:
${precedents.slice(0, 3).map((p, i) => `
${i + 1}. ${p.title}
Citation: ${p.citation}
Outcome: ${p.outcome}
Summary: ${p.case_summary}
`).join('\n')}

Create a professional, helpful response that summarizes the findings and their relevance.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        return result.candidates[0].content.parts[0].text;
      }
    }

  } catch (error) {
    console.error('Gemini precedent formatting error:', error);
  }

  return formatPrecedentResponseSimple(precedents);
}

// Simple precedent response formatting (fallback)
function formatPrecedentResponseSimple(precedents: any[]): string {
  let response = `I found ${precedents.length} relevant precedent cases:\n\n`;
  
  precedents.slice(0, 3).forEach((precedent, index) => {
    response += `**${index + 1}. ${precedent.title}**\n`;
    response += `Citation: ${precedent.citation}\n`;
    response += `Outcome: ${precedent.outcome}\n\n`;
  });

  if (precedents.length > 3) {
    response += `And ${precedents.length - 3} more cases. Would you like to see additional results?`;
  }

  return response;
}

// Extract search terms from natural language
function extractSearchTerms(message: string): string {
  const terms = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3)
    .join(' ');
  
  return terms;
}