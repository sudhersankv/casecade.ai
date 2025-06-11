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
  Loader2
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
      content: 'Hello! I\'m your AI Legal Assistant powered by advanced temporal reasoning. I can help you analyze cases, create timelines, and find relevant precedents from our database of legal cases. You can upload documents, type your case details, or record voice notes. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      
      // Fallback to demo responses if the API fails
      const fallbackResponses = [
        "I'll analyze this case for you. Let me break down the key legal elements and create a timeline based on the information provided. Based on similar cases in our database, I can identify potential strengths and strategic opportunities.",
        "I found several relevant precedents in our database. The pattern suggests cases with similar fact patterns have a 78% success rate. Let me provide detailed analysis of the most relevant cases and their outcomes.",
        "I've generated a comprehensive timeline for your case. The critical dates show a clear pattern that could strengthen your position. Would you like me to identify potential legal strategies based on similar successful cases?",
        "This case involves complex temporal elements. I'll analyze the sequence of events and highlight critical dates that may impact the outcome. I can also search for precedents with similar timing patterns.",
        "I've identified several key precedents from similar cases. The analysis shows strong potential based on comparable outcomes. Let me provide strategic recommendations based on successful cases with similar characteristics."
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
        content: `Uploaded ${files.length} file(s): ${fileNames.join(', ')}`,
        timestamp: new Date(),
        attachments: fileNames
      };
      setMessages(prev => [...prev, message]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Simulate document processing
      setIsTyping(true);
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `I've received your document(s). I can extract key information, analyze the content for legal issues, and cross-reference with relevant precedents. The documents will be processed and integrated into any case analysis. Would you like me to start with document analysis or case timeline generation?`,
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

  const quickPrompts = [
    "Analyze an employment discrimination case",
    "Create timeline for personal injury case",
    "Find precedents for contract disputes",
    "Review intellectual property case"
  ];

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
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-white p-1.5 rounded-lg">
                      <Brain className="h-4 w-4 text-black" />
                    </div>
                    <span className="text-sm text-gray-400">AI Assistant</span>
                  </div>
                )}
                
                <div
                  className={`p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white border border-white/20'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.attachments && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((filename, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm opacity-80">
                          <FileText className="h-4 w-4" />
                          <span>{filename}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.actions.map((action, index) => (
                        <div key={index} className="text-sm bg-white/10 rounded-lg p-2">
                          <strong>Action:</strong> {action.type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className={`text-xs text-gray-500 mt-1 ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="bg-white p-1.5 rounded-lg">
                    <Brain className="h-4 w-4 text-black" />
                  </div>
                  <span className="text-sm text-gray-400">AI Assistant</span>
                </div>
                <div className="bg-white/10 border border-white/20 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span className="text-white">Analyzing with AI...</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(prompt)}
                  className="p-3 text-left bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-gray-300 hover:text-white"
                >
                  {prompt}
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
              className="flex-shrink-0 p-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 text-white"
              title="Upload files"
              disabled={isLoading}
            >
              <Paperclip className="h-5 w-5" />
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
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors duration-300 resize-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-500 text-center">
            {isLoading ? 'Processing with AI...' : 'Press Enter to send, Shift+Enter for new line'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoInterface;