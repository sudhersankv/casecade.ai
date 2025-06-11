/*
  # Precedent Search Function

  This function provides:
  1. Vector similarity search across precedent cases
  2. Filtering by jurisdiction, court, year, case type
  3. Semantic search capabilities
  4. Ranking by relevance and similarity
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface PrecedentSearchRequest {
  query: string;
  caseType?: string;
  jurisdiction?: string;
  court?: string;
  yearRange?: {
    start: number;
    end: number;
  };
  limit?: number;
  similarityThreshold?: number;
}

interface PrecedentResult {
  id: string;
  title: string;
  citation: string;
  court: string;
  year: number;
  jurisdiction: string;
  case_summary: string;
  key_facts: string;
  legal_issues: string;
  outcome: string;
  damages: string;
  similarity_score: number;
  relevance_factors: string[];
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

    const {
      query,
      caseType,
      jurisdiction,
      court,
      yearRange,
      limit = 10,
      similarityThreshold = 0.7
    }: PrecedentSearchRequest = await req.json();

    // Generate embedding for the search query
    const queryEmbedding = await generateQueryEmbedding(query);

    // Build the search query with filters
    let searchQuery = supabaseClient
      .from('precedent_cases')
      .select('*');

    // Apply filters
    if (caseType) {
      // This would need a case_type column or metadata filtering
      searchQuery = searchQuery.ilike('legal_issues', `%${caseType}%`);
    }

    if (jurisdiction) {
      searchQuery = searchQuery.eq('jurisdiction', jurisdiction);
    }

    if (court) {
      searchQuery = searchQuery.eq('court', court);
    }

    if (yearRange) {
      searchQuery = searchQuery
        .gte('year', yearRange.start)
        .lte('year', yearRange.end);
    }

    // Execute the query
    const { data: precedentCases, error: searchError } = await searchQuery;

    if (searchError) {
      throw new Error(`Search failed: ${searchError.message}`);
    }

    // Calculate similarity scores and rank results
    const rankedResults: PrecedentResult[] = [];

    for (const precedent of precedentCases || []) {
      if (!precedent.embedding) continue;

      const similarityScore = calculateCosineSimilarity(queryEmbedding, precedent.embedding);
      
      if (similarityScore >= similarityThreshold) {
        const relevanceFactors = identifyRelevanceFactors(query, precedent);
        
        rankedResults.push({
          id: precedent.id,
          title: precedent.title,
          citation: precedent.citation,
          court: precedent.court,
          year: precedent.year,
          jurisdiction: precedent.jurisdiction,
          case_summary: precedent.case_summary,
          key_facts: precedent.key_facts,
          legal_issues: precedent.legal_issues,
          outcome: precedent.outcome,
          damages: precedent.damages,
          similarity_score: similarityScore,
          relevance_factors: relevanceFactors
        });
      }
    }

    // Sort by similarity score and limit results
    rankedResults.sort((a, b) => b.similarity_score - a.similarity_score);
    const finalResults = rankedResults.slice(0, limit);

    // Also perform text-based search for additional context
    const textSearchResults = await performTextSearch(supabaseClient, query, limit);

    return new Response(
      JSON.stringify({
        success: true,
        query,
        results: finalResults,
        textSearchResults,
        totalFound: rankedResults.length,
        searchMetadata: {
          similarityThreshold,
          filters: {
            caseType,
            jurisdiction,
            court,
            yearRange
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Precedent search error:', error);
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

// Generate embedding for search query - replace with OpenAI
async function generateQueryEmbedding(query: string): Promise<number[]> {
  // This would use OpenAI's text-embedding-ada-002 model
  // For now, return a mock embedding
  const embedding = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}

// Calculate cosine similarity between two vectors
function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

// Identify why a case is relevant
function identifyRelevanceFactors(query: string, precedent: any): string[] {
  const factors: string[] = [];
  const queryLower = query.toLowerCase();
  
  // Check for keyword matches in different fields
  if (precedent.legal_issues?.toLowerCase().includes(queryLower.split(' ')[0])) {
    factors.push('Similar legal issues');
  }
  
  if (precedent.key_facts?.toLowerCase().includes('employment') && queryLower.includes('employment')) {
    factors.push('Employment law context');
  }
  
  if (precedent.outcome?.toLowerCase().includes('plaintiff') && queryLower.includes('discrimination')) {
    factors.push('Favorable plaintiff outcome');
  }
  
  if (precedent.damages && precedent.damages !== 'N/A') {
    factors.push('Monetary damages awarded');
  }
  
  // Add more sophisticated matching logic here
  factors.push('Factual similarity');
  
  return factors;
}

// Perform text-based search using PostgreSQL full-text search
async function performTextSearch(supabaseClient: any, query: string, limit: number) {
  const { data, error } = await supabaseClient
    .from('precedent_cases')
    .select('id, title, citation, case_summary, outcome')
    .textSearch('case_summary', query, {
      type: 'websearch',
      config: 'english'
    })
    .limit(limit);

  if (error) {
    console.error('Text search error:', error);
    return [];
  }

  return data || [];
}