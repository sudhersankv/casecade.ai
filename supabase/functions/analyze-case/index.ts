/*
  # Case Analysis Function

  This function provides:
  1. Timeline generation from case description
  2. Strengths and weaknesses analysis
  3. Strategic recommendations
  4. Outcome predictions
  5. Precedent matching
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CaseAnalysisRequest {
  caseId: string;
  caseDescription: string;
  caseType: string;
  jurisdiction: string;
  analysisType: 'full' | 'timeline' | 'strengths' | 'precedents';
}

interface TimelineEvent {
  date: string;
  event_title: string;
  event_description: string;
  event_type: string;
  importance_level: 'low' | 'medium' | 'high' | 'critical';
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

    const { caseId, caseDescription, caseType, jurisdiction, analysisType }: CaseAnalysisRequest = await req.json();

    // Get case details
    const { data: caseData, error: caseError } = await supabaseClient
      .from('legal_cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (caseError) {
      throw new Error(`Case not found: ${caseError.message}`);
    }

    let analysisResult: any = {};

    // Generate timeline if requested
    if (analysisType === 'full' || analysisType === 'timeline') {
      const timeline = await generateTimeline(caseDescription, caseType);
      
      // Store timeline events in database
      for (const event of timeline) {
        await supabaseClient
          .from('case_timelines')
          .insert({
            case_id: caseId,
            event_date: event.date,
            event_title: event.event_title,
            event_description: event.event_description,
            event_type: event.event_type,
            importance_level: event.importance_level
          });
      }
      
      analysisResult.timeline = timeline;
    }

    // Generate case analysis
    if (analysisType === 'full' || analysisType === 'strengths') {
      const caseAnalysis = await analyzeCaseStrengthsWeaknesses(caseDescription, caseType);
      
      // Store analysis in database
      const { data: analysisData } = await supabaseClient
        .from('case_analysis')
        .insert({
          case_id: caseId,
          analysis_type: 'comprehensive',
          strengths: caseAnalysis.strengths,
          weaknesses: caseAnalysis.weaknesses,
          recommendations: caseAnalysis.recommendations,
          outcome_prediction: caseAnalysis.outcomePredicition,
          confidence_score: caseAnalysis.outcomePredicition.probability / 100
        })
        .select()
        .single();
      
      analysisResult.analysis = caseAnalysis;
      analysisResult.analysisId = analysisData?.id;
    }

    // Find relevant precedents
    if (analysisType === 'full' || analysisType === 'precedents') {
      const precedents = await findRelevantPrecedents(caseDescription, caseType, jurisdiction);
      
      // Store precedent matches
      for (const precedent of precedents) {
        await supabaseClient
          .from('precedent_matches')
          .insert({
            case_id: caseId,
            precedent_case_id: precedent.id,
            similarity_score: parseFloat(precedent.similarity.replace('%', '')) / 100,
            matching_factors: precedent.keyPoints,
            ai_analysis: `This case shows ${precedent.similarity} similarity based on ${precedent.keyPoints.join(', ')}`
          });
      }
      
      analysisResult.precedents = precedents;
    }

    return new Response(
      JSON.stringify({
        success: true,
        caseId,
        analysis: analysisResult,
        message: 'Case analysis completed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Case analysis error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Mock timeline generation - replace with OpenAI GPT-4
async function generateTimeline(caseDescription: string, caseType: string): Promise<TimelineEvent[]> {
  // This would use OpenAI GPT-4 with a specialized prompt for legal timeline generation
  
  const mockTimeline: TimelineEvent[] = [
    {
      date: "2023-01-15",
      event_title: "Initial Incident Reported",
      event_description: "Employee reports workplace harassment to supervisor",
      event_type: "complaint",
      importance_level: "high"
    },
    {
      date: "2023-02-03",
      event_title: "Formal HR Complaint Filed",
      event_description: "Written complaint submitted to Human Resources department",
      event_type: "formal_complaint",
      importance_level: "critical"
    },
    {
      date: "2023-02-28",
      event_title: "Investigation Initiated",
      event_description: "HR begins formal investigation into harassment allegations",
      event_type: "investigation",
      importance_level: "medium"
    },
    {
      date: "2023-03-15",
      event_title: "Performance Review Meeting",
      event_description: "Sudden negative performance review following complaint",
      event_type: "retaliation",
      importance_level: "critical"
    },
    {
      date: "2023-04-10",
      event_title: "Employment Termination",
      event_description: "Employee terminated citing performance issues",
      event_type: "termination",
      importance_level: "critical"
    }
  ];

  return mockTimeline;
}

// Mock case analysis - replace with OpenAI GPT-4
async function analyzeCaseStrengthsWeaknesses(caseDescription: string, caseType: string) {
  // This would use OpenAI GPT-4 with specialized legal analysis prompts
  
  return {
    strengths: [
      "Clear temporal proximity between complaint and adverse actions",
      "Multiple witnesses to support harassment claims",
      "Documented pattern of retaliation",
      "Strong precedent cases with similar fact patterns"
    ],
    weaknesses: [
      "Some performance issues documented prior to complaint",
      "Limited direct evidence of discriminatory intent",
      "Potential statute of limitations issues for early incidents"
    ],
    recommendations: [
      "Focus on temporal proximity argument",
      "Gather additional witness testimony",
      "Analyze company's treatment of similar complaints",
      "Consider settlement negotiations based on precedent outcomes"
    ],
    outcomePredicition: {
      probability: 78,
      estimatedDamages: "$200,000 - $350,000",
      timeToResolution: "18-24 months",
      keyFactors: ["Temporal proximity", "Witness testimony", "Precedent strength"]
    }
  };
}

// Mock precedent search - replace with vector similarity search
async function findRelevantPrecedents(caseDescription: string, caseType: string, jurisdiction: string) {
  // This would use vector similarity search against the precedent_cases table
  
  return [
    {
      id: "precedent-1",
      title: "Johnson v. MegaCorp Industries",
      citation: "542 F.3d 891 (9th Cir. 2018)",
      similarity: "94%",
      outcome: "Plaintiff Victory",
      keyPoints: ["Similar timeline pattern", "Retaliation after complaint", "Performance review timing"],
      damages: "$285,000"
    },
    {
      id: "precedent-2",
      title: "Davis v. Global Tech Solutions",
      citation: "398 F.Supp.3d 445 (S.D.N.Y. 2019)",
      similarity: "89%",
      outcome: "Settlement",
      keyPoints: ["Harassment documentation", "Witness testimony", "HR investigation flaws"],
      damages: "$150,000"
    },
    {
      id: "precedent-3",
      title: "Wilson v. Enterprise Systems",
      citation: "721 F.3d 234 (5th Cir. 2020)",
      similarity: "87%",
      outcome: "Plaintiff Victory",
      keyPoints: ["Temporal proximity", "Pretext evidence", "Pattern of retaliation"],
      damages: "$320,000"
    }
  ];
}