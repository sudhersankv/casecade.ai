import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Pin, 
  PinOff,
  Calendar,
  FileText,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
  StarOff,
  Edit,
  Trash2,
  Eye,
  Upload,
  BarChart3,
  Scale,
  LogOut,
  GripVertical,
  Flag
} from 'lucide-react';
import CaseDetailView from './CaseDetailView';
import CreateCaseModal from './CreateCaseModal';

interface Case {
  id: string;
  title: string;
  description: string;
  caseType: string;
  status: 'active' | 'pending' | 'closed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  documentsCount: number;
  timelineEvents: number;
  nextDeadline?: string;
  client?: string;
  jurisdiction?: string;
  position: { x: number; y: number };
  boardPosition: number;
}

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updated');
  const [draggedCase, setDraggedCase] = useState<Case | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'board'>('grid');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Load sample cases with board positions
    const sampleCases: Case[] = [
      {
        id: '1',
        title: 'Smith v. TechCorp Employment Discrimination',
        description: 'Employment discrimination case involving wrongful termination after filing harassment complaint',
        caseType: 'Employment Law',
        status: 'active',
        priority: 'high',
        isPinned: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        documentsCount: 12,
        timelineEvents: 8,
        nextDeadline: '2024-02-15',
        client: 'John Smith',
        jurisdiction: 'California',
        position: { x: 50, y: 50 },
        boardPosition: 0
      },
      {
        id: '2',
        title: 'ABC Corp v. XYZ Inc Contract Dispute',
        description: 'Breach of exclusive distribution agreement with damages claim',
        caseType: 'Contract Law',
        status: 'active',
        priority: 'critical',
        isPinned: false,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
        documentsCount: 25,
        timelineEvents: 15,
        nextDeadline: '2024-02-01',
        client: 'ABC Corporation',
        jurisdiction: 'New York',
        position: { x: 350, y: 50 },
        boardPosition: 1
      },
      {
        id: '3',
        title: 'Personal Injury - Construction Accident',
        description: 'Workplace injury case with OSHA violations and negligence claims',
        caseType: 'Personal Injury',
        status: 'pending',
        priority: 'medium',
        isPinned: true,
        createdAt: '2024-01-05',
        updatedAt: '2024-01-16',
        documentsCount: 8,
        timelineEvents: 6,
        client: 'Maria Rodriguez',
        jurisdiction: 'Texas',
        position: { x: 650, y: 50 },
        boardPosition: 2
      },
      {
        id: '4',
        title: 'Patent Infringement - Software Algorithm',
        description: 'Intellectual property case involving willful patent infringement',
        caseType: 'Intellectual Property',
        status: 'closed',
        priority: 'high',
        isPinned: false,
        createdAt: '2023-12-20',
        updatedAt: '2024-01-14',
        documentsCount: 18,
        timelineEvents: 22,
        client: 'TechStart Inc.',
        jurisdiction: 'Federal',
        position: { x: 50, y: 300 },
        boardPosition: 3
      }
    ];
    setCases(sampleCases);
  }, []);

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.client?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || case_.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || case_.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedCases = [...filteredCases].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    switch (sortBy) {
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const togglePin = (caseId: string) => {
    setCases(prev => prev.map(case_ => 
      case_.id === caseId ? { ...case_, isPinned: !case_.isPinned, updatedAt: new Date().toISOString().split('T')[0] } : case_
    ));
  };

  const updateCasePriority = (caseId: string, priority: Case['priority']) => {
    setCases(prev => prev.map(case_ => 
      case_.id === caseId ? { ...case_, priority, updatedAt: new Date().toISOString().split('T')[0] } : case_
    ));
  };

  const handleCreateCase = (newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'documentsCount' | 'timelineEvents' | 'position' | 'boardPosition'>) => {
    const case_: Case = {
      ...newCase,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      documentsCount: 0,
      timelineEvents: 0,
      position: { x: 50 + (cases.length % 4) * 300, y: 50 + Math.floor(cases.length / 4) * 250 },
      boardPosition: cases.length
    };
    setCases(prev => [case_, ...prev]);
    setShowCreateModal(false);
  };

  const handleDragStart = (e: React.DragEvent, case_: Case) => {
    if (viewMode !== 'board') return;
    
    setDraggedCase(case_);
    setIsDragging(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
  };

  const handleDragEnd = () => {
    setDraggedCase(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (viewMode !== 'board' || !draggedCase) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedCase || viewMode !== 'board') return;

    const container = e.currentTarget.getBoundingClientRect();
    const newPosition = {
      x: Math.max(0, Math.min(container.width - 320, e.clientX - container.left - dragOffset.x)),
      y: Math.max(0, Math.min(container.height - 200, e.clientY - container.top - dragOffset.y))
    };

    // Update case position immediately for smooth UX
    setCases(prev => prev.map(case_ => 
      case_.id === draggedCase.id 
        ? { ...case_, position: newPosition, updatedAt: new Date().toISOString().split('T')[0] }
        : case_
    ));

    setDraggedCase(null);
    setIsDragging(false);
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertCircle className="h-4 w-4" />;
      case 'high': return <Star className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const CaseCard = ({ case_, isBoard = false }: { case_: Case; isBoard?: boolean }) => (
    <div
      draggable={isBoard}
      onDragStart={(e) => isBoard && handleDragStart(e, case_)}
      onDragEnd={handleDragEnd}
      className={`bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 cursor-pointer group ${
        isBoard ? 'absolute w-80 select-none' : ''
      } ${draggedCase?.id === case_.id ? 'opacity-50 scale-105 z-50' : ''} ${
        isDragging && draggedCase?.id !== case_.id ? 'pointer-events-none' : ''
      }`}
      style={isBoard ? { 
        left: case_.position.x, 
        top: case_.position.y,
        zIndex: draggedCase?.id === case_.id ? 1000 : 1,
        transform: draggedCase?.id === case_.id ? 'rotate(2deg)' : 'none'
      } : {}}
      onClick={(e) => {
        if (!isDragging && !draggedCase) {
          setSelectedCase(case_);
        }
      }}
    >
      {/* Drag Handle for Board View */}
      {isBoard && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin(case_.id);
            }}
            className={`p-1 rounded transition-colors ${
              case_.isPinned ? 'text-silver-300' : 'text-gray-400 hover:text-silver-300'
            }`}
          >
            {case_.isPinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
          </button>
          
          <div className={`flex items-center space-x-1 ${getPriorityColor(case_.priority)}`}>
            {getPriorityIcon(case_.priority)}
            <span className="text-xs font-medium capitalize">{case_.priority}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(case_.status)}`}>
            {case_.status.replace('_', ' ')}
          </div>
          
          {/* Priority Selector */}
          <div className="relative group">
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Flag className="h-4 w-4" />
            </button>
            <div className="absolute right-0 top-8 bg-black/90 border border-white/20 rounded-xl p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none group-hover:pointer-events-auto">
              {['low', 'medium', 'high', 'critical'].map((priority) => (
                <button
                  key={priority}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCasePriority(case_.id, priority as Case['priority']);
                  }}
                  className={`block w-full text-left px-3 py-1 rounded text-xs hover:bg-white/10 transition-colors ${
                    case_.priority === priority ? 'text-silver-300' : 'text-gray-400'
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-silver-200 transition-colors">
          {case_.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
          {case_.description}
        </p>
        
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{case_.client}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Scale className="h-3 w-3" />
            <span>{case_.caseType}</span>
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>{case_.documentsCount}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{case_.timelineEvents}</span>
          </span>
        </div>
        
        {case_.nextDeadline && (
          <span className="text-yellow-400 text-xs">
            Due: {new Date(case_.nextDeadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-xs text-gray-500">
          Updated {new Date(case_.updatedAt).toLocaleDateString()}
        </span>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCase(case_);
            }}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedCase) {
    return (
      <CaseDetailView 
        case_={selectedCase} 
        onBack={() => setSelectedCase(null)}
        onUpdate={(updatedCase) => {
          setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
          setSelectedCase(updatedCase);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              cas<span className="text-silver-300">e</span>cade.ai Dashboard
            </h1>
            <p className="text-gray-400">Welcome back, {user.name}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-silver-400 to-silver-300 text-black rounded-xl font-bold hover:from-silver-300 hover:to-silver-200 transition-all duration-300"
            >
              <Plus className="h-5 w-5" />
              <span>New Case</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-silver-400/30"
              />
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Scale className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{cases.filter(c => c.status === 'active').length}</div>
                <div className="text-gray-400">Active Cases</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{cases.filter(c => c.status === 'pending').length}</div>
                <div className="text-gray-400">Pending Cases</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500/20 p-3 rounded-xl">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{cases.filter(c => c.priority === 'critical').length}</div>
                <div className="text-gray-400">Critical Priority</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{cases.reduce((sum, c) => sum + c.documentsCount, 0)}</div>
                <div className="text-gray-400">Total Documents</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cases, clients, or descriptions..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-silver-400 transition-colors"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('board')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'board' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Board
                </button>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-silver-400"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
                <option value="on_hold">On Hold</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-silver-400"
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              {viewMode === 'grid' && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-silver-400"
                >
                  <option value="updated">Last Updated</option>
                  <option value="created">Date Created</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Cases Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedCases.map((case_) => (
              <CaseCard key={case_.id} case_={case_} />
            ))}
          </div>
        ) : (
          <div 
            className="relative bg-white/5 border border-white/10 rounded-2xl min-h-[600px] overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="absolute inset-0 p-4">
              <div className="text-sm text-gray-400 mb-4 flex items-center space-x-2">
                <GripVertical className="h-4 w-4" />
                <span>Drag cases to reposition them on the board</span>
              </div>
              {filteredCases.map((case_) => (
                <CaseCard key={case_.id} case_={case_} isBoard={true} />
              ))}
            </div>
          </div>
        )}

        {sortedCases.length === 0 && (
          <div className="text-center py-12">
            <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No cases found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first case to get started'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && filterPriority === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-silver-400 to-silver-300 text-black rounded-xl font-bold hover:from-silver-300 hover:to-silver-200 transition-all duration-300"
              >
                Create Your First Case
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Case Modal */}
      {showCreateModal && (
        <CreateCaseModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCase}
        />
      )}
    </div>
  );
};

export default Dashboard;