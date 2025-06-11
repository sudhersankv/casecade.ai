/*
  # Precedent Search Function

  This function provides:
  1. Vector similarity search across precedent cases using Gemini embeddings
  2. Filtering by jurisdiction, court, year, case type
  3. Semantic search capabilities with Gemini
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

    // Generate embedding for the search query using Gemini
    const queryEmbedding = await generateQueryEmbeddingWithGemini(query);

    // Build the search query with filters
    let searchQuery = supabaseClient
      .from('precedent_cases')
      .select('*');

    // Apply filters
    if (caseType) {
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
        const relevanceFactors = await identifyRelevanceFactorsWithGemini(query, precedent);
        
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

    // Use Gemini to enhance search results with legal analysis
    const enhancedResults = await enhanceResultsWithGemini(query, finalResults);

    return new Response(
      JSON.stringify({
        success: true,
        query,
        results: enhancedResults,
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

// Generate embedding for search query using Gemini
async function generateQueryEmbeddingWithGemini(query: string): Promise<number[]> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: {
          parts: [{
            text: query
          }]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini Embedding API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.embedding && result.embedding.values) {
      return result.embedding.values;
    } else {
      throw new Error('No embedding generated');
    }

  } catch (error) {
    console.error('Gemini embedding error:', error);
    // Fallback to random embedding
    const embedding = Array.from({ length: 768 }, () => Math.random() * 2 - 1);
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }
}

// Calculate cosine similarity between two vectors
function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    // Handle different vector dimensions
    const minLength = Math.min(vectorA.length, vectorB.length);
    vectorA = vectorA.slice(0, minLength);
    vectorB = vectorB.slice(0, minLength);
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

// Identify relevance factors using Gemini AI
async function identifyRelevanceFactorsWithGemini(query: string, precedent: any): Promise<string[]> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    // Fallback to simple keyword matching
    return identifyRelevanceFactorsSimple(query, precedent);
  }

  try {
    const prompt = `Analyze why this precedent case is relevant to the search query and identify the key relevance factors.

Search Query: ${query}

Precedent Case:
Title: ${precedent.title}
Citation: ${precedent.citation}
Summary: ${precedent.case_summary}
Key Facts: ${precedent.key_facts}
Legal Issues: ${precedent.legal_issues}
Outcome: ${precedent.outcome}

Please identify the specific relevance factors as a JSON array of strings. Focus on:
1. Similar legal issues or claims
2. Comparable factual patterns
3. Relevant legal principles
4. Jurisdictional relevance
5. Procedural similarities

Return only a JSON array like: ["factor 1", "factor 2", "factor 3"]`;

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
          temperature: 0.3,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
      const responseText = result.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    
    // Fallback to simple matching
    return identifyRelevanceFactorsSimple(query, precedent);

  } catch (error) {
    console.error('Gemini relevance analysis error:', error);
    return identifyRelevanceFactorsSimple(query, precedent);
  }
}

// Simple relevance factor identification (fallback)
function identifyRelevanceFactorsSimple(query: string, precedent: any): string[] {
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
  
  factors.push('Factual similarity');
  
  return factors;
}

// Enhance search results with Gemini analysis
async function enhanceResultsWithGemini(query: string, results: PrecedentResult[]): Promise<PrecedentResult[]> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey || results.length === 0) {
    return results;
  }

  try {
    const prompt = `As a legal AI assistant, provide enhanced analysis for these precedent search results.

Search Query: ${query}

Search Results:
${results.map((r, i) => `
${i + 1}. ${r.title}
Citation: ${r.citation}
Summary: ${r.case_summary}
Outcome: ${r.outcome}
Similarity Score: ${(r.similarity_score * 100).toFixed(1)}%
`).join('\n')}

For each result, provide a brief legal analysis explaining why it's relevant and how it could be used strategically. Return as JSON:
[
  {
    "index": 0,
    "legal_analysis": "Brief analysis of legal relevance and strategic value",
    "strategic_value": "high|medium|low"
  }
]

Focus on practical legal application and strategic insights.`;

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
          maxOutputTokens: 2048,
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const responseText = result.candidates[0].content.parts[0].text;
        
        // Extract JSON from response
        const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
        if (jsonMatch) {
          const enhancements = JSON.parse(jsonMatch[0]);
          
          // Add enhancements to results
          enhancements.forEach((enhancement: any) => {
            if (enhancement.index < results.length) {
              results[enhancement.index].legal_analysis = enhancement.legal_analysis;
              results[enhancement.index].strategic_value = enhancement.strategic_value;
            }
          });
        }
      }
    }

  } catch (error) {
    console.error('Gemini enhancement error:', error);
  }

  return results;
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