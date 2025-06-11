/*
  # Document Upload and Processing Function

  This function handles:
  1. Document upload to Supabase Storage
  2. Text extraction from PDFs/Word docs
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

    // Extract text from document (mock implementation - replace with real service)
    const extractedText = await extractTextFromDocument(fileBuffer, contentType);

    // Generate embeddings (mock implementation - replace with OpenAI)
    const embedding = await generateEmbedding(extractedText);

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

// Mock text extraction - replace with real service like Unstructured.io
async function extractTextFromDocument(fileBuffer: Uint8Array, contentType: string): Promise<string> {
  // This is a mock implementation
  // In production, you would use services like:
  // - Unstructured.io API
  // - Adobe PDF Services
  // - Google Document AI
  
  if (contentType === 'application/pdf') {
    return `[EXTRACTED PDF TEXT] This is mock extracted text from a PDF document. 
    In a real implementation, this would contain the actual text content extracted from the PDF file.
    The document appears to contain legal content related to employment law and discrimination claims.
    Key dates mentioned: January 15, 2023, February 3, 2023, March 15, 2023.
    Parties involved: Smith (Plaintiff) vs TechCorp (Defendant).
    Claims: Wrongful termination, harassment, retaliation.`;
  } else if (contentType.includes('word')) {
    return `[EXTRACTED WORD TEXT] This is mock extracted text from a Word document.
    The document contains detailed case information and witness statements.`;
  } else {
    return `[EXTRACTED TEXT] Mock text extraction for ${contentType}`;
  }
}

// Mock embedding generation - replace with OpenAI Embeddings API
async function generateEmbedding(text: string): Promise<number[]> {
  // This is a mock implementation
  // In production, you would use OpenAI's text-embedding-ada-002 model
  
  // Generate a mock 1536-dimensional embedding (same as OpenAI's ada-002)
  const embedding = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
  
  // Normalize the vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}