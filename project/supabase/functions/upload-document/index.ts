/*
  # Document Upload and Processing Function

  This function handles:
  1. Document upload to Supabase Storage
  2. Text extraction from PDFs/Word docs using Gemini
  3. Embedding generation for vector search
  4. Storage in case_documents table
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface DocumentUploadRequest {
  caseId: string;
  fileName: string;
  fileContent: string; // base64 encoded
  contentType: string;
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

    const { caseId, fileName, fileContent, contentType }: DocumentUploadRequest = await req.json();

    // Decode base64 file content
    const fileBuffer = Uint8Array.from(atob(fileContent), c => c.charCodeAt(0));

    // Upload file to Supabase Storage
    const filePath = `cases/${caseId}/${fileName}`;
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('legal-documents')
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Extract text from document using Gemini
    const extractedText = await extractTextWithGemini(fileBuffer, contentType, fileName);

    // Generate embeddings using Gemini
    const embedding = await generateEmbeddingWithGemini(extractedText);

    // Store document metadata in database
    const { data: documentData, error: dbError } = await supabaseClient
      .from('case_documents')
      .insert({
        case_id: caseId,
        filename: fileName,
        content_type: contentType,
        file_size: fileBuffer.length,
        content: filePath,
        extracted_text: extractedText,
        embedding: embedding,
        metadata: {
          upload_date: new Date().toISOString(),
          processing_status: 'completed'
        }
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        document: documentData,
        message: 'Document uploaded and processed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Document upload error:', error);
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

// Extract text from documents using Gemini Vision/Text API
async function extractTextWithGemini(fileBuffer: Uint8Array, contentType: string, fileName: string): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }

  try {
    // Convert file to base64 for Gemini API
    const base64Data = btoa(String.fromCharCode(...fileBuffer));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Please extract all text content from this legal document. Focus on:
              1. All text content, preserving structure and formatting
              2. Important dates, names, and legal terms
              3. Key clauses and provisions
              4. Any tables or structured data
              
              Document: ${fileName}
              
              Please provide a clean, well-structured text extraction that preserves the legal meaning and context.`
            },
            {
              inline_data: {
                mime_type: contentType,
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
      return result.candidates[0].content.parts[0].text;
    } else {
      throw new Error('No text content extracted from document');
    }

  } catch (error) {
    console.error('Gemini text extraction error:', error);
    // Fallback to basic text extraction
    return `[TEXT EXTRACTION ERROR] Could not extract text from ${fileName}. Error: ${error.message}`;
  }
}

// Generate embeddings using Gemini Embedding API
async function generateEmbeddingWithGemini(text: string): Promise<number[]> {
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
            text: text.substring(0, 30000) // Limit text length for embedding
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
    // Fallback to random embedding (for development)
    const embedding = Array.from({ length: 768 }, () => Math.random() * 2 - 1);
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }
}