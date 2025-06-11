import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  Scale, 
  Clock, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Gavel
} from 'lucide-react';

const Examples: React.FC = () => {
  const [activeTab, setActiveTab] = useState('timeline');

  const exampleCase = {
    title: "Smith v. TechCorp Employment Discrimination Case",
    description: "A complex employment discrimination case involving wrongful termination, harassment claims, and potential retaliation. The case spans multiple incidents over 18 months with various witnesses and documentation.",
    timeline: [
      {
        date: "2023-01-15",
        event: "Initial Complaint Filed",
        description: "Employee files internal complaint about workplace harassment",
        type: "complaint",
        importance: "high"
      },
      {
        date: "2023-02-03",
        event: "HR Investigation Begins",
        description: "Company initiates formal investigation into harassment allegations",
        type: "investigation",
        importance: "medium"
      },
      {
        date: "2023-02-28",
        event: "Witness Interviews Conducted",
        description: "HR conducts interviews with 5 witnesses regarding the incidents",
        type: "evidence",
        importance: "high"
      },
      {
        date: "2023-03-15",
        event: "Performance Review Meeting",
        description: "Sudden negative performance review following complaint",
        type: "retaliation",
        importance: "critical"
      },
      {
        date: "2023-04-10",
        event: "Termination Notice",
        description: "Employee terminated citing performance issues",
        type: "termination",
        importance: "critical"
      },
      {
        date: "2023-05-22",
        event: "EEOC Complaint Filed",
        description: "Former employee files complaint with Equal Employment Opportunity Commission",
        type: "legal",
        importance: "critical"
      }
    ],
    relevantCases: [
      {
        title: "Johnson v. MegaCorp Industries",
        citation: "542 F.3d 891 (9th Cir. 2018)",
        similarity: "94%",
        outcome: "Plaintiff Victory",
        keyPoints: ["Similar timeline pattern", "Retaliation after complaint", "Performance review timing"],
        damages: "$285,000"
      },
      {
        title: "Davis v. Global Tech Solutions",
        citation: "398 F.Supp.3d 445 (S.D.N.Y. 2019)",
        similarity: "89%",
        outcome: "Settlement",
        keyPoints: ["Harassment documentation", "Witness testimony", "HR investigation flaws"],
        damages: "$150,000"
      },
      {
        title: "Wilson v. Enterprise Systems",
        citation: "721 F.3d 234 (5th Cir. 2020)",
        similarity: "87%",
        outcome: "Plaintiff Victory",
        keyPoints: ["Temporal proximity", "Pretext evidence", "Pattern of retaliation"],
        damages: "$320,000"
      }
    ],
    analysis: {
      strengths: [
        "Clear temporal proximity between complaint and adverse actions",
        "Multiple witnesses to support harassment claims",
        "Documented pattern of retaliation",
        "Strong precedent cases with similar fact patterns"
      ],
      weaknesses: [
        "Some performance issues documented prior to complaint",
        "Limited direct evidence of discriminatory intent",
        "Potential statute of limitations issues for early incidents"
      ],
      recommendations: [
        "Focus on temporal proximity argument",
        "Gather additional witness testimony",
        "Analyze company's treatment of similar complaints",
        "Consider settlement negotiations based on precedent outcomes"
      ],
      outcomePredicition: {
        probability: 78,
        estimatedDamages: "$200,000 - $350,000",
        timeToResolution: "18-24 months"
      }
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'complaint': return <AlertCircle className="h-4 w-4" />;
      case 'investigation': return <FileText className="h-4 w-4" />;
      case 'evidence': return <Users className="h-4 w-4" />;
      case 'retaliation': return <TrendingUp className="h-4 w-4" />;
      case 'termination': return <Scale className="h-4 w-4" />;
      case 'legal': return <Gavel className="h-4 w-4" />;
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

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-white">
              Case Analysis Examples
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how our AI analyzes real legal cases, generates timelines, finds relevant precedents, 
              and provides strategic insights to help you build stronger cases.
            </p>
          </div>
        </div>
      </section>

      {/* Example Case */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Case Header */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
            <div className="flex items-start space-x-6">
              <div className="bg-white p-4 rounded-2xl">
                <Scale className="h-8 w-8 text-black" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {exampleCase.title}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {exampleCase.description}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white/5 p-1 rounded-2xl mb-8">
            {[
              { id: 'timeline', label: 'Timeline Analysis', icon: Calendar },
              { id: 'precedents', label: 'Relevant Cases', icon: FileText },
              { id: 'analysis', label: 'AI Analysis', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Case Timeline</h3>
                <div className="space-y-6">
                  {exampleCase.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className={`p-3 rounded-xl border-2 ${getImportanceColor(event.importance)}`}>
                          {getEventIcon(event.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h4 className="text-lg font-semibold text-white">{event.event}</h4>
                          <span className="text-sm text-gray-400">{event.date}</span>
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
              </div>
            )}

            {activeTab === 'precedents' && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Relevant Precedent Cases</h3>
                <div className="space-y-6">
                  {exampleCase.relevantCases.map((case_, index) => (
                    <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-white mb-2">{case_.title}</h4>
                          <p className="text-gray-400 mb-2">{case_.citation}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white mb-1">{case_.similarity}</div>
                          <div className="text-sm text-gray-400">Similarity</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Outcome</div>
                          <div className={`font-medium ${
                            case_.outcome.includes('Victory') ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            {case_.outcome}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Damages</div>
                          <div className="font-medium text-white">{case_.damages}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Key Similarities</div>
                        <div className="flex flex-wrap gap-2">
                          {case_.keyPoints.map((point, pointIndex) => (
                            <span key={pointIndex} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
                              {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">AI Strategic Analysis</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span>Case Strengths</span>
                    </h4>
                    <ul className="space-y-3">
                      {exampleCase.analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <span>Potential Weaknesses</span>
                    </h4>
                    <ul className="space-y-3">
                      {exampleCase.analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <ArrowRight className="h-5 w-5 text-blue-400" />
                    <span>Strategic Recommendations</span>
                  </h4>
                  <ul className="space-y-3">
                    {exampleCase.analysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-white mb-4">Outcome Prediction</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        {exampleCase.analysis.outcomePredicition.probability}%
                      </div>
                      <div className="text-sm text-gray-400">Success Probability</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white mb-2">
                        {exampleCase.analysis.outcomePredicition.estimatedDamages}
                      </div>
                      <div className="text-sm text-gray-400">Estimated Damages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white mb-2">
                        {exampleCase.analysis.outcomePredicition.timeToResolution}
                      </div>
                      <div className="text-sm text-gray-400">Time to Resolution</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Examples;