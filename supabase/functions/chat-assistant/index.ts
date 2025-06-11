/*
  # AI Chat Assistant Function

  This function provides:
  1. Conversational AI interface for legal questions
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
    const assistanceType = classifyUserIntent(message);

    let response = '';
    let actions: any[] = [];

    switch (assistanceType) {
      case 'case_analysis':
        response = await handleCaseAnalysisRequest(message, caseContext, supabaseClient);
        if (caseId) {
          actions.push({
            type: 'trigger_analysis',
            caseId: caseId
          });
        }
        break;

      case 'precedent_search':
        const precedents = await handlePrecedentSearchRequest(message, context, supabaseClient);
        response = formatPrecedentResponse(precedents);
        actions.push({
          type: 'show_precedents',
          precedents: precedents.slice(0, 3)
        });
        break;

      case 'timeline_generation':
        response = await handleTimelineRequest(message, caseContext);
        if (caseId) {
          actions.push({
            type: 'generate_timeline',
            caseId: caseId
          });
        }
        break;

      case 'document_analysis':
        response = await handleDocumentAnalysisRequest(message, caseContext);
        break;

      case 'legal_advice':
        response = await handleLegalAdviceRequest(message, caseContext, conversationHistory);
        break;

      default:
        response = await handleGeneralInquiry(message, caseContext);
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

// Classify user intent from message
function classifyUserIntent(message: string): string {
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

// Handle case analysis requests
async function handleCaseAnalysisRequest(message: string, caseContext: any, supabaseClient: any): Promise<string> {
  if (!caseContext) {
    return "I'd be happy to help analyze your case. Could you please provide more details about the case, or create a new case first so I can provide more specific analysis?";
  }

  // This would integrate with the analyze-case function
  return `I'll analyze your ${caseContext.case_type} case titled "${caseContext.title}". Based on the information provided, I can help you with:

1. **Timeline Analysis**: I'll create a chronological timeline of events
2. **Strengths & Weaknesses**: Identify key strengths and potential vulnerabilities
3. **Precedent Research**: Find similar cases and their outcomes
4. **Strategic Recommendations**: Suggest next steps and legal strategies

Would you like me to start with a comprehensive analysis, or focus on a specific aspect?`;
}

// Handle precedent search requests
async function handlePrecedentSearchRequest(message: string, context: any, supabaseClient: any) {
  // Extract search terms from the message
  const searchQuery = extractSearchTerms(message);
  
  // This would call the search-precedents function
  // For now, return mock data
  return [
    {
      title: "Johnson v. MegaCorp Industries",
      citation: "542 F.3d 891 (9th Cir. 2018)",
      similarity: "94%",
      outcome: "Plaintiff Victory",
      relevance: "Similar employment discrimination pattern"
    },
    {
      title: "Davis v. Global Tech Solutions", 
      citation: "398 F.Supp.3d 445 (S.D.N.Y. 2019)",
      similarity: "89%",
      outcome: "Settlement",
      relevance: "Comparable harassment documentation"
    }
  ];
}

// Handle timeline generation requests
async function handleTimelineRequest(message: string, caseContext: any): Promise<string> {
  if (!caseContext) {
    return "To generate a timeline, I'll need case details. Please provide information about the key events, dates, and circumstances of your case.";
  }

  return `I'll generate a comprehensive timeline for your case. This will include:

1. **Chronological Event Sequence**: All key dates and events in order
2. **Critical Moments**: Events that could significantly impact your case
3. **Temporal Relationships**: How events relate to each other in time
4. **Legal Deadlines**: Important statute of limitations and filing deadlines

The timeline will help visualize the case progression and identify strategic opportunities.`;
}

// Handle document analysis requests
async function handleDocumentAnalysisRequest(message: string, caseContext: any): Promise<string> {
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

// Handle legal advice requests
async function handleLegalAdviceRequest(message: string, caseContext: any, history: any[]): Promise<string> {
  return `I can provide general legal information and strategic insights based on your case details. Please note that this is informational guidance, not formal legal advice.

Based on your case information, I can help with:

1. **Strategic Options**: Different approaches you might consider
2. **Risk Assessment**: Potential challenges and opportunities
3. **Precedent Insights**: How similar cases have been resolved
4. **Next Steps**: Recommended actions and timeline

What specific aspect would you like guidance on?`;
}

// Handle general inquiries
async function handleGeneralInquiry(message: string, caseContext: any): Promise<string> {
  return `I'm your AI Legal Assistant, here to help with case analysis, legal research, and strategic planning. I can:

• **Analyze Cases**: Generate timelines, identify strengths/weaknesses
• **Find Precedents**: Search 2.3M+ legal cases for relevant precedents
• **Review Documents**: Extract key information from legal documents
• **Provide Insights**: Strategic recommendations based on similar cases

How can I assist you with your legal work today?`;
}

// Extract search terms from natural language
function extractSearchTerms(message: string): string {
  // Simple extraction - in production, use NLP to better understand intent
  const terms = message
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter(word => word.length > 3)
    .join(' ');
  
  return terms;
}

// Format precedent search results for response
function formatPrecedentResponse(precedents: any[]): string {
  if (precedents.length === 0) {
    return "I didn't find any closely matching precedents for your query. Try refining your search terms or broadening the criteria.";
  }

  let response = `I found ${precedents.length} relevant precedent cases:\n\n`;
  
  precedents.slice(0, 3).forEach((precedent, index) => {
    response += `**${index + 1}. ${precedent.title}**\n`;
    response += `Citation: ${precedent.citation}\n`;
    response += `Similarity: ${precedent.similarity}\n`;
    response += `Outcome: ${precedent.outcome}\n`;
    response += `Relevance: ${precedent.relevance}\n\n`;
  });

  if (precedents.length > 3) {
    response += `And ${precedents.length - 3} more cases. Would you like to see additional results?`;
  }

  return response;
}