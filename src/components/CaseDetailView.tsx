import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Calendar, 
  Search, 
  BarChart3, 
  Pin, 
  PinOff,
  Edit,
  Trash2,
  Download,
  Eye,
  Plus,
  Clock,
  Users,
  Scale,
  AlertCircle,
  CheckCircle,
  Star,
  Brain,
  Zap,
  Timeline
} from 'lucide-react';
import TimelineEditor from './TimelineEditor';

interface CaseDetailViewProps {
  case_: any;
  onBack: () => void;
  onUpdate: (updatedCase: any) => void;
}

const CaseDetailView: React.FC<CaseDetailViewProps> = ({ case_, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTimelineEditor, setShowTimelineEditor] = useState(false);
  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'Employment Contract.pdf',
      type: 'Contract',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      status: 'processed'
    },
    {
      id: '2',
      name: 'HR Investigation Report.docx',
      type: 'Report',
      size: '1.8 MB',
      uploadedAt: '2024-01-16',
      status: 'processed'
    },
    {
      id: '3',
      name: 'Witness Statements.pdf',
      type: 'Evidence',
      size: '3.2 MB',
      uploadedAt: '2024-01-18',
      status: 'processing'
    }
  ]);

  const [timeline, setTimeline] = useState([
    {
      id: '1',
      date: '2023-01-15',
      event: 'Initial Complaint Filed',
      description: 'Employee files internal complaint about workplace harassment',
      type: 'complaint',
      importance: 'high'
    },
    {
      id: '2',
      date: '2023-02-03',
      event: 'HR Investigation Begins',
      description: 'Company initiates formal investigation into harassment allegations',
      type: 'investigation',
      importance: 'medium'
    },
    {
      id: '3',
      date: '2023-03-15',
      event: 'Performance Review Meeting',
      description: 'Sudden negative performance review following complaint',
      type: 'retaliation',
      importance: 'critical'
    },
    {
      id: '4',
      date: '2023-04-10',
      event: 'Termination Notice',
      description: 'Employee terminated citing performance issues',
      type: 'termination',
      importance: 'critical'
    }
  ]);

  const togglePin = () => {
    const updatedCase = { ...case_, isPinned: !case_.isPinned };
    onUpdate(updatedCase);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newDocuments = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'Document',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'processing'
      }));
      setDocuments(prev => [...prev, ...newDocuments]);
    }
  };

  const handleTimelineSave = (events: any[]) => {
    setTimeline(events.map(event => ({
      id: event.id,
      date: event.date,
      event: event.title,
      description: event.description,
      type: event.eventType,
      importance: event.importance
    })));
    setShowTimelineEditor(false);
    
    // Update case with new timeline count
    const updatedCase = { 
      ...case_, 
      timelineEvents: events.length,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    onUpdate(updatedCase);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'on_hold': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'complaint': return <AlertCircle className="h-4 w-4" />;
      case 'investigation': return <Search className="h-4 w-4" />;
      case 'retaliation': return <Star className="h-4 w-4" />;
      case 'termination': return <Scale className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-yellow-500 bg-yellow-500/10';
      case 'medium': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'analysis', label: 'AI Analysis', icon: Brain },
    { id: 'precedents', label: 'Similar Cases', icon: Search }
  ];

  if (showTimelineEditor) {
    return (
      <TimelineEditor
        caseId={case_.id}
        initialEvents={timeline.map(event => ({
          id: event.id,
          date: event.date,
          title: event.event,
          description: event.description,
          type: 'explicit' as const,
          eventType: event.type,
          importance: event.importance as any,
          parties: [],
          order: 0
        }))}
        onSave={handleTimelineSave}
        onClose={() => setShowTimelineEditor(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePin}
                className={`p-2 rounded-xl transition-colors ${
                  case_.isPinned ? 'text-silver-300 bg-silver-500/20' : 'text-gray-400 hover:text-silver-300'
                }`}
              >
                {case_.isPinned ? <Pin className="h-5 w-5" /> : <PinOff className="h-5 w-5" />}
              </button>
              
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Edit className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{case_.title}</h1>
              <p className="text-gray-400 mb-4">{case_.description}</p>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{case_.client}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Scale className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{case_.caseType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Jurisdiction:</span>
                  <span className="text-gray-300">{case_.jurisdiction}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(case_.status)}`}>
                {case_.status.replace('_', ' ')}
              </div>
              
              <div className={`flex items-center space-x-1 ${getPriorityColor(case_.priority)}`}>
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium capitalize">{case_.priority}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-silver-400 text-silver-300'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500/20 p-3 rounded-xl">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{case_.documentsCount}</div>
                      <div className="text-gray-400">Documents</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500/20 p-3 rounded-xl">
                      <Calendar className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{case_.timelineEvents}</div>
                      <div className="text-gray-400">Timeline Events</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-500/20 p-3 rounded-xl">
                      <BarChart3 className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">78%</div>
                      <div className="text-gray-400">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab('documents')}
                    className="flex flex-col items-center space-y-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300"
                  >
                    <Upload className="h-6 w-6 text-blue-400" />
                    <span className="text-sm font-medium text-white">Upload Files</span>
                  </button>
                  
                  <button
                    onClick={() => setShowTimelineEditor(true)}
                    className="flex flex-col items-center space-y-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300"
                  >
                    <Timeline className="h-6 w-6 text-yellow-400" />
                    <span className="text-sm font-medium text-white">Edit Timeline</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className="flex flex-col items-center space-y-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300"
                  >
                    <Brain className="h-6 w-6 text-purple-400" />
                    <span className="text-sm font-medium text-white">AI Analysis</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('precedents')}
                    className="flex flex-col items-center space-y-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300"
                  >
                    <Search className="h-6 w-6 text-green-400" />
                    <span className="text-sm font-medium text-white">Find Similar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Case Info */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Case Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Created</label>
                    <div className="text-white">{new Date(case_.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Last Updated</label>
                    <div className="text-white">{new Date(case_.updatedAt).toLocaleDateString()}</div>
                  </div>
                  {case_.nextDeadline && (
                    <div>
                      <label className="text-sm text-gray-400">Next Deadline</label>
                      <div className="text-yellow-400">{new Date(case_.nextDeadline).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Document uploaded</span>
                    <span className="text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Timeline updated</span>
                    <span className="text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300">AI analysis completed</span>
                    <span className="text-gray-500">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Upload Documents</h3>
                <p className="text-gray-400 mb-6">Upload legal documents for AI analysis and timeline generation</p>
                
                <label className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-silver-400 to-silver-300 text-black rounded-xl font-bold hover:from-silver-300 hover:to-silver-200 transition-all duration-300 cursor-pointer">
                  <Upload className="h-5 w-5" />
                  <span>Choose Files</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                
                <p className="text-sm text-gray-500 mt-4">Supports PDF, Word, and text files</p>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Uploaded Documents</h3>
              
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-500/20 p-3 rounded-xl">
                        <FileText className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{doc.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'processed' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {doc.status}
                      </div>
                      
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {/* Timeline Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Case Timeline</h2>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowTimelineEditor(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-silver-400 to-silver-300 text-black rounded-xl font-bold hover:from-silver-300 hover:to-silver-200 transition-all duration-300"
                >
                  <Edit className="h-5 w-5" />
                  <span>Edit Timeline</span>
                </button>
                <button className="flex items-center space-x-2 px-6 py-3 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors">
                  <Zap className="h-5 w-5" />
                  <span>AI Generate</span>
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              {timeline.length > 0 ? (
                <div className="space-y-6">
                  {timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className={`p-3 rounded-xl border-2 ${getImportanceColor(event.importance)}`}>
                          {getEventIcon(event.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h4 className="text-lg font-semibold text-white">{event.event}</h4>
                          <span className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.importance === 'critical' ? 'bg-red-500/20 text-red-300' :
                            event.importance === 'high' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {event.importance}
                          </span>
                        </div>
                        <p className="text-gray-400">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Timeline Created</h3>
                  <p className="text-gray-400 mb-6">Create a timeline to track important case events and dates</p>
                  <button 
                    onClick={() => setShowTimelineEditor(true)}
                    className="px-6 py-3 bg-gradient-to-r from-silver-400 to-silver-300 text-black rounded-xl font-bold hover:from-silver-300 hover:to-silver-200 transition-all duration-300"
                  >
                    Create Timeline
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">AI Case Analysis</h2>
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-silver-400 to-silver-300 text-black rounded-xl font-bold hover:from-silver-300 hover:to-silver-200 transition-all duration-300">
                <Brain className="h-5 w-5" />
                <span>Run Analysis</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Case Strengths</span>
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Clear temporal proximity between complaint and adverse actions</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Multiple witnesses to support harassment claims</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Documented pattern of retaliation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span>Potential Challenges</span>
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Some performance issues documented prior to complaint</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">Limited direct evidence of discriminatory intent</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Outcome Prediction</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">78%</div>
                  <div className="text-sm text-gray-400">Success Probability</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white mb-2">$200K - $350K</div>
                  <div className="text-sm text-gray-400">Estimated Damages</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white mb-2">18-24 months</div>
                  <div className="text-sm text-gray-400">Time to Resolution</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'precedents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Similar Cases</h2>
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-silver-400 to-silver-300 text-black rounded-xl font-bold hover:from-silver-300 hover:to-silver-200 transition-all duration-300">
                <Search className="h-5 w-5" />
                <span>Find Similar Cases</span>
              </button>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: 'Johnson v. MegaCorp Industries',
                  citation: '542 F.3d 891 (9th Cir. 2018)',
                  similarity: '94%',
                  outcome: 'Plaintiff Victory',
                  damages: '$285,000'
                },
                {
                  title: 'Davis v. Global Tech Solutions',
                  citation: '398 F.Supp.3d 445 (S.D.N.Y. 2019)',
                  similarity: '89%',
                  outcome: 'Settlement',
                  damages: '$150,000'
                }
              ].map((precedent, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white mb-2">{precedent.title}</h4>
                      <p className="text-gray-400 mb-2">{precedent.citation}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">{precedent.similarity}</div>
                      <div className="text-sm text-gray-400">Similarity</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Outcome</div>
                      <div className={`font-medium ${
                        precedent.outcome.includes('Victory') ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {precedent.outcome}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Damages</div>
                      <div className="font-medium text-white">{precedent.damages}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseDetailView;