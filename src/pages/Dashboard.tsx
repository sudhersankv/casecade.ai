import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  BarChart3, 
  FileText, 
  Clock, 
  TrendingUp, 
  Plus, 
  Search,
  Calendar,
  Scale,
  Users,
  Award
} from 'lucide-react'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalCases: 12,
    activeCases: 8,
    completedCases: 4,
    successRate: 85
  })

  const recentCases = [
    {
      id: 1,
      title: "Smith v. TechCorp Employment Case",
      type: "Employment Discrimination",
      status: "Active",
      lastUpdated: "2 hours ago",
      progress: 75
    },
    {
      id: 2,
      title: "Johnson Personal Injury Claim",
      type: "Personal Injury",
      status: "Discovery",
      lastUpdated: "1 day ago",
      progress: 45
    },
    {
      id: 3,
      title: "Davis Contract Dispute",
      type: "Contract Law",
      status: "Settlement",
      lastUpdated: "3 days ago",
      progress: 90
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: "Timeline generated for Smith v. TechCorp",
      time: "2 hours ago",
      type: "timeline"
    },
    {
      id: 2,
      action: "3 precedent cases found for Johnson claim",
      time: "5 hours ago",
      type: "precedent"
    },
    {
      id: 3,
      action: "Document analysis completed",
      time: "1 day ago",
      type: "document"
    },
    {
      id: 4,
      action: "Case strength analysis updated",
      time: "2 days ago",
      type: "analysis"
    }
  ]

  const userDisplayName = user?.user_metadata?.full_name || 
                         user?.user_metadata?.first_name || 
                         user?.email?.split('@')[0] || 
                         'User'

  return (
    <div className="pt-16 min-h-screen">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {userDisplayName}
              </h1>
              <p className="text-gray-400 mt-1">
                Here's what's happening with your cases today
              </p>
            </div>
            <button className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              <Plus className="h-5 w-5" />
              <span>New Case</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalCases}</div>
                <div className="text-gray-400 text-sm">Total Cases</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.activeCases}</div>
                <div className="text-gray-400 text-sm">Active Cases</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.completedCases}</div>
                <div className="text-gray-400 text-sm">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.successRate}%</div>
                <div className="text-gray-400 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Cases */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Cases</h2>
              <button className="text-gray-400 hover:text-white transition-colors">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentCases.map((case_) => (
                <div key={case_.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{case_.title}</h3>
                      <p className="text-gray-400 text-sm">{case_.type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      case_.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                      case_.status === 'Discovery' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {case_.status}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{case_.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${case_.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-gray-400 text-xs">
                    Last updated {case_.lastUpdated}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <button className="text-gray-400 hover:text-white transition-colors">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    activity.type === 'timeline' ? 'bg-blue-500/20' :
                    activity.type === 'precedent' ? 'bg-green-500/20' :
                    activity.type === 'document' ? 'bg-purple-500/20' :
                    'bg-yellow-500/20'
                  }`}>
                    {activity.type === 'timeline' && <Calendar className="h-4 w-4 text-blue-400" />}
                    {activity.type === 'precedent' && <Scale className="h-4 w-4 text-green-400" />}
                    {activity.type === 'document' && <FileText className="h-4 w-4 text-purple-400" />}
                    {activity.type === 'analysis' && <BarChart3 className="h-4 w-4 text-yellow-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 text-left group">
              <div className="bg-blue-500/20 p-3 rounded-xl w-fit mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Plus className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Create New Case</h3>
              <p className="text-gray-400 text-sm">Start analyzing a new legal case with AI assistance</p>
            </button>

            <button className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 text-left group">
              <div className="bg-green-500/20 p-3 rounded-xl w-fit mb-4 group-hover:bg-green-500/30 transition-colors">
                <Search className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Search Precedents</h3>
              <p className="text-gray-400 text-sm">Find relevant cases from our 2.3M+ case database</p>
            </button>

            <button className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 text-left group">
              <div className="bg-purple-500/20 p-3 rounded-xl w-fit mb-4 group-hover:bg-purple-500/30 transition-colors">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload Documents</h3>
              <p className="text-gray-400 text-sm">Analyze legal documents with AI-powered insights</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard