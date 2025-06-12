import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Upload, 
  Mic, 
  MicOff, 
  Brain, 
  FileText, 
  Clock,
  Scale,
  Plus,
  Paperclip,
  Loader2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Gavel,
  Copy,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: string[];
  actions?: any[];
}

const DemoInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Welcome to LegalMind AI! 🏛️

I'm your AI Legal Assistant powered by advanced temporal reasoning and comprehensive case analysis. Here's how I can help:

## Core Capabilities
- **Case Analysis**: Deep dive into legal strengths, weaknesses, and strategic opportunities
- **Timeline Generation**: Create detailed chronological case timelines automatically  
- **Precedent Discovery**: Search 2.3M+ legal cases for relevant precedents
- **Document Analysis**: Extract key information from legal documents
- **Strategic Insights**: AI-powered recommendations based on similar cases

## Getting Started
You can interact with me by:
- **Typing** your case details or legal questions
- **Uploading** documents (PDF, Word, text files)
- **Recording** voice notes for hands-free input

## Try These Examples
- "Analyze an employment discrimination case"
- "Find precedents for wrongful termination"
- "Create a timeline for my personal injury case"
- "What are the key elements of a contract dispute?"

**How can I assist you with your legal work today?**`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, shouldAutoScroll]);

  const getIntelligentResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Employment/Discrimination cases
    if (message.includes('employment') || message.includes('discrimination') || message.includes('workplace') || message.includes('wrongful termination')) {
      return `# Employment Law Analysis ⚖️

## Case Assessment Complete
I've analyzed your employment matter using our comprehensive legal database:

### Key Findings
- **Case Type**: Employment Discrimination/Wrongful Termination
- **Jurisdiction**: Federal and State Law Application
- **Statute of Limitations**: Typically 180-300 days for EEOC filing
- **Success Rate**: 68% for similar cases with proper documentation

### Critical Elements to Establish
1. **Protected Class Status**: Age, race, gender, disability, religion, etc.
2. **Adverse Employment Action**: Termination, demotion, harassment
3. **Causal Connection**: Temporal proximity between complaint and action
4. **Pretext Analysis**: Employer's stated reasons vs. actual motivation

### Precedent Analysis
Recent similar cases show:
- **Average Settlement**: $85K - $250K range
- **Timeline**: 12-18 months to resolution
- **Key Success Factors**: Documentation, witness testimony, pattern evidence

### Recommended Next Steps
1. **Document Preservation**: Secure all emails, performance reviews, communications
2. **EEOC Filing**: File charge within statutory deadline
3. **Witness Identification**: Colleagues who observed discriminatory conduct
4. **Damages Calculation**: Lost wages, benefits, emotional distress

**Would you like me to focus on any specific aspect of your employment case?**`;
    }
    
    // Personal Injury cases
    if (message.includes('personal injury') || message.includes('accident') || message.includes('injury') || message.includes('negligence')) {
      return `# Personal Injury Case Analysis 🏥

## Comprehensive Case Review
I've analyzed your personal injury matter with advanced AI assessment:

### Liability Analysis
- **Duty of Care**: Establishing defendant's legal obligation
- **Breach of Duty**: How defendant failed to meet standard of care
- **Causation**: Direct link between breach and your injuries
- **Damages**: Quantifiable harm and losses

### Case Strength Indicators
- **Medical Documentation**: Quality and completeness of treatment records
- **Witness Testimony**: Independent verification of incident
- **Expert Opinions**: Medical and accident reconstruction specialists
- **Comparative Fault**: Your percentage of responsibility (if any)

### Damages Assessment
**Economic Damages:**
- Medical expenses (past and future)
- Lost wages and earning capacity
- Property damage
- Rehabilitation costs

**Non-Economic Damages:**
- Pain and suffering
- Emotional distress
- Loss of enjoyment of life
- Permanent disability/disfigurement

### Settlement Projections
Based on similar cases:
- **Mild Injuries**: $15K - $50K range
- **Moderate Injuries**: $50K - $150K range  
- **Severe Injuries**: $150K+ potential
- **Timeline**: 6-24 months typical resolution

**What specific aspects of your injury case would you like me to analyze further?**`;
    }
    
    // Contract disputes
    if (message.includes('contract') || message.includes('breach') || message.includes('agreement') || message.includes('dispute')) {
      return `# Contract Dispute Analysis 📋

## Contract Analysis Complete
I've reviewed your contract dispute using advanced legal reasoning:

### Essential Contract Elements
1. **Offer & Acceptance**: Clear terms and mutual agreement
2. **Consideration**: Exchange of value between parties
3. **Capacity**: Legal ability to enter contract
4. **Legality**: Lawful purpose and terms

### Breach Analysis Framework
- **Material vs. Minor Breach**: Severity and impact assessment
- **Anticipatory Breach**: Early indication of non-performance
- **Substantial Performance**: Degree of completion achieved
- **Excuse for Non-Performance**: Force majeure, impossibility, frustration

### Remedies Available
**Monetary Damages:**
- **Expectation Damages**: Benefit of the bargain
- **Reliance Damages**: Out-of-pocket expenses
- **Restitution**: Unjust enrichment recovery
- **Consequential Damages**: Foreseeable losses

**Equitable Remedies:**
- **Specific Performance**: Force contract completion
- **Injunctive Relief**: Prevent harmful actions
- **Rescission**: Cancel contract and restore status quo
- **Reformation**: Correct contract terms

### Success Probability
Contract cases with similar fact patterns:
- **Clear Breach**: 85% success rate
- **Disputed Terms**: 60% success rate
- **Average Recovery**: 70-90% of claimed damages
- **Timeline**: 8-18 months to resolution

**Which aspect of your contract dispute needs deeper analysis?**`;
    }
    
    // Timeline requests
    if (message.includes('timeline') || message.includes('chronology') || message.includes('sequence') || message.includes('dates')) {
      return `# Case Timeline Analysis 📅

## Chronological Analysis Complete
I've generated a comprehensive timeline framework for your case:

### Critical Timeline Components
1. **Incident Date**: Primary event triggering legal action
2. **Notice Periods**: When parties became aware of issues
3. **Statute of Limitations**: Filing deadlines and time constraints
4. **Discovery Cutoffs**: Evidence gathering deadlines
5. **Settlement Windows**: Optimal negotiation periods

### Timeline Pattern Analysis
**Temporal Proximity Factors:**
- Events occurring within 30 days: High causation inference
- Events within 90 days: Moderate causation inference  
- Events beyond 180 days: Requires additional evidence
- Pattern recognition: Recurring behaviors or incidents

### Strategic Timeline Insights
**Strength Indicators:**
- ✅ **Immediate Documentation**: Real-time evidence creation
- ✅ **Witness Availability**: Contemporaneous observations
- ✅ **Clear Causation**: Direct temporal relationships
- ✅ **Consistent Narrative**: Logical sequence of events

**Potential Challenges:**
- ⚠️ **Memory Degradation**: Witness recollection issues
- ⚠️ **Document Gaps**: Missing contemporaneous records
- ⚠️ **Intervening Causes**: Alternative explanations for events
- ⚠️ **Statute Issues**: Time limitation concerns

### Timeline Development Process
1. **Event Mapping**: Chronological incident placement
2. **Evidence Correlation**: Document-to-event matching
3. **Witness Integration**: Testimony timeline alignment
4. **Gap Analysis**: Missing information identification
5. **Narrative Construction**: Coherent story development

**Would you like me to create a detailed timeline for your specific case events?**`;
    }
    
    // Precedent search requests
    if (message.includes('precedent') || message.includes('similar case') || message.includes('case law') || message.includes('find cases')) {
      return `# Precedent Research Results 📚

## Legal Database Search Complete
I've searched our comprehensive case database for relevant precedents:

### Search Methodology
- **Keyword Analysis**: Legal terms and fact pattern matching
- **Jurisdiction Filtering**: Relevant court systems and levels
- **Temporal Relevance**: Recent decisions and current law
- **Similarity Scoring**: AI-powered case comparison algorithms

### Top Precedent Matches
**Highly Relevant Cases (90%+ similarity):**
- **Johnson v. MegaCorp Industries** (2023) - $285K verdict
  - Similar fact pattern, identical legal theory
  - Federal district court, binding precedent
  - Key holding: Temporal proximity establishes causation

- **Davis v. Global Technologies** (2022) - $150K settlement
  - Comparable damages calculation methodology  
  - State supreme court, persuasive authority
  - Key holding: Documentation quality affects credibility

- **Wilson v. Enterprise Solutions** (2023) - $320K jury award
  - Parallel procedural posture and claims
  - Circuit court of appeals, controlling authority
  - Key holding: Pattern evidence supports discrimination claim

### Statistical Analysis
**Success Rate Patterns:**
- Cases with similar facts: **78% plaintiff success rate**
- Average damage awards: **$185K median, $275K mean**
- Settlement rate: **65% resolve before trial**
- Timeline: **14 months average resolution**

### Strategic Applications
**Favorable Precedents Support:**
- Legal theory validation and case strength
- Damages calculation benchmarks and ranges
- Procedural strategy and motion practice
- Settlement negotiation leverage and positioning

**Distinguishing Adverse Cases:**
- Factual differences and unique circumstances
- Jurisdictional variations and law changes
- Procedural distinctions and case posture
- Temporal factors and legal evolution

**Which precedent cases would you like me to analyze in greater detail?**`;
    }
    
    // Default comprehensive response
    return `# Comprehensive Legal Analysis 🏛️

## AI-Powered Case Assessment
I've completed a comprehensive analysis using advanced temporal reasoning and precedent matching:

### Case Strengths Identified:
- ✅ **Strong Legal Foundation**: Clear statutory/common law basis
- ✅ **Compelling Facts**: Well-documented incident patterns  
- ✅ **Favorable Precedents**: 78% success rate in similar cases
- ✅ **Temporal Evidence**: Clear causation timeline

### Potential Challenges:
- 🔸 **Procedural Hurdles**: Statute of limitations considerations
- 🔸 **Evidence Gaps**: Additional documentation needed
- 🔸 **Defense Arguments**: Anticipated counterstrategies
- 🔸 **Jurisdictional Issues**: Venue and forum considerations

## Strategic Action Plan
1. **Immediate Actions** (0-30 days)
   - Document preservation and collection
   - Witness identification and interviews
   - Expert consultation and retention

2. **Discovery Phase** (30-120 days)  
   - Formal discovery requests and responses
   - Depositions and document production
   - Expert witness preparation

3. **Expert Development** (120-180 days)
   - Expert reports and testimony preparation
   - Damages calculation and analysis
   - Case theory refinement

4. **Trial Preparation** (180+ days)
   - Motion practice and pre-trial procedures
   - Settlement negotiations and mediation
   - Trial strategy and presentation

## Outcome Projections
- **Success Probability**: 78% based on precedent analysis
- **Estimated Damages**: $200K - $350K range
- **Timeline**: 18-24 months to resolution
- **Settlement Window**: Months 6-12 optimal timing

**Which aspect would you like to explore in greater detail?**`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setShouldAutoScroll(true); // Enable auto-scroll for new messages
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getIntelligentResponse(currentMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      setIsLoading(false);
    }, 2000 + Math.random() * 2000); // 2-4 seconds for realistic AI processing
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(file => file.name);
      const message: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `📎 **Uploaded ${files.length} file(s):**\n${fileNames.map(name => `- ${name}`).join('\n')}`,
        timestamp: new Date(),
        attachments: fileNames
      };
      setMessages(prev => [...prev, message]);
      setShouldAutoScroll(true); // Enable auto-scroll for new messages
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Simulate document processing with enhanced response
      setIsTyping(true);
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `# Document Processing Complete ✅

## Files Received & Analyzed
${fileNames.map(name => `- **${name}** - Processing complete`).join('\n')}

## Analysis Capabilities
I can now help you with:

### Document Analysis
- **Key Information Extraction**: Dates, parties, terms, conditions
- **Legal Issue Identification**: Claims, defenses, procedural matters
- **Timeline Integration**: Incorporate document dates into case chronology
- **Precedent Cross-Reference**: Match document content with similar cases

### Strategic Insights
- **Evidence Strength Assessment**: Document quality and relevance
- **Discovery Opportunities**: Additional documents to request
- **Expert Witness Needs**: Technical or industry expertise requirements
- **Settlement Leverage**: How documents impact negotiation position

## Next Steps
Would you like me to:
1. **Extract key information** from the uploaded documents?
2. **Generate a timeline** incorporating document dates?
3. **Find precedent cases** similar to your document content?
4. **Analyze legal issues** identified in the documents?

**What aspect would you like me to focus on first?**`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const quickPrompts = [
    "Analyze an employment discrimination case",
    "Create timeline for personal injury case", 
    "Find precedents for contract disputes",
    "Review intellectual property case"
  ];

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mb-4 flex items-center space-x-2"><span>$1</span></h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-white mb-3 mt-6">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-200 mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="text-gray-200 italic">$1</em>')
      .replace(/^- (.+)$/gm, '<li class="text-gray-300 flex items-start space-x-2"><span class="text-white">•</span><span>$1</span></li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="text-gray-300 mb-2">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-gray-300 mb-3 leading-relaxed">')
      .replace(/^(?!<[h|l])/gm, '<p class="text-gray-300 mb-3 leading-relaxed">')
      .replace(/$(?!<\/[h|l])/gm, '</p>');
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-xl">
              <Brain className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Legal Assistant</h1>
              <p className="text-gray-400">Advanced case analysis with intelligent responses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-white p-1.5 rounded-lg">
                      <Brain className="h-4 w-4 text-black" />
                    </div>
                    <span className="text-sm text-gray-400">AI Assistant</span>
                  </div>
                )}
                
                <div
                  className={`p-6 rounded-2xl relative group ${
                    message.type === 'user'
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white border border-white/20'
                  }`}
                >
                  {/* Copy button for assistant messages */}
                  {message.type === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-white/10 rounded-lg"
                      title="Copy message"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  )}

                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: message.type === 'assistant' 
                        ? formatContent(message.content)
                        : message.content.replace(/\n/g, '<br>')
                    }}
                  />
                  
                  {message.attachments && (
                    <div className="mt-4 space-y-2">
                      {message.attachments.map((filename, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm opacity-80">
                          <FileText className="h-4 w-4" />
                          <span>{filename}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {message.actions.map((action, index) => (
                        <div key={index} className="text-sm bg-white/10 rounded-lg p-3 border border-white/20">
                          <div className="flex items-center space-x-2">
                            <Gavel className="h-4 w-4 text-white" />
                            <strong className="text-white">Action:</strong> 
                            <span className="text-gray-300">{action.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className={`text-xs text-gray-500 mt-2 ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[85%]">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-white p-1.5 rounded-lg">
                    <Brain className="h-4 w-4 text-black" />
                  </div>
                  <span className="text-sm text-gray-400">AI Assistant</span>
                </div>
                <div className="bg-white/10 border border-white/20 p-6 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    <span className="text-white">Analyzing with AI...</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Try These Examples</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(prompt)}
                  className="p-4 text-left bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-gray-300 hover:text-white group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{prompt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 bg-white/5 border-t border-white/10">
          <div className="flex items-end space-x-4">
            {/* File Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 p-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 text-white group"
              title="Upload files"
              disabled={isLoading}
            >
              <Paperclip className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
            />

            {/* Voice Recording */}
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`flex-shrink-0 p-3 border rounded-xl transition-all duration-300 ${
                isRecording
                  ? 'bg-red-500 border-red-500 text-white animate-pulse'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title={isRecording ? 'Stop recording' : 'Start recording'}
              disabled={isLoading}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your case, upload documents, or ask a legal question..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-500 text-center">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Processing with AI...</span>
              </div>
            ) : (
              'Press Enter to send, Shift+Enter for new line'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoInterface;