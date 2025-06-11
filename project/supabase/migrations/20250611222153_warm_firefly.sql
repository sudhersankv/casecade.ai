/*
  # Add Search Functions for Legal AI

  1. Functions
    - `search_precedents_by_similarity` - Vector similarity search for precedent cases
    - `search_cases_by_content` - Full-text search across case content
    - `get_case_timeline` - Get timeline events for a case
    - `get_case_analysis` - Get AI analysis for a case

  2. Additional Indexes
    - Optimize search performance
*/

-- Function for vector similarity search
CREATE OR REPLACE FUNCTION search_precedents_by_similarity(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  citation text,
  court text,
  year integer,
  jurisdiction text,
  case_summary text,
  key_facts text,
  outcome text,
  damages text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pc.id,
    pc.title,
    pc.citation,
    pc.court,
    pc.year,
    pc.jurisdiction,
    pc.case_summary,
    pc.key_facts,
    pc.outcome,
    pc.damages,
    1 - (pc.embedding <=> query_embedding) AS similarity
  FROM precedent_cases pc
  WHERE pc.embedding IS NOT NULL
    AND 1 - (pc.embedding <=> query_embedding) > match_threshold
  ORDER BY pc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function to get case timeline with analysis
CREATE OR REPLACE FUNCTION get_case_timeline(case_uuid uuid)
RETURNS TABLE (
  id uuid,
  event_date date,
  event_title text,
  event_description text,
  event_type text,
  importance_level text,
  source_document text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ct.id,
    ct.event_date,
    ct.event_title,
    ct.event_description,
    ct.event_type,
    ct.importance_level,
    cd.filename AS source_document,
    ct.created_at
  FROM case_timelines ct
  LEFT JOIN case_documents cd ON ct.source_document_id = cd.id
  WHERE ct.case_id = case_uuid
  ORDER BY ct.event_date ASC;
END;
$$;

-- Function to get comprehensive case analysis
CREATE OR REPLACE FUNCTION get_case_analysis(case_uuid uuid)
RETURNS TABLE (
  timeline_events json,
  precedent_matches json,
  ai_analysis json
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  timeline_data json;
  precedents_data json;
  analysis_data json;
BEGIN
  -- Get timeline events
  SELECT json_agg(
    json_build_object(
      'id', ct.id,
      'date', ct.event_date,
      'event', ct.event_title,
      'description', ct.event_description,
      'type', ct.event_type,
      'importance', ct.importance_level
    ) ORDER BY ct.event_date
  ) INTO timeline_data
  FROM case_timelines ct
  WHERE ct.case_id = case_uuid;

  -- Get precedent matches
  SELECT json_agg(
    json_build_object(
      'id', pm.id,
      'title', pc.title,
      'citation', pc.citation,
      'similarity', pm.similarity_score * 100,
      'outcome', pc.outcome,
      'damages', pc.damages,
      'keyPoints', pm.matching_factors,
      'analysis', pm.ai_analysis
    ) ORDER BY pm.similarity_score DESC
  ) INTO precedents_data
  FROM precedent_matches pm
  JOIN precedent_cases pc ON pm.precedent_case_id = pc.id
  WHERE pm.case_id = case_uuid;

  -- Get AI analysis
  SELECT json_build_object(
    'strengths', ca.strengths,
    'weaknesses', ca.weaknesses,
    'recommendations', ca.recommendations,
    'outcomePredicition', ca.outcome_prediction,
    'confidenceScore', ca.confidence_score,
    'analysisType', ca.analysis_type,
    'createdAt', ca.created_at
  ) INTO analysis_data
  FROM case_analysis ca
  WHERE ca.case_id = case_uuid
  ORDER BY ca.created_at DESC
  LIMIT 1;

  RETURN QUERY SELECT timeline_data, precedents_data, analysis_data;
END;
$$;

-- Function for full-text search across case content
CREATE OR REPLACE FUNCTION search_cases_by_content(
  search_query text,
  user_uuid uuid DEFAULT NULL
)
RETURNS TABLE (
  case_id uuid,
  title text,
  description text,
  case_type text,
  relevance_score float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    lc.id AS case_id,
    lc.title,
    lc.description,
    lc.case_type,
    ts_rank(
      to_tsvector('english', lc.title || ' ' || COALESCE(lc.description, '')),
      plainto_tsquery('english', search_query)
    ) AS relevance_score
  FROM legal_cases lc
  WHERE 
    (user_uuid IS NULL OR lc.user_id = user_uuid)
    AND to_tsvector('english', lc.title || ' ' || COALESCE(lc.description, '')) 
        @@ plainto_tsquery('english', search_query)
  ORDER BY relevance_score DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION search_precedents_by_similarity TO authenticated;
GRANT EXECUTE ON FUNCTION get_case_timeline TO authenticated;
GRANT EXECUTE ON FUNCTION get_case_analysis TO authenticated;
GRANT EXECUTE ON FUNCTION search_cases_by_content TO authenticated;