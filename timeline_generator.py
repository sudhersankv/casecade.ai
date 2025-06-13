from openai import OpenAI
import dateparser
import spacy
from typing import List, Dict, Any, Tuple
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import re
import json
from collections import defaultdict

load_dotenv()

class TimelineExtractor:
    def __init__(self, model_name: str = "gemini-2.0-flash"):
        # Initialize OpenAI client with Gemini endpoint
        self.client = OpenAI(
            api_key=os.getenv('GEMINI_API_KEY'),
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        self.model_name = model_name
        
        # Load spaCy for NLP tasks with error handling
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Warning: spaCy model 'en_core_web_sm' not found. Please install it with:")
            print("python -m spacy download en_core_web_sm")
            print("Using basic text processing instead.")
            self.nlp = None
        
        # Define temporal relation types based on LexTime paper
        self.temporal_relations = {
            'before': ['precedes', 'happens before', 'starts before', 'arises before'],
            'simultaneous': ['is simultaneous', 'happens simultaneously', 'overlaps', 'during'],
            'after': ['follows', 'happens after', 'starts after', 'comes after']
        }
        
        # Legal event triggers from LexTime paper
        self.legal_triggers = [
            'filed', 'engaged', 'advised', 'agreed', 'concerted', 'amended',
            'pick', 'store', 'posted', 'requested', 'charged', 'terminated',
            'appealed', 'settled', 'ordered', 'granted', 'denied', 'served'
        ]
        
    def is_substantive_chunk(self, chunk: str) -> bool:
        """
        Determine if a chunk contains substantive legal content vs. procedural text
        """
        chunk_lower = chunk.lower()
        
        # Skip attorney listings and procedural headers
        attorney_indicators = [
            'attorney general', 'for plaintiff', 'for defendant', 'for appellant',
            'for respondent', 'under appointment', 'counsel for', 'representing'
        ]
        
        if len(chunk) < 300:  # Too short to be substantive
            return False
            
        # If chunk is mostly attorney listings
        attorney_lines = sum(1 for indicator in attorney_indicators if indicator in chunk_lower)
        total_lines = len(chunk.split('\n'))
        
        if attorney_lines > total_lines * 0.3:  # More than 30% attorney references
            return False
        
        # Look for substantive legal content indicators
        substantive_indicators = [
            'facts', 'background', 'procedural history', 'analysis', 'discussion',
            'opinion', 'holding', 'conclusion', 'whereas', 'therefore', 'ordered',
            'motion', 'hearing', 'trial court', 'filed', 'granted', 'denied',
            'appeal', 'judgment', 'sentence', 'conviction', 'evidence', 'witness'
        ]
        
        substantive_count = sum(1 for indicator in substantive_indicators if indicator in chunk_lower)
        
        return substantive_count >= 2  # At least 2 substantive indicators

    def chunk_text(self, text: str, max_chunk_size: int = 8000) -> List[str]:
        """
        Split text into meaningful paragraph-based chunks for optimal LLM processing
        Skip non-substantive content like attorney listings
        """
        # First try to split by major legal section markers
        legal_section_markers = [
            r'\n(?:FACTS|BACKGROUND|PROCEDURAL HISTORY|ANALYSIS|DISCUSSION|OPINION|HOLDING|CONCLUSION)[\s:.\-]',
            r'\n(?:WHEREAS|THEREFORE|NOW THEREFORE|ORDERED|ADJUDGED)',
            r'\n\d+\.\s+[A-Z][A-Za-z\s]{10,}',  # Numbered sections with substantial text
            r'\n[IVX]+\.\s+[A-Z][A-Za-z\s]{10,}',  # Roman numeral sections
        ]
        
        chunks = []
        current_text = text
        
        # Try legal section splitting first
        for marker in legal_section_markers:
            if re.search(marker, current_text, re.IGNORECASE):
                parts = re.split(marker, current_text, flags=re.IGNORECASE)
                if len(parts) > 1:
                    for i, part in enumerate(parts[1:], 1):  # Skip first part (usually headers)
                        if part.strip() and len(part.strip()) > 500:  # Require substantial content
                            # Add back the section header
                            section_match = re.search(marker, current_text, re.IGNORECASE)
                            if section_match:
                                header = section_match.group(0)
                                full_section = header + part
                                if self.is_substantive_chunk(full_section):
                                    chunks.append(full_section.strip())
                    if chunks:
                        break
        
        # If no good legal sections, use paragraph-based chunking
        if not chunks:
            paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
            
            current_chunk = []
            current_size = 0
            
            for paragraph in paragraphs:
                para_size = len(paragraph)
                
                # If single paragraph is too large, split it by sentences
                if para_size > max_chunk_size:
                    sentences = self._split_into_sentences(paragraph)
                    for sentence in sentences:
                        sentence_size = len(sentence)
                        
                        if current_size + sentence_size > max_chunk_size and current_chunk:
                            chunk_text = '\n\n'.join(current_chunk)
                            if self.is_substantive_chunk(chunk_text):
                                chunks.append(chunk_text)
                            current_chunk = [sentence]
                            current_size = sentence_size
                        else:
                            current_chunk.append(sentence)
                            current_size += sentence_size
                else:
                    # Add whole paragraph
                    if current_size + para_size > max_chunk_size and current_chunk:
                        chunk_text = '\n\n'.join(current_chunk)
                        if self.is_substantive_chunk(chunk_text):
                            chunks.append(chunk_text)
                        current_chunk = [paragraph]
                        current_size = para_size
                    else:
                        current_chunk.append(paragraph)
                        current_size += para_size
            
            if current_chunk:
                chunk_text = '\n\n'.join(current_chunk)
                if self.is_substantive_chunk(chunk_text):
                    chunks.append(chunk_text)
        
        # Final filtering and merging
        final_chunks = []
        for chunk in chunks:
            if self.is_substantive_chunk(chunk):
                final_chunks.append(chunk)
        
        # If no substantive chunks found, keep the largest chunks as fallback
        if not final_chunks and chunks:
            final_chunks = sorted(chunks, key=len, reverse=True)[:3]
        
        return final_chunks
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences using spaCy for better legal text handling
        """
        if self.nlp:
            doc = self.nlp(text)
            sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]
        else:
            # Fallback to basic sentence splitting if spaCy is not available
            sentences = re.split(r'[.!?]+\s+', text)
            sentences = [s.strip() for s in sentences if s.strip()]
        
        return sentences
    
    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """
        Extract named entities with focus on legal entities
        """
        if not self.nlp:
            # Basic fallback entity extraction using regex
            entities = {
                'PERSON': re.findall(r'\b[A-Z][a-z]+ [A-Z][a-z]+\b', text),
                'DATE': re.findall(r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\w+ \d{1,2}, \d{4}\b', text),
                'ORG': re.findall(r'\b[A-Z][a-zA-Z]+ (?:Corporation|Corp|Inc|LLC|Company)\b', text)
            }
            return entities
        
        doc = self.nlp(text)
        entities = defaultdict(list)
        
        for ent in doc.ents:
            entities[ent.label_].append({
                'text': ent.text,
                'start': ent.start_char,
                'end': ent.end_char,
                'label': ent.label_
            })
        
        return dict(entities)
    
    def call_gemini(self, prompt: str) -> str:
        """
        Make a call to Gemini via OpenAI API format
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are a legal AI assistant specialized in temporal reasoning and event extraction from legal documents. Always respond with valid JSON when requested."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Gemini API error: {e}")
            return "[]"
    
    def extract_events(self, text: str, reference_events: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Extract explicit events with high precision using focused prompting
        """
        entities = self.extract_entities(text)
        
        # Prepare context from reference events
        reference_context = ""
        if reference_events:
            reference_context = "Previous events for temporal context:\n"
            for event in reference_events[-5:]:  # More context for accuracy
                reference_context += f"- {event.get('date', 'Unknown')}: {event['description']}\n"
        
        # Focused prompt for explicit events only
        explicit_prompt = f"""
        Analyze this legal text and extract ONLY EXPLICIT events that are directly stated.
        
        Focus on identifying:
        1. Legal actions with clear verbs (filed, served, granted, denied, ordered, etc.)
        2. Procedural events (hearings scheduled, motions made, decisions rendered)
        3. Specific dates and times - look for patterns like:
           - "January 15, 2024" or "Jan 15, 2024"
           - "2024-01-15" or "01/15/2024"
           - "on the 15th day of January, 2024"
           - "filed on [date]", "decided on [date]"
           - Relative dates: "30 days after", "following the hearing"
        4. Document creation/signing events
        5. Deadlines and scheduling
        6. Court proceedings and decisions
        
        {reference_context}
        
        Text: {text}
        
        For each explicit event, provide:
        - "description": Clear, specific description of what happened
        - "date": EXACT date as written in text, or "inferred" if no specific date
        - "type": "explicit"
        - "event_type": Category (filing, hearing, decision, motion, deadline, service, etc.)
        - "importance": "critical" (case-changing), "high" (significant), "medium" (procedural), "low" (administrative)
        - "parties": List of specific parties involved (be precise with names)
        - "trigger": The exact word/phrase that indicates this event
        - "location": Court, venue, or location if mentioned
        - "context": Brief context around the event
        
        IMPORTANT: 
        - Only include events that are directly stated in the text
        - If a date is mentioned, include it exactly as written
        - Look for temporal indicators like "after", "before", "during", "following"
        - Pay attention to procedural sequences
        
        Return JSON array format:
        [
            {{
                "description": "Motion for summary judgment filed",
                "date": "January 15, 2024",
                "type": "explicit",
                "event_type": "motion",
                "importance": "high",
                "parties": ["Plaintiff ABC Corp", "Defendant XYZ Inc"],
                "trigger": "filed",
                "location": "Superior Court of California",
                "context": "Motion filed in response to discovery disputes"
            }}
        ]
        """
        
        try:
            response_text = self.call_gemini(explicit_prompt)
            # Clean up the response to extract JSON
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1]
            
            explicit_events = json.loads(response_text.strip())
            
            # Process and normalize dates
            for event in explicit_events:
                if 'date' in event and event['date'] != 'inferred':
                    parsed_date = dateparser.parse(event['date'])
                    if parsed_date:
                        event['date'] = parsed_date.isoformat()
                    else:
                        event['date'] = 'inferred'
            
            return explicit_events
        except Exception as e:
            print(f"Error extracting explicit events: {e}")
            return []

    def identify_implicit_events(self, text: str, explicit_events: List[Dict]) -> List[Dict]:
        """
        Identify implicit events that must have occurred based on explicit events
        """
        if not explicit_events:
            return []
            
        explicit_summary = []
        for event in explicit_events:
            explicit_summary.append({
                'description': event['description'],
                'date': event.get('date', 'inferred'),
                'event_type': event.get('event_type', 'unknown')
            })
        
        implicit_prompt = f"""
        Based on the explicit legal events extracted from this text, identify implicit events that must have logically occurred but are not explicitly stated.
        
        Implicit events are procedural or preparatory actions that are necessary precursors to the explicit events.
        
        For example:
        - If "motion filed" → implicit: "motion drafted", "legal research conducted"
        - If "hearing held" → implicit: "hearing scheduled", "parties notified"
        - If "settlement reached" → implicit: "negotiations conducted", "terms discussed"
        - If "judgment entered" → implicit: "decision deliberated", "order prepared"
        
        Text context: {text[:1000]}...
        
        Explicit events found: {json.dumps(explicit_summary, indent=2)}
        
        Identify 2-5 implicit events that:
        1. Are logical prerequisites to the explicit events
        2. Would typically occur in legal proceedings
        3. Are not explicitly mentioned in the text
        4. Add meaningful context to the timeline
        
        Return JSON array format:
        [
            {{
                "description": "Legal research conducted on motion arguments",
                "date": "inferred",
                "type": "implicit",
                "event_type": "preparation",
                "importance": "medium",
                "parties": ["Plaintiff's counsel"],
                "trigger": "inferred",
                "basis": "Required before motion filing"
            }}
        ]
        """
        
        try:
            response_text = self.call_gemini(implicit_prompt)
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1]
            
            implicit_events = json.loads(response_text.strip())
            return implicit_events
        except Exception as e:
            print(f"Error identifying implicit events: {e}")
            return []
    

    
    def identify_temporal_relations(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Identify temporal relations using LexTime's three-category system
        """
        for i in range(len(events)):
            event = events[i]
            event['temporal_relations'] = []
            
            for j, other_event in enumerate(events):
                if i != j and event.get('date') != 'inferred' and other_event.get('date') != 'inferred':
                    try:
                        event_date = datetime.fromisoformat(event['date'])
                        other_date = datetime.fromisoformat(other_event['date'])
                        
                        days_diff = (event_date - other_date).days
                        
                        if days_diff < 0:
                            relation = 'before'
                        elif days_diff == 0:
                            relation = 'simultaneous'
                        else:
                            relation = 'after'
                        
                        event['temporal_relations'].append({
                            'related_event': other_event['description'],
                            'relation': relation,
                            'days_difference': abs(days_diff),
                            'confidence': 'high' if abs(days_diff) > 1 else 'medium'
                        })
                    except:
                        continue
        
        return events
    
    def remove_duplicate_events(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Remove duplicate events using semantic similarity
        """
        unique_events = []
        seen_descriptions = set()
        
        for event in events:
            # Normalize description for comparison
            desc = re.sub(r'\s+', ' ', event['description'].lower().strip())
            desc = re.sub(r'[^\w\s]', '', desc)  # Remove punctuation
            
            # Check for semantic similarity with existing events
            is_duplicate = False
            for seen_desc in seen_descriptions:
                # Simple similarity check - can be enhanced with embeddings
                common_words = set(desc.split()) & set(seen_desc.split())
                if len(common_words) >= min(2, len(desc.split()) // 2):
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                seen_descriptions.add(desc)
                unique_events.append(event)
        
        return unique_events
    
    def generate_timeline_json(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate structured JSON output for the timeline
        """
        # Sort events by date
        dated_events = [e for e in events if e.get('date') != 'inferred']
        undated_events = [e for e in events if e.get('date') == 'inferred']
        
        dated_events.sort(key=lambda x: x.get('date', ''))
        
        timeline = {
            "metadata": {
                "total_events": len(events),
                "explicit_events": len([e for e in events if e.get('type') == 'explicit']),
                "implicit_events": len([e for e in events if e.get('type') == 'implicit']),
                "dated_events": len(dated_events),
                "undated_events": len(undated_events),
                "model_used": self.model_name,
                "generated_at": datetime.now().isoformat()
            },
            "timeline": {
                "dated_events": dated_events,
                "undated_events": undated_events
            },
            "summary": {
                "key_events": [e for e in events if e.get('importance') in ['critical', 'high']],
                "event_types": list(set([e.get('event_type', 'unknown') for e in events])),
                "parties_involved": list(set([party for e in events for party in e.get('parties', [])]))
            }
        }
        
        return timeline
    
    def process_document(self, text: str, return_formatted: bool = True) -> Dict[str, Any]:
        """
        Process a legal document and generate a structured timeline
        Optimized for accuracy with separate explicit/implicit extraction
        """
        # Split text into paragraph-based chunks
        chunks = self.chunk_text(text, max_chunk_size=8000)
        
        if not chunks:
            print("Warning: No substantive content found in document")
            return {
                "metadata": {"total_events": 0, "error": "No substantive content found"},
                "timeline": {"dated_events": [], "undated_events": []},
                "summary": {"key_events": [], "event_types": [], "parties_involved": []},
                "formatted_display": "No substantive legal content found in document."
            }
        
        all_events = []
        reference_events = None
        api_calls_made = 0
        
        print(f"Document split into {len(chunks)} substantive chunks for processing")
        
        # Process each chunk with 2 API calls (explicit + implicit)
        for i, chunk in enumerate(chunks):
            print(f"Processing chunk {i+1}/{len(chunks)}")
            
            # Step 1: Extract explicit events (API call 1 for this chunk)
            print(f"  - Extracting explicit events... (API call {api_calls_made + 1})")
            explicit_events = self.extract_events(chunk, reference_events)
            api_calls_made += 1
            
            # Step 2: Identify implicit events based on explicit ones (API call 2 for this chunk)
            print(f"  - Identifying implicit events... (API call {api_calls_made + 1})")
            implicit_events = self.identify_implicit_events(chunk, explicit_events)
            api_calls_made += 1
            
            # Combine explicit and implicit events
            chunk_events = explicit_events + implicit_events
            
            # Add chunk information
            for event in chunk_events:
                event['chunk_id'] = i
                event['chunk_text'] = chunk[:200] + "..." if len(chunk) > 200 else chunk
            
            # Add to all events
            all_events.extend(chunk_events)
            
            # Update reference events for next chunk (use last 10 events for context)
            reference_events = all_events[-10:] if len(all_events) > 10 else all_events
            
            print(f"  - Found {len(explicit_events)} explicit and {len(implicit_events)} implicit events")
        
        # Remove duplicates using semantic similarity
        print("Removing duplicate events...")
        all_events = self.remove_duplicate_events(all_events)
        
        # Add temporal relations (no API call required)
        print("Identifying temporal relations...")
        all_events = self.identify_temporal_relations(all_events)
        
        # Apply temporal ordering
        print("Creating temporal ordering...")
        all_events = self.create_temporal_ordering(all_events)
        
        # Generate structured JSON output
        timeline_json = self.generate_timeline_json(all_events)
        timeline_json['metadata']['api_calls_used'] = api_calls_made
        timeline_json['metadata']['chunks_processed'] = len(chunks)
        
        # Add formatted display
        if return_formatted:
            timeline_json['formatted_display'] = self.format_timeline_display(timeline_json)
        
        print(f"Timeline generation complete!")
        print(f"- Total events: {len(all_events)}")
        print(f"- Explicit events: {len([e for e in all_events if e.get('type') == 'explicit'])}")
        print(f"- Implicit events: {len([e for e in all_events if e.get('type') == 'implicit'])}")
        print(f"- API calls used: {api_calls_made}")
        
        return timeline_json

    def create_temporal_ordering(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Create logical temporal ordering for events without explicit dates
        """
        dated_events = [e for e in events if e.get('date') != 'inferred']
        undated_events = [e for e in events if e.get('date') == 'inferred']
        
        if not undated_events:
            return sorted(dated_events, key=lambda x: x.get('date', ''))
        
        # Define typical legal event sequence patterns
        event_sequence_map = {
            # Pre-litigation
            'consultation': 1,
            'research': 2,
            'investigation': 3,
            'demand': 4,
            'negotiation': 5,
            
            # Initial filing
            'filing': 10,
            'complaint': 10,
            'petition': 10,
            'service': 11,
            'appearance': 12,
            
            # Discovery
            'discovery': 20,
            'deposition': 21,
            'interrogatories': 22,
            'document_request': 23,
            
            # Pre-trial motions
            'motion': 30,
            'opposition': 31,
            'reply': 32,
            'hearing': 35,
            
            # Trial preparation
            'preparation': 40,
            'witness_prep': 41,
            'pretrial': 42,
            
            # Trial
            'trial': 50,
            'testimony': 51,
            'evidence': 52,
            'closing': 53,
            
            # Post-trial
            'decision': 60,
            'judgment': 61,
            'sentencing': 62,
            'appeal': 70,
            'settlement': 80
        }
        
        # Assign sequence numbers to undated events
        for event in undated_events:
            event_type = event.get('event_type', '').lower()
            base_sequence = event_sequence_map.get(event_type, 100)
            
            # Adjust based on importance
            importance_adjustment = {
                'critical': 0,
                'high': 1,
                'medium': 2,
                'low': 3
            }
            
            sequence_number = base_sequence + importance_adjustment.get(event.get('importance', 'medium'), 2)
            event['sequence_order'] = sequence_number
            
            # Add inferred date based on sequence
            if not dated_events:
                # If no dated events, create relative timeline
                event['inferred_date'] = f"Step {sequence_number}"
            else:
                # Try to position relative to dated events
                event['inferred_date'] = f"Sequence {sequence_number}"
        
        # Sort undated events by sequence
        undated_events.sort(key=lambda x: x.get('sequence_order', 100))
        
        # Combine and sort all events
        all_events = dated_events + undated_events
        return all_events
    
    def format_timeline_display(self, timeline_json: Dict[str, Any]) -> str:
        """
        Format timeline into a readable display format
        """
        events = timeline_json.get('timeline', {}).get('dated_events', []) + \
                timeline_json.get('timeline', {}).get('undated_events', [])
        
        if not events:
            return "No events found in timeline."
        
        # Apply temporal ordering
        ordered_events = self.create_temporal_ordering(events)
        
        display_lines = ["Case Timeline", "=" * 50, ""]
        
        for i, event in enumerate(ordered_events, 1):
            # Format date
            if event.get('date') != 'inferred':
                date_str = event.get('date', 'Unknown')
                try:
                    # Try to format ISO date nicely
                    date_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
                    date_display = date_obj.strftime('%Y-%m-%d')
                except:
                    date_display = date_str
            else:
                date_display = event.get('inferred_date', f'Step {i}')
            
            # Format importance
            importance = event.get('importance', 'medium')
            importance_display = importance
            
            # Format description
            description = event.get('description', 'Unknown event')
            
            # Format parties
            parties = event.get('parties', [])
            parties_str = ', '.join(parties) if parties else 'Unknown parties'
            
            # Add to display
            display_lines.extend([
                f"{description}",
                f"{date_display} | {importance_display}",
                f"Parties: {parties_str}",
                ""
            ])
        
        # Add summary
        display_lines.extend([
            "=" * 50,
            "Summary:",
            f"Total Events: {len(ordered_events)}",
            f"Explicit Events: {len([e for e in events if e.get('type') == 'explicit'])}",
            f"Implicit Events: {len([e for e in events if e.get('type') == 'implicit'])}",
            f"Dated Events: {len([e for e in events if e.get('date') != 'inferred'])}",
            f"API Calls Used: {timeline_json.get('metadata', {}).get('api_calls_used', 0)}"
        ])
        
        return "\n".join(display_lines)
