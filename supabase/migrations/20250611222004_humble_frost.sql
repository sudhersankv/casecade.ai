/*
  # Legal AI Database Schema

  1. New Tables
    - `legal_cases` - Store court case information and metadata
    - `case_documents` - Store uploaded documents and their content
    - `case_timelines` - Store generated timeline events
    - `precedent_matches` - Store AI-found precedent relationships
    - `case_analysis` - Store AI analysis results
    - `user_sessions` - Track user interactions and case work

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Secure document access and case confidentiality

  3. Indexes
    - Full-text search indexes for case content
    - Vector similarity indexes for semantic search
    - Performance indexes for common queries
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Legal Cases Table
CREATE TABLE IF NOT EXISTS legal_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  case_type text,
  jurisdiction text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Case Documents Table
CREATE TABLE IF NOT EXISTS case_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES legal_cases(id) ON DELETE CASCADE,
  filename text NOT NULL,
  content_type text,
  file_size bigint,
  content text,
  extracted_text text,
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Case Timeline Events Table
CREATE TABLE IF NOT EXISTS case_timelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES legal_cases(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  event_title text NOT NULL,
  event_description text,
  event_type text,
  importance_level text DEFAULT 'medium',
  source_document_id uuid REFERENCES case_documents(id),
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Precedent Cases Database
CREATE TABLE IF NOT EXISTS precedent_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  citation text UNIQUE NOT NULL,
  court text,
  year integer,
  jurisdiction text,
  case_summary text,
  key_facts text,
  legal_issues text,
  outcome text,
  damages text,
  full_text text,
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Precedent Matches Table
CREATE TABLE IF NOT EXISTS precedent_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES legal_cases(id) ON DELETE CASCADE,
  precedent_case_id uuid REFERENCES precedent_cases(id),
  similarity_score float NOT NULL,
  matching_factors text[],
  ai_analysis text,
  created_at timestamptz DEFAULT now()
);

-- Case Analysis Table
CREATE TABLE IF NOT EXISTS case_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES legal_cases(id) ON DELETE CASCADE,
  analysis_type text NOT NULL,
  strengths text[],
  weaknesses text[],
  recommendations text[],
  outcome_prediction jsonb,
  confidence_score float,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE precedent_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE precedent_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for legal_cases
CREATE POLICY "Users can manage their own cases"
  ON legal_cases
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for case_documents
CREATE POLICY "Users can manage documents for their cases"
  ON case_documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM legal_cases 
      WHERE legal_cases.id = case_documents.case_id 
      AND legal_cases.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM legal_cases 
      WHERE legal_cases.id = case_documents.case_id 
      AND legal_cases.user_id = auth.uid()
    )
  );

-- RLS Policies for case_timelines
CREATE POLICY "Users can manage timelines for their cases"
  ON case_timelines
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM legal_cases 
      WHERE legal_cases.id = case_timelines.case_id 
      AND legal_cases.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM legal_cases 
      WHERE legal_cases.id = case_timelines.case_id 
      AND legal_cases.user_id = auth.uid()
    )
  );

-- RLS Policies for precedent_cases (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read precedent cases"
  ON precedent_cases
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for precedent_matches
CREATE POLICY "Users can manage precedent matches for their cases"
  ON precedent_matches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM legal_cases 
      WHERE legal_cases.id = precedent_matches.case_id 
      AND legal_cases.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM legal_cases 
      WHERE legal_cases.id = precedent_matches.case_id 
      AND legal_cases.user_id = auth.uid()
    )
  );

-- RLS Policies for case_analysis
CREATE POLICY "Users can manage analysis for their cases"
  ON case_analysis
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM legal_cases 
      WHERE legal_cases.id = case_analysis.case_id 
      AND legal_cases.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM legal_cases 
      WHERE legal_cases.id = case_analysis.case_id 
      AND legal_cases.user_id = auth.uid()
    )
  );

-- RLS Policies for user_sessions
CREATE POLICY "Users can manage their own sessions"
  ON user_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_legal_cases_user_id ON legal_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_cases_status ON legal_cases(status);
CREATE INDEX IF NOT EXISTS idx_case_documents_case_id ON case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_case_timelines_case_id ON case_timelines(case_id);
CREATE INDEX IF NOT EXISTS idx_case_timelines_date ON case_timelines(event_date);
CREATE INDEX IF NOT EXISTS idx_precedent_cases_citation ON precedent_cases(citation);
CREATE INDEX IF NOT EXISTS idx_precedent_cases_year ON precedent_cases(year);
CREATE INDEX IF NOT EXISTS idx_precedent_matches_case_id ON precedent_matches(case_id);
CREATE INDEX IF NOT EXISTS idx_precedent_matches_similarity ON precedent_matches(similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_case_analysis_case_id ON case_analysis(case_id);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_legal_cases_search ON legal_cases USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_precedent_cases_search ON precedent_cases USING gin(to_tsvector('english', title || ' ' || COALESCE(case_summary, '') || ' ' || COALESCE(key_facts, '')));
CREATE INDEX IF NOT EXISTS idx_case_documents_search ON case_documents USING gin(to_tsvector('english', COALESCE(extracted_text, '')));

-- Vector similarity indexes (for semantic search)
CREATE INDEX IF NOT EXISTS idx_case_documents_embedding ON case_documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_precedent_cases_embedding ON precedent_cases USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_legal_cases_updated_at BEFORE UPDATE ON legal_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_case_analysis_updated_at BEFORE UPDATE ON case_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();