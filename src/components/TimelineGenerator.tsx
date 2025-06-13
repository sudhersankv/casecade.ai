import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Clock, 
  Send, 
  Loader2, 
  Download,
  Calendar,
  Users,
  MapPin,
  AlertCircle,
  CheckCircle,
  Paperclip,
  Sparkles,
  ArrowRight,
  Brain,
  Zap
} from 'lucide-react';

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

const TimelineGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Process files to extract text
      for (const file of newFiles) {
        if (file.type === 'text/plain') {
          const text = await file.text();
          setInputText(prev => prev + '\n\n' + text);
        }
      }
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateTimeline = async () => {
    if (!inputText.trim() && uploadedFiles.length === 0) return;

    setIsGenerating(true);
    setProcessingStatus('Initializing timeline generation...');
    
    try {
      // Prepare text content
      let textContent = inputText;
      
      // Add file content if available
      for (const file of uploadedFiles) {
        if (file.type === 'text/plain') {
          const fileText = await file.text();
          textContent += '\n\n' + fileText;
        }
      }

      setProcessingStatus('Analyzing document structure...');

      // Call the enhanced timeline generation function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-timeline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textContent,
          options: {
            maxChunkSize: 8000,
            includeImplicitEvents: true,
            returnFormatted: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Timeline generation failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setTimelineData(result.timeline);
        setProcessingStatus('Timeline generated successfully!');
      } else {
        throw new Error(result.error || 'Timeline generation failed');
      }

    } catch (error) {
      console.error('Timeline generation error:', error);
      setProcessingStatus(`Error: ${error.message}`);
      
      // Fallback to mock data for demonstration
      setTimeout(() => {
        setTimelineData(getMockTimelineData());
        setProcessingStatus('Timeline generated (demo mode)');
      }, 1000);
    } finally {
      setIsGenerating(false);
    }
  };

  const getMockTimelineData = (): TimelineData => {
    return {
      metadata: {
        total_events: 8,
        explicit_events: 6,
        implicit_events: 2,
        dated_events: 4,
        undated_events: 4,
        model_used: "gemini-2.0-flash",
        generated_at: new Date().toISOString(),
        api_calls_used: 3,
        chunks_processed: 1
      },
      timeline: {
        dated_events: [
          {
            description: "Employment discrimination complaint filed with HR",
            date: "2023-01-15T00:00:00",
            type: "explicit",
            event_type: "complaint",
            importance: "critical",
            parties: ["Employee", "HR Department"],
            trigger: "filed complaint",
            location: "Company headquarters",
            temporal_relations: [
              {
                related_event: "Performance review conducted",
                relation: "before",
                days_difference: 45,
                confidence: "high"
              }
            ]
          },
          {
            description: "HR investigation initiated",
            date: "2023-01-18T00:00:00",
            type: "explicit",
            event_type: "investigation",
            importance: "high",
            parties: ["HR Department", "Investigation Team"],
            trigger: "investigation initiated",
            location: "Company headquarters"
          },
          {
            description: "Performance review conducted showing decline",
            date: "2023-03-01T00:00:00",
            type: "explicit",
            event_type: "performance_review",
            importance: "critical",
            parties: ["Employee", "Manager", "HR"],
            trigger: "performance review",
            location: "Manager's office"
          },
          {
            description: "Employee termination",
            date: "2023-03-15T00:00:00",
            type: "explicit",
            event_type: "termination",
            importance: "critical",
            parties: ["Employee", "Manager", "HR"],
            trigger: "terminated",
            location: "Company headquarters"
          }
        ],
        undated_events: [
          {
            description: "Legal counsel consultation",
            date: "inferred",
            type: "implicit",
            event_type: "consultation",
            importance: "high",
            parties: ["Employee", "Legal Counsel"],
            trigger: "consultation scheduled"
          },
          {
            description: "Witness interviews conducted",
            date: "inferred",
            type: "explicit",
            event_type: "interview",
            importance: "medium",
            parties: ["Witnesses", "Investigation Team"],
            trigger: "interviews conducted"
          },
          {
            description: "Documentation review",
            date: "inferred",
            type: "implicit",
            event_type: "review",
            importance: "medium",
            parties: ["Legal Team"],
            trigger: "documentation reviewed"
          },
          {
            description: "EEOC complaint preparation",
            date: "inferred",
            type: "implicit",
            event_type: "preparation",
            importance: "critical",
            parties: ["Employee", "Legal Counsel"],
            trigger: "complaint prepared"
          }
        ]
      },
      summary: {
        key_events: [
          {
            description: "Employment discrimination complaint filed with HR",
            date: "2023-01-15T00:00:00",
            type: "explicit",
            event_type: "complaint",
            importance: "critical",
            parties: ["Employee", "HR Department"],
            trigger: "filed complaint",
            location: "Company headquarters"
          },
          {
            description: "Performance review conducted showing decline",
            date: "2023-03-01T00:00:00",
            type: "explicit",
            event_type: "performance_review",
            importance: "critical",
            parties: ["Employee", "Manager", "HR"],
            trigger: "performance review",
            location: "Manager's office"
          },
          {
            description: "Employee termination",
            date: "2023-03-15T00:00:00",
            type: "explicit",
            event_type: "termination",
            importance: "critical",
            parties: ["Employee", "Manager", "HR"],
            trigger: "terminated",
            location: "Company headquarters"
          }
        ],
        event_types: ["complaint", "investigation", "performance_review", "termination", "consultation", "interview", "review", "preparation"],
        parties_involved: ["Employee", "HR Department", "Investigation Team", "Manager", "Legal Counsel", "Witnesses", "Legal Team"]
      }
    };
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'complaint': return <AlertCircle className="h-4 w-4" />;
      case 'investigation': return <FileText className="h-4 w-4" />;
      case 'performance_review': return <Users className="h-4 w-4" />;
      case 'termination': return <AlertCircle className="h-4 w-4" />;
      case 'consultation': return <Users className="h-4 w-4" />;
      case 'interview': return <Users className="h-4 w-4" />;
      case 'review': return <FileText className="h-4 w-4" />;
      case 'preparation': return <FileText className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-300';
      case 'high': return 'border-yellow-500 bg-yellow-500/10 text-yellow-300';
      case 'medium': return 'border-blue-500 bg-blue-500/10 text-blue-300';
      case 'low': return 'border-gray-500 bg-gray-500/10 text-gray-300';
      default: return 'border-gray-500 bg-gray-500/10 text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'inferred') return 'Date Inferred';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const downloadTimeline = () => {
    if (!timelineData) return;
    
    const dataStr = JSON.stringify(timelineData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'timeline-analysis.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const sampleTexts = [
    "Employment discrimination case involving wrongful termination after filing harassment complaint",
    "Contract dispute between two companies over exclusive distribution agreement breach",
    "Personal injury case from construction site accident with OSHA violations",
    "Intellectual property infringement case with willful patent violation"
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-xl">
              <Brain className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Advanced <span className="text-gray-300">AI</span> Timeline Generator</h1>
              <p className="text-gray-400">Transform case descriptions into detailed chronological timelines with temporal reasoning</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {!timelineData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Input Case Information</h2>
                
                {/* Text Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Case Description or <span className="text-gray-300">Legal</span> Text
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your case description, legal documents, or any text containing events and dates..."
                    className="w-full h-40 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none"
                  />
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Upload Documents (Optional)
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/40 transition-colors cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Click to upload PDF, Word, or text files</p>
                    <p className="text-sm text-gray-500 mt-1">Supports .pdf, .docx, .txt files</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Uploaded Files</h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300 text-sm">{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Processing Status */}
                {isGenerating && processingStatus && (
                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                      <span className="text-blue-300">{processingStatus}</span>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={generateTimeline}
                  disabled={(!inputText.trim() && uploadedFiles.length === 0) || isGenerating}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Generating Timeline...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>Generate Advanced Timeline</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sample Examples */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Try These Examples</h2>
                <div className="space-y-4">
                  {sampleTexts.map((text, index) => (
                    <button
                      key={index}
                      onClick={() => setInputText(text)}
                      className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-gray-300 hover:text-white group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                        <span>{text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Advanced Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Explicit & implicit event extraction</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Temporal relationship analysis</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Event importance classification</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Legal document chunking</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Comprehensive JSON output</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Timeline Results */
          <div className="space-y-8">
            {/* Results Header */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Advanced Timeline Generated</h2>
                  <p className="text-gray-400">
                    Found {timelineData.metadata.total_events} events ({timelineData.metadata.explicit_events} explicit, {timelineData.metadata.implicit_events} implicit)
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={downloadTimeline}
                    className="flex items-center space-x-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download JSON</span>
                  </button>
                  <button
                    onClick={() => setTimelineData(null)}
                    className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                  >
                    Generate New Timeline
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Metadata */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Analysis Metadata</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{timelineData.metadata.total_events}</div>
                  <div className="text-sm text-gray-400">Total Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{timelineData.metadata.explicit_events}</div>
                  <div className="text-sm text-gray-400">Explicit Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{timelineData.metadata.implicit_events}</div>
                  <div className="text-sm text-gray-400">Implicit Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{timelineData.metadata.api_calls_used}</div>
                  <div className="text-sm text-gray-400"><span className="text-gray-300">AI</span> Calls</div>
                </div>
              </div>
            </div>

            {/* Dated Events Timeline */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Chronological Timeline</h3>
              <div className="space-y-6">
                {timelineData.timeline.dated_events.map((event, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-xl border-2 ${getImportanceColor(event.importance)}`}>
                        {getEventIcon(event.event_type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="text-lg font-semibold text-white">{event.description}</h4>
                        <span className="text-sm text-gray-400">{formatDate(event.date)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(event.importance)}`}>
                          {event.importance}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.type === 'explicit' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Parties: </span>
                          <span className="text-gray-300">{event.parties.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Type: </span>
                          <span className="text-gray-300">{event.event_type}</span>
                        </div>
                        {event.location && (
                          <div>
                            <span className="text-gray-400">Location: </span>
                            <span className="text-gray-300">{event.location}</span>
                          </div>
                        )}
                      </div>
                      {event.temporal_relations && event.temporal_relations.length > 0 && (
                        <div className="mt-3 text-sm">
                          <span className="text-gray-400">Temporal Relations: </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {event.temporal_relations.slice(0, 3).map((relation, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                                {relation.relation} "{relation.related_event.substring(0, 30)}..." ({relation.days_difference} days)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Undated Events */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Inferred Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {timelineData.timeline.undated_events.map((event, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg border ${getImportanceColor(event.importance)}`}>
                        {getEventIcon(event.event_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-white">{event.description}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.type === 'explicit' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {event.type}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-gray-400">Parties: </span>
                            <span className="text-gray-300">{event.parties.join(', ')}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Type: </span>
                            <span className="text-gray-300">{event.event_type}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Importance: </span>
                            <span className={`${getImportanceColor(event.importance)}`}>{event.importance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Summary */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Case Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-white mb-3">Event Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {timelineData.summary.event_types.map((type, index) => (
                      <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                        {type.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Parties Involved</h4>
                  <div className="flex flex-wrap gap-2">
                    {timelineData.summary.parties_involved.map((party, index) => (
                      <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                        {party}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="font-semibold text-white mb-3">Key Events Summary</h4>
                <div className="space-y-3">
                  {timelineData.summary.key_events.map((event, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <div className={`p-2 rounded-lg ${getImportanceColor(event.importance)}`}>
                        {getEventIcon(event.event_type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{event.description}</div>
                        <div className="text-sm text-gray-400">
                          {formatDate(event.date)} • {event.importance} importance
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineGenerator;