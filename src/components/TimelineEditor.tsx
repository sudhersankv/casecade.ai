import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown,
  Sparkles,
  Brain,
  Loader2,
  Download,
  Upload,
  GripVertical,
  AlertCircle,
  CheckCircle,
  Star,
  Users,
  MapPin,
  FileText
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'explicit' | 'implicit';
  eventType: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  parties: string[];
  location?: string;
  isEditing?: boolean;
  order: number;
}

interface TimelineEditorProps {
  caseId: string;
  initialEvents?: TimelineEvent[];
  onSave: (events: TimelineEvent[]) => void;
  onClose: () => void;
}

const TimelineEditor: React.FC<TimelineEditorProps> = ({ 
  caseId, 
  initialEvents = [], 
  onSave, 
  onClose 
}) => {
  const [events, setEvents] = useState<TimelineEvent[]>(
    initialEvents.length > 0 
      ? initialEvents 
      : [
          {
            id: '1',
            date: '2023-01-15',
            title: 'Initial Complaint Filed',
            description: 'Employee files internal complaint about workplace harassment',
            type: 'explicit',
            eventType: 'complaint',
            importance: 'high',
            parties: ['Employee', 'HR Department'],
            location: 'Company headquarters',
            order: 0
          }
        ]
  );
  
  const [draggedEvent, setDraggedEvent] = useState<TimelineEvent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [editingField, setEditingField] = useState<{ eventId: string; field: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addNewEvent = () => {
    const newEvent: TimelineEvent = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      title: 'New Event',
      description: 'Event description',
      type: 'explicit',
      eventType: 'other',
      importance: 'medium',
      parties: [],
      order: events.length
    };
    setEvents(prev => [...prev, newEvent]);
    // Auto-start editing the title
    setTimeout(() => {
      setEditingField({ eventId: newEvent.id, field: 'title' });
    }, 100);
  };

  const updateEvent = (id: string, updates: Partial<TimelineEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const moveEvent = (id: string, direction: 'up' | 'down') => {
    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) return;

    const newEvents = [...events];
    const targetIndex = direction === 'up' ? eventIndex - 1 : eventIndex + 1;

    if (targetIndex >= 0 && targetIndex < newEvents.length) {
      [newEvents[eventIndex], newEvents[targetIndex]] = [newEvents[targetIndex], newEvents[eventIndex]];
      
      // Update order numbers
      newEvents.forEach((event, index) => {
        event.order = index;
      });
      
      setEvents(newEvents);
    }
  };

  const handleDragStart = (e: React.DragEvent, event: TimelineEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetEvent: TimelineEvent) => {
    e.preventDefault();
    if (!draggedEvent || draggedEvent.id === targetEvent.id) return;

    const draggedIndex = events.findIndex(e => e.id === draggedEvent.id);
    const targetIndex = events.findIndex(e => e.id === targetEvent.id);

    const newEvents = [...events];
    newEvents.splice(draggedIndex, 1);
    newEvents.splice(targetIndex, 0, draggedEvent);

    // Update order numbers
    newEvents.forEach((event, index) => {
      event.order = index;
    });

    setEvents(newEvents);
    setDraggedEvent(null);
  };

  const handleDoubleClick = (eventId: string, field: string) => {
    setEditingField({ eventId, field });
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleFieldKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditingField(null);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const generateTimelineWithAI = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const aiGeneratedEvents: TimelineEvent[] = [
        {
          id: Math.random().toString(36).substr(2, 9),
          date: '2023-01-15',
          title: 'Initial Complaint Filed',
          description: 'Employee files internal complaint about workplace harassment',
          type: 'explicit',
          eventType: 'complaint',
          importance: 'critical',
          parties: ['Employee', 'HR Department'],
          location: 'Company headquarters',
          order: events.length
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          date: '2023-01-18',
          title: 'HR Investigation Initiated',
          description: 'Company begins formal investigation into harassment allegations',
          type: 'explicit',
          eventType: 'investigation',
          importance: 'high',
          parties: ['HR Department', 'Investigation Team'],
          location: 'Company headquarters',
          order: events.length + 1
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          date: '2023-03-01',
          title: 'Performance Review Conducted',
          description: 'Sudden negative performance review following complaint',
          type: 'explicit',
          eventType: 'performance_review',
          importance: 'critical',
          parties: ['Employee', 'Manager', 'HR'],
          location: 'Manager office',
          order: events.length + 2
        },
        {
          id: Math.random().toString(36).substr(2, 9),
          date: '2023-03-15',
          title: 'Employee Termination',
          description: 'Employee terminated citing performance issues',
          type: 'explicit',
          eventType: 'termination',
          importance: 'critical',
          parties: ['Employee', 'Manager', 'HR'],
          location: 'Company headquarters',
          order: events.length + 3
        }
      ];

      setEvents(prev => [...prev, ...aiGeneratedEvents]);
      setShowAIModal(false);
      setAiPrompt('');
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsGenerating(true);
      try {
        // Simulate document processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Add events based on uploaded documents
        const documentEvents: TimelineEvent[] = [
          {
            id: Math.random().toString(36).substr(2, 9),
            date: '2023-02-28',
            title: 'Witness Interviews Conducted',
            description: 'HR conducts interviews with witnesses regarding the incidents',
            type: 'explicit',
            eventType: 'interview',
            importance: 'high',
            parties: ['Witnesses', 'HR Team'],
            order: events.length
          }
        ];

        setEvents(prev => [...prev, ...documentEvents]);
      } catch (error) {
        console.error('Document processing error:', error);
      } finally {
        setIsGenerating(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const exportTimeline = () => {
    const timelineData = {
      caseId,
      events: events.map(({ isEditing, ...event }) => event),
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(timelineData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timeline-${caseId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'complaint': return <AlertCircle className="h-4 w-4" />;
      case 'investigation': return <FileText className="h-4 w-4" />;
      case 'performance_review': return <Users className="h-4 w-4" />;
      case 'termination': return <AlertCircle className="h-4 w-4" />;
      case 'interview': return <Users className="h-4 w-4" />;
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

  const EditableField = ({ 
    value, 
    onChange, 
    eventId, 
    field, 
    className = "", 
    multiline = false,
    placeholder = ""
  }: {
    value: string;
    onChange: (value: string) => void;
    eventId: string;
    field: string;
    className?: string;
    multiline?: boolean;
    placeholder?: string;
  }) => {
    const isEditing = editingField?.eventId === eventId && editingField?.field === field;
    
    if (isEditing) {
      if (multiline) {
        return (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleFieldBlur}
            onKeyDown={handleFieldKeyDown}
            className={`bg-white/10 border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:border-silver-400 resize-none ${className}`}
            placeholder={placeholder}
            autoFocus
            rows={2}
          />
        );
      } else {
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleFieldBlur}
            onKeyDown={handleFieldKeyDown}
            className={`bg-white/10 border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:border-silver-400 ${className}`}
            placeholder={placeholder}
            autoFocus
          />
        );
      }
    }

    return (
      <span
        onDoubleClick={() => handleDoubleClick(eventId, field)}
        className={`cursor-pointer hover:bg-white/5 rounded px-1 transition-colors ${className}`}
        title="Double-click to edit"
      >
        {value || placeholder}
      </span>
    );
  };

  const EventCard = ({ event }: { event: TimelineEvent }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, event)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, event)}
      className={`bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group ${
        draggedEvent?.id === event.id ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Drag Handle */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        {/* Event Icon */}
        <div className={`p-3 rounded-xl border-2 ${getImportanceColor(event.importance)} flex-shrink-0`}>
          {getEventIcon(event.eventType)}
        </div>

        {/* Event Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-white">
              <EditableField
                value={event.title}
                onChange={(value) => updateEvent(event.id, { title: value })}
                eventId={event.id}
                field="title"
                placeholder="Event title"
              />
            </h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                <EditableField
                  value={event.date}
                  onChange={(value) => updateEvent(event.id, { date: value })}
                  eventId={event.id}
                  field="date"
                  placeholder="YYYY-MM-DD"
                />
              </span>
              <select
                value={event.importance}
                onChange={(e) => updateEvent(event.id, { importance: e.target.value as TimelineEvent['importance'] })}
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getImportanceColor(event.importance)} bg-transparent`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <p className="text-gray-400 mb-3">
            <EditableField
              value={event.description}
              onChange={(value) => updateEvent(event.id, { description: value })}
              eventId={event.id}
              field="description"
              multiline={true}
              placeholder="Event description"
            />
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <EditableField
                  value={event.parties.join(', ')}
                  onChange={(value) => updateEvent(event.id, { parties: value.split(', ').filter(p => p.trim()) })}
                  eventId={event.id}
                  field="parties"
                  placeholder="Parties involved"
                />
              </span>
              {event.location && (
                <span className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <EditableField
                    value={event.location}
                    onChange={(value) => updateEvent(event.id, { location: value })}
                    eventId={event.id}
                    field="location"
                    placeholder="Location"
                  />
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => moveEvent(event.id, 'up')}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Move up"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => moveEvent(event.id, 'down')}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Move down"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => deleteEvent(event.id)}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 border border-white/20 rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Timeline Editor</h2>
              <p className="text-gray-400">Double-click any text to edit • Drag to reorder events</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAIModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors"
            >
              <Brain className="h-4 w-4" />
              <span>AI Generate</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Docs</span>
            </button>
            
            <button
              onClick={exportTimeline}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {events
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            
            {events.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No timeline events</h3>
                <p className="text-gray-400 mb-6">Add events manually or use AI to generate a timeline</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <button
            onClick={addNewEvent}
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Event</span>
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(events.map(({ isEditing, ...event }) => event))}
              className="px-6 py-3 bg-gradient-to-r from-silver-400 to-silver-300 text-black rounded-xl font-bold hover:from-silver-300 hover:to-silver-200 transition-all duration-300"
            >
              Save Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
      />

      {/* AI Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-black/90 border border-white/20 rounded-3xl p-8 w-full max-w-2xl">
            <div className="text-center mb-6">
              <div className="bg-purple-500/20 p-4 rounded-2xl w-fit mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">AI Timeline Generation</h3>
              <p className="text-gray-400">Describe your case and let AI generate timeline events</p>
            </div>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe your case details, key events, dates, and parties involved..."
              className="w-full h-32 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-silver-400 transition-colors resize-none mb-6"
            />

            <div className="flex space-x-4">
              <button
                onClick={() => setShowAIModal(false)}
                className="flex-1 px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={generateTimelineWithAI}
                disabled={!aiPrompt.trim() || isGenerating}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-400 text-white rounded-xl font-bold hover:from-purple-400 hover:to-purple-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Timeline</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isGenerating && !showAIModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center">
          <div className="bg-black/90 border border-white/20 rounded-3xl p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
            <p className="text-white text-lg">Processing documents...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineEditor;