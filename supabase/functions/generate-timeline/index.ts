/*
  # Advanced Timeline Generation Function

  This function provides:
  1. Integration with the Python timeline extractor logic
  2. Advanced temporal reasoning and event extraction
  3. Explicit and implicit event identification
  4. Structured JSON timeline output
  5. Enhanced legal document processing
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TimelineRequest {
  text: string;
  caseId?: string;
  options?: {
    maxChunkSize?: number;
    includeImplicitEvents?: boolean;
    returnFormatted?: boolean;
  };
}

interface TimelineEvent {
  description: string;
  date: string;
  type: 'explicit' | 'implicit';
  event_type: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  parties: string[];
  trigger: string;
  location?: string;
  context?: string;
  temporal_relations?: Array<{
    related_event: string;
    relation: string;
    days_difference: number;
    confidence: string;
  }>;
}

interface TimelineData {
  metadata: {
    total_events: number;
    explicit_events: number;
    implicit_events: number;
    dated_events: number;
    undated_events: number;
    model_used: string;
    generated_at: string;
    api_calls_used: number;
    chunks_processed: number;
  };
  timeline: {
    dated_events: TimelineEvent[];
    undated_events: TimelineEvent[];
  };
  summary: {
    key_events: TimelineEvent[];
    event_types: string[];
    parties_involved: string[];
  };
  formatted_display?: string;
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

    const { text, caseId, options = {} }: TimelineRequest = await req.json();

    if (!text || text.trim().length === 0) {
      throw new Error('Text content is required for timeline generation');
    }

    // Initialize timeline extractor with options
    const timelineExtractor = new TimelineExtractor({
      maxChunkSize: options.maxChunkSize || 8000,
      includeImplicitEvents: options.includeImplicitEvents !== false,
      returnFormatted: options.returnFormatted !== false
    });

    // Process the document and generate timeline
    const timelineData = await timelineExtractor.processDocument(text);

    // Store timeline in database if caseId is provided
    if (caseId) {
      await storeTimelineInDatabase(supabaseClient, caseId, timelineData);
    }

    return new Response(
      JSON.stringify({
        success: true,
        timeline: timelineData,
        message: 'Timeline generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Timeline generation error:', error);
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

class TimelineExtractor {
  private apiKey: string;
  private modelName: string;
  private maxChunkSize: number;
  private includeImplicitEvents: boolean;
  private returnFormatted: boolean;

  constructor(options: {
    maxChunkSize?: number;
    includeImplicitEvents?: boolean;
    returnFormatted?: boolean;
  } = {}) {
    this.apiKey = Deno.env.get('GEMINI_API_KEY') || '';
    this.modelName = 'gemini-2.0-flash';
    this.maxChunkSize = options.maxChunkSize || 8000;
    this.includeImplicitEvents = options.includeImplicitEvents !== false;
    this.returnFormatted = options.returnFormatted !== false;

    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
  }

  async processDocument(text: string): Promise<TimelineData> {
    // Split text into meaningful chunks
    const chunks = this.chunkText(text);
    
    if (chunks.length === 0) {
      return {
        metadata: {
          total_events: 0,
          explicit_events: 0,
          implicit_events: 0,
          dated_events: 0,
          undated_events: 0,
          model_used: this.modelName,
          generated_at: new Date().toISOString(),
          api_calls_used: 0,
          chunks_processed: 0
        },
        timeline: { dated_events: [], undated_events: [] },
        summary: { key_events: [], event_types: [], parties_involved: [] },
        formatted_display: 'No substantive legal content found in document.'
      };
    }

    let allEvents: TimelineEvent[] = [];
    let referenceEvents: TimelineEvent[] = [];
    let apiCallsUsed = 0;

    console.log(`Processing ${chunks.length} chunks for timeline generation`);

    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1}/${chunks.length}`);

      // Extract explicit events
      const explicitEvents = await this.extractExplicitEvents(chunk, referenceEvents);
      apiCallsUsed++;

      // Extract implicit events if enabled
      let implicitEvents: TimelineEvent[] = [];
      if (this.includeImplicitEvents && explicitEvents.length > 0) {
        implicitEvents = await this.extractImplicitEvents(chunk, explicitEvents);
        apiCallsUsed++;
      }

      // Combine events from this chunk
      const chunkEvents = [...explicitEvents, ...implicitEvents];
      allEvents.push(...chunkEvents);

      // Update reference events for next chunk
      referenceEvents = allEvents.slice(-10); // Keep last 10 events for context
    }

    // Remove duplicates
    allEvents = this.removeDuplicateEvents(allEvents);

    // Add temporal relations
    allEvents = this.identifyTemporalRelations(allEvents);

    // Apply temporal ordering
    allEvents = this.createTemporalOrdering(allEvents);

    // Generate structured output
    const timelineData = this.generateTimelineJSON(allEvents, apiCallsUsed, chunks.length);

    if (this.returnFormatted) {
      timelineData.formatted_display = this.formatTimelineDisplay(timelineData);
    }

    return timelineData;
  }

  private chunkText(text: string): string[] {
    // Check if chunk contains substantive legal content
    const isSubstantiveChunk = (chunk: string): boolean => {
      const chunkLower = chunk.toLowerCase();
      
      if (chunk.length < 300) return false;

      const substantiveIndicators = [
        'facts', 'background', 'procedural history', 'analysis', 'discussion',
        'opinion', 'holding', 'conclusion', 'whereas', 'therefore', 'ordered',
        'motion', 'hearing', 'trial court', 'filed', 'granted', 'denied',
        'appeal', 'judgment', 'sentence', 'conviction', 'evidence', 'witness'
      ];

      const substantiveCount = substantiveIndicators.filter(indicator => 
        chunkLower.includes(indicator)
      ).length;

      return substantiveCount >= 2;
    };

    // Split by paragraphs first
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length > this.maxChunkSize && currentChunk) {
        if (isSubstantiveChunk(currentChunk)) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }

    if (currentChunk && isSubstantiveChunk(currentChunk)) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  private async extractExplicitEvents(text: string, referenceEvents: TimelineEvent[]): Promise<TimelineEvent[]> {
    const referenceContext = referenceEvents.length > 0 
      ? `Previous events for context:\n${referenceEvents.slice(-5).map(e => 
          `- ${e.date}: ${e.description}`
        ).join('\n')}\n\n`
      : '';

    const prompt = `Analyze this legal text and extract ONLY EXPLICIT events that are directly stated.

Focus on identifying:
1. Legal actions with clear verbs (filed, served, granted, denied, ordered, etc.)
2. Procedural events (hearings scheduled, motions made, decisions rendered)
3. Specific dates and times
4. Document creation/signing events
5. Deadlines and scheduling
6. Court proceedings and decisions

${referenceContext}Text: ${text}

For each explicit event, provide:
- "description": Clear, specific description of what happened
- "date": EXACT date as written in text, or "inferred" if no specific date
- "type": "explicit"
- "event_type": Category (filing, hearing, decision, motion, deadline, service, etc.)
- "importance": "critical" (case-changing), "high" (significant), "medium" (procedural), "low" (administrative)
- "parties": List of specific parties involved
- "trigger": The exact word/phrase that indicates this event
- "location": Court, venue, or location if mentioned
- "context": Brief context around the event

Return JSON array format only.`;

    try {
      const response = await this.callGemini(prompt);
      const events = this.parseJSONResponse(response);
      
      // Normalize dates
      return events.map(event => ({
        ...event,
        date: this.normalizeDate(event.date)
      }));
    } catch (error) {
      console.error('Error extracting explicit events:', error);
      return [];
    }
  }

  private async extractImplicitEvents(text: string, explicitEvents: TimelineEvent[]): Promise<TimelineEvent[]> {
    if (explicitEvents.length === 0) return [];

    const explicitSummary = explicitEvents.map(e => ({
      description: e.description,
      date: e.date,
      event_type: e.event_type
    }));

    const prompt = `Based on the explicit legal events extracted from this text, identify implicit events that must have logically occurred but are not explicitly stated.

Implicit events are procedural or preparatory actions that are necessary precursors to the explicit events.

Examples:
- If "motion filed" → implicit: "motion drafted", "legal research conducted"
- If "hearing held" → implicit: "hearing scheduled", "parties notified"
- If "settlement reached" → implicit: "negotiations conducted", "terms discussed"

Text context: ${text.substring(0, 1000)}...

Explicit events found: ${JSON.stringify(explicitSummary, null, 2)}

Identify 2-5 implicit events that:
1. Are logical prerequisites to the explicit events
2. Would typically occur in legal proceedings
3. Are not explicitly mentioned in the text
4. Add meaningful context to the timeline

Return JSON array format only.`;

    try {
      const response = await this.callGemini(prompt);
      return this.parseJSONResponse(response);
    } catch (error) {
      console.error('Error extracting implicit events:', error);
      return [];
    }
  }

  private async callGemini(prompt: string): Promise<string> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`, {
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
          maxOutputTokens: 2000,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
      return result.candidates[0].content.parts[0].text;
    }
    
    throw new Error('No response from Gemini API');
  }

  private parseJSONResponse(response: string): any[] {
    try {
      // Clean up the response to extract JSON
      let jsonText = response;
      
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0];
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1];
      }
      
      // Find JSON array in the response
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return JSON.parse(jsonText.trim());
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      return [];
    }
  }

  private normalizeDate(dateString: string): string {
    if (!dateString || dateString === 'inferred') {
      return 'inferred';
    }

    try {
      // Simple date parsing - can be enhanced with a proper date parser
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
    }

    return 'inferred';
  }

  private removeDuplicateEvents(events: TimelineEvent[]): TimelineEvent[] {
    const uniqueEvents: TimelineEvent[] = [];
    const seenDescriptions = new Set<string>();

    for (const event of events) {
      const normalizedDesc = event.description.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!seenDescriptions.has(normalizedDesc)) {
        seenDescriptions.add(normalizedDesc);
        uniqueEvents.push(event);
      }
    }

    return uniqueEvents;
  }

  private identifyTemporalRelations(events: TimelineEvent[]): TimelineEvent[] {
    return events.map(event => {
      const temporalRelations: any[] = [];

      events.forEach(otherEvent => {
        if (event !== otherEvent && 
            event.date !== 'inferred' && 
            otherEvent.date !== 'inferred') {
          try {
            const eventDate = new Date(event.date);
            const otherDate = new Date(otherEvent.date);
            const daysDiff = Math.floor((eventDate.getTime() - otherDate.getTime()) / (1000 * 60 * 60 * 24));

            let relation: string;
            if (daysDiff < 0) {
              relation = 'before';
            } else if (daysDiff === 0) {
              relation = 'simultaneous';
            } else {
              relation = 'after';
            }

            temporalRelations.push({
              related_event: otherEvent.description,
              relation,
              days_difference: Math.abs(daysDiff),
              confidence: Math.abs(daysDiff) > 1 ? 'high' : 'medium'
            });
          } catch (error) {
            // Skip invalid dates
          }
        }
      });

      return {
        ...event,
        temporal_relations: temporalRelations
      };
    });
  }

  private createTemporalOrdering(events: TimelineEvent[]): TimelineEvent[] {
    const datedEvents = events.filter(e => e.date !== 'inferred');
    const undatedEvents = events.filter(e => e.date === 'inferred');

    // Sort dated events chronologically
    datedEvents.sort((a, b) => {
      try {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } catch {
        return 0;
      }
    });

    // Apply logical ordering to undated events
    const eventSequenceMap: Record<string, number> = {
      'consultation': 1, 'research': 2, 'investigation': 3, 'demand': 4, 'negotiation': 5,
      'filing': 10, 'complaint': 10, 'petition': 10, 'service': 11, 'appearance': 12,
      'discovery': 20, 'deposition': 21, 'interrogatories': 22, 'document_request': 23,
      'motion': 30, 'opposition': 31, 'reply': 32, 'hearing': 35,
      'preparation': 40, 'witness_prep': 41, 'pretrial': 42,
      'trial': 50, 'testimony': 51, 'evidence': 52, 'closing': 53,
      'decision': 60, 'judgment': 61, 'sentencing': 62, 'appeal': 70, 'settlement': 80
    };

    undatedEvents.forEach(event => {
      const baseSequence = eventSequenceMap[event.event_type?.toLowerCase()] || 100;
      const importanceAdjustment = {
        'critical': 0, 'high': 1, 'medium': 2, 'low': 3
      }[event.importance] || 2;
      
      event.sequence_order = baseSequence + importanceAdjustment;
    });

    undatedEvents.sort((a, b) => (a.sequence_order || 100) - (b.sequence_order || 100));

    return [...datedEvents, ...undatedEvents];
  }

  private generateTimelineJSON(events: TimelineEvent[], apiCallsUsed: number, chunksProcessed: number): TimelineData {
    const datedEvents = events.filter(e => e.date !== 'inferred');
    const undatedEvents = events.filter(e => e.date === 'inferred');

    return {
      metadata: {
        total_events: events.length,
        explicit_events: events.filter(e => e.type === 'explicit').length,
        implicit_events: events.filter(e => e.type === 'implicit').length,
        dated_events: datedEvents.length,
        undated_events: undatedEvents.length,
        model_used: this.modelName,
        generated_at: new Date().toISOString(),
        api_calls_used: apiCallsUsed,
        chunks_processed: chunksProcessed
      },
      timeline: {
        dated_events: datedEvents,
        undated_events: undatedEvents
      },
      summary: {
        key_events: events.filter(e => ['critical', 'high'].includes(e.importance)),
        event_types: [...new Set(events.map(e => e.event_type))],
        parties_involved: [...new Set(events.flatMap(e => e.parties || []))]
      }
    };
  }

  private formatTimelineDisplay(timelineData: TimelineData): string {
    const events = [...timelineData.timeline.dated_events, ...timelineData.timeline.undated_events];
    
    if (events.length === 0) {
      return 'No events found in timeline.';
    }

    const lines = ['Case Timeline', '=' * 50, ''];

    events.forEach((event, index) => {
      const dateDisplay = event.date !== 'inferred' 
        ? new Date(event.date).toLocaleDateString()
        : `Step ${index + 1}`;

      lines.push(
        event.description,
        `${dateDisplay} | ${event.importance}`,
        `Parties: ${event.parties?.join(', ') || 'Unknown'}`,
        ''
      );
    });

    lines.push(
      '=' * 50,
      'Summary:',
      `Total Events: ${timelineData.metadata.total_events}`,
      `Explicit Events: ${timelineData.metadata.explicit_events}`,
      `Implicit Events: ${timelineData.metadata.implicit_events}`,
      `API Calls Used: ${timelineData.metadata.api_calls_used}`
    );

    return lines.join('\n');
  }
}

// Store timeline in database
async function storeTimelineInDatabase(supabaseClient: any, caseId: string, timelineData: TimelineData) {
  try {
    // Store each event in the case_timelines table
    const allEvents = [...timelineData.timeline.dated_events, ...timelineData.timeline.undated_events];
    
    for (const event of allEvents) {
      await supabaseClient
        .from('case_timelines')
        .insert({
          case_id: caseId,
          event_date: event.date !== 'inferred' ? event.date.split('T')[0] : null,
          event_title: event.description,
          event_description: event.context || event.description,
          event_type: event.event_type,
          importance_level: event.importance,
          metadata: {
            type: event.type,
            parties: event.parties,
            trigger: event.trigger,
            location: event.location,
            temporal_relations: event.temporal_relations
          }
        });
    }

    console.log(`Stored ${allEvents.length} timeline events for case ${caseId}`);
  } catch (error) {
    console.error('Error storing timeline in database:', error);
  }
}