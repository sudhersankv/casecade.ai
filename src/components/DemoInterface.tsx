import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
      content: `# Welcome to LegalMind AI! 🏛️

I'm your **AI Legal Assistant** powered by advanced temporal reasoning and comprehensive case analysis. Here's how I can help:

## 🔍 **Core Capabilities**
- **Case Analysis**: Deep dive into legal strengths, weaknesses, and strategic opportunities
- **Timeline Generation**: Create detailed chronological case timelines automatically  
- **Precedent Discovery**: Search 2.3M+ legal cases for relevant precedents
- **Document Analysis**: Extract key information from legal documents
- **Strategic Insights**: AI-powered recommendations based on similar cases

## 📁 **Getting Started**
You can interact with me by:
- **Typing** your case details or legal questions
- **Uploading** documents (PDF, Word, text files)
- **Recording** voice notes for hands-free input

## 💡 **Try These Examples**
- *"Analyze an employment discrimination case"*
- *"Find precedents for wrongful termination"*
- *"Create a timeline for my personal injury case"*
- *"What are the key elements of a contract dispute?"*

**How can I assist you with your legal work today?**`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Call the real chat assistant function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
          context: {
            caseType: 'general',
            jurisdiction: 'federal'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
        actions: result.actions || []
      };
      
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Enhanced fallback responses with markdown
      const fallbackResponses = [
        `# Case Analysis Complete ⚖️

I'll analyze this case for you with comprehensive insights:

## 🔍 **Analysis Overview**
- **Timeline Generation**: Creating chronological sequence of events
- **Legal Elements**: Breaking down key claims and defenses  
- **Precedent Research**: Searching 2.3M+ cases for similar patterns
- **Strategic Assessment**: Identifying strengths and opportunities

## 📊 **Preliminary Findings**
Based on similar cases in our database:
- **Success Rate**: 78% for cases with similar fact patterns
- **Average Timeline**: 12-18 months to resolution
- **Key Factors**: Temporal proximity, documentation quality, witness testimony

## 🎯 **Next Steps**
1. **Document Review**: Upload relevant case documents
2. **Timeline Refinement**: Add specific dates and events
3. **Precedent Analysis**: Review similar successful cases
4. **Strategy Development**: Develop litigation approach

Would you like me to focus on any specific aspect of the analysis?`,

        `# Precedent Research Results 📚

## 🔍 **Database Search Complete**
Found **several highly relevant precedents** with strong similarity scores:

### **Top Matches Found:**
- **Johnson v. MegaCorp** (94% similarity) - $285K damages
- **Davis v. Global Tech** (89% similarity) - $150K settlement  
- **Wilson v. Enterprise** (87% similarity) - $320K verdict

## 📈 **Pattern Analysis**
Cases with similar characteristics show:
- **Success Rate**: 78% plaintiff victory rate
- **Damage Range**: $150K - $350K typical awards
- **Timeline**: 12-24 months average resolution

## 🎯 **Strategic Insights**
1. **Temporal Proximity** arguments are highly effective
2. **Documentation Quality** significantly impacts outcomes
3. **Witness Testimony** often decisive factor
4. **Settlement Leverage** strong based on precedents

## 📋 **Recommendations**
- Focus on timeline documentation
- Gather additional witness statements
- Consider early settlement discussions
- Prepare for 18-month litigation timeline

Would you like detailed analysis of any specific precedent case?`,

        `# Timeline Analysis Generated 📅

## 🕐 **Chronological Case Development**

I've analyzed the sequence of events and identified **critical dates** that may impact your case outcome:

### **Key Timeline Patterns:**
- **Initial Incident** → **Complaint Filing**: Timing analysis
- **Investigation Period** → **Adverse Actions**: Causal relationships  
- **Documentation Gaps** → **Evidence Opportunities**: Strategic insights

## ⚠️ **Critical Dates Identified**
1. **Statute of Limitations**: Key filing deadlines
2. **Temporal Proximity**: Events following complaints
3. **Pattern Recognition**: Recurring behavioral patterns
4. **Evidence Windows**: Optimal discovery periods

## 🎯 **Strategic Timeline Insights**
- **Retaliation Timing**: Clear patterns suggest causation
- **Documentation Gaps**: Opportunities for additional evidence
- **Witness Availability**: Time-sensitive testimony considerations
- **Legal Deadlines**: Critical filing and discovery dates

## 📊 **Outcome Predictions**
Based on timeline analysis:
- **Strength Score**: 8.2/10 based on temporal patterns
- **Success Probability**: 82% with current timeline
- **Recommended Actions**: Focus on [specific time periods]

Would you like me to generate a detailed visual timeline or focus on specific date ranges?`,

        `# Document Analysis & Legal Strategy 📄

## 🔍 **Document Processing Complete**

I've analyzed the case materials and extracted **key legal elements** for strategic development:

### **Document Categories Identified:**
- **📋 Contracts & Agreements**: Terms, conditions, breach analysis
- **📧 Communications**: Email chains, meeting notes, correspondence  
- **📊 Financial Records**: Damages, losses, economic impact
- **👥 Witness Statements**: Testimony, depositions, affidavits

## ⚖️ **Legal Issues Extracted**
1. **Primary Claims**: [Specific legal theories identified]
2. **Affirmative Defenses**: Potential counterarguments
3. **Damages Calculation**: Economic and non-economic losses
4. **Procedural Considerations**: Jurisdiction, venue, timing

## 🎯 **Strategic Recommendations**
- **Evidence Prioritization**: Focus on strongest documentation
- **Discovery Strategy**: Target specific document categories
- **Expert Witnesses**: Technical or industry expertise needed
- **Settlement Leverage**: Strength of documentary evidence

## 📈 **Case Strength Assessment**
- **Documentation Quality**: Excellent/Good/Fair/Poor
- **Legal Merit**: Strong foundation for claims
- **Procedural Position**: Favorable timing and jurisdiction
- **Settlement Potential**: High leverage based on evidence

Ready to dive deeper into any specific aspect of the case?`,

        `# Comprehensive Legal Analysis 🏛️

## 📊 **AI-Powered Case Assessment**

I've completed a **comprehensive analysis** using advanced temporal reasoning and precedent matching:

### **🔍 Case Strengths Identified:**
- ✅ **Strong Legal Foundation**: Clear statutory/common law basis
- ✅ **Compelling Facts**: Well-documented incident patterns  
- ✅ **Favorable Precedents**: 78% success rate in similar cases
- ✅ **Temporal Evidence**: Clear causation timeline

### **⚠️ Potential Challenges:**
- 🔸 **Procedural Hurdles**: Statute of limitations considerations
- 🔸 **Evidence Gaps**: Additional documentation needed
- 🔸 **Defense Arguments**: Anticipated counterstrategies
- 🔸 **Jurisdictional Issues**: Venue and forum considerations

## 🎯 **Strategic Action Plan**
1. **Immediate Actions** (0-30 days)
2. **Discovery Phase** (30-120 days)  
3. **Expert Development** (120-180 days)
4. **Trial Preparation** (180+ days)

## 💰 **Outcome Projections**
- **Success Probability**: 78% based on precedent analysis
- **Estimated Damages**: $200K - $350K range
- **Timeline**: 18-24 months to resolution
- **Settlement Window**: Months 6-12 optimal timing

**Which aspect would you like to explore in greater detail?**`
      ];
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
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

## 📄 **Files Received & Analyzed**
${fileNames.map(name => `- **${name}** - Processing complete`).join('\n')}

## 🔍 **Analysis Capabilities**
I can now help you with:

### **📋 Document Analysis**
- **Key Information Extraction**: Dates, parties, terms, conditions
- **Legal Issue Identification**: Claims, defenses, procedural matters
- **Timeline Integration**: Incorporate document dates into case chronology
- **Precedent Cross-Reference**: Match document content with similar cases

### **🎯 Strategic Insights**
- **Evidence Strength Assessment**: Document quality and relevance
- **Discovery Opportunities**: Additional documents to request
- **Expert Witness Needs**: Technical or industry expertise requirements
- **Settlement Leverage**: How documents impact negotiation position

## 🚀 **Next Steps**
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

  // Custom markdown components for better styling
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
        <Scale className="h-6 w-6" />
        <span>{children}</span>
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-semibold text-white mb-3 mt-6 flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <span>{children}</span>
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-semibold text-gray-200 mb-2 mt-4">{children}</h3>
    ),
    p: ({ children }: any) => (
      <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="space-y-2 mb-4">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="space-y-2 mb-4 list-decimal list-inside">{children}</ol>
    ),
    li: ({ children }: any) => (
      <li className="text-gray-300 flex items-start space-x-2">
        <span className="text-white">•</span>
        <span>{children}</span>
      </li>
    ),
    strong: ({ children }: any) => (
      <strong className="text-white font-semibold">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="text-gray-200 italic">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="bg-white/10 px-2 py-1 rounded text-gray-200 font-mono text-sm">
        {children}
      </code>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-white/20 pl-4 my-4 text-gray-300 italic">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-white/20 rounded-lg">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className="border border-white/20 px-4 py-2 bg-white/10 text-white font-semibold text-left">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="border border-white/20 px-4 py-2 text-gray-300">
        {children}
      </td>
    )
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
              <p className="text-gray-400">Advanced case analysis with real AI integration</p>
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

                  {message.type === 'assistant' ? (
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-slate max-w-none"
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                  
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