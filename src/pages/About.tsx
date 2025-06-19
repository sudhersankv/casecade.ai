import React from 'react';
import { 
  Brain, 
  Clock, 
  Database, 
  Search, 
  BarChart3, 
  Shield,
  Zap,
  FileText,
  Calendar,
  Gavel,
  TrendingUp,
  Users
} from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced Temporal Reasoning",
      description: "Our AI uses sophisticated temporal reasoning to understand complex legal timelines and case chronologies with unprecedented accuracy."
    },
    {
      icon: Calendar,
      title: "Automated Timeline Generation",
      description: "Convert case descriptions into detailed, chronological timelines automatically, helping you visualize case progression clearly."
    },
    {
      icon: Search,
      title: "Intelligent Case Discovery",
      description: "Access our comprehensive database of 2.3M+ US legal cases to find relevant precedents and similar cases instantly."
    },
    {
      icon: Gavel,
      title: "Legal Document Analysis",
      description: "Upload and analyze legal documents with AI-powered insights, extracting key information and identifying critical patterns."
    },
    {
      icon: BarChart3,
      title: "Case Outcome Prediction",
      description: "Leverage historical data and AI analysis to predict potential case outcomes and strategic recommendations."
    },
    {
      icon: Shield,
      title: "Secure & Confidential",
      description: "Enterprise-grade security ensures your sensitive legal data remains protected with end-to-end encryption."
    }
  ];

  const capabilities = [
    {
      icon: FileText,
      title: "Document Processing",
      description: "Extract key information from legal documents, contracts, and case files with AI-powered analysis."
    },
    {
      icon: Clock,
      title: "Timeline Creation",
      description: "Generate comprehensive timelines from case descriptions, identifying critical dates and events."
    },
    {
      icon: Database,
      title: "Precedent Research",
      description: "Search through millions of legal cases to find relevant precedents and similar fact patterns."
    },
    {
      icon: TrendingUp,
      title: "Strategic Analysis",
      description: "Get AI-powered insights on case strengths, weaknesses, and recommended legal strategies."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-white">
              About casecade.ai
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              An advanced AI-powered legal assistant that revolutionizes how legal professionals 
              analyze cases, generate timelines, and discover relevant precedents.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              What casecade.ai Does
            </h2>
            <p className="text-xl text-gray-400">
              Powerful AI tools designed specifically for legal professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-xl flex-shrink-0">
                    <capability.icon className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {capability.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {capability.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Key Features
            </h2>
            <p className="text-xl text-gray-400">
              Advanced AI capabilities built for legal professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500"
              >
                <div className="bg-white p-4 rounded-2xl w-fit mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-black" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Simple workflow for powerful legal analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white p-6 rounded-2xl w-fit mx-auto mb-6">
                <FileText className="h-12 w-12 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">1. Upload & Analyze</h3>
              <p className="text-gray-400">
                Upload your legal documents or describe your case. Our AI will analyze the content and extract key information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-2xl w-fit mx-auto mb-6">
                <Clock className="h-12 w-12 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2. Generate Timeline</h3>
              <p className="text-gray-400">
                Automatically create detailed timelines of events, identifying critical dates and temporal relationships.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-2xl w-fit mx-auto mb-6">
                <Search className="h-12 w-12 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">3. Find Precedents</h3>
              <p className="text-gray-400">
                Discover relevant precedents and similar cases from our database of 2.3M+ legal cases with AI-powered matching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Advanced AI Technology
            </h2>
            <p className="text-xl text-gray-400">
              Built with cutting-edge artificial intelligence and machine learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Temporal Reasoning Engine
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Our proprietary temporal reasoning AI understands the complex relationships between 
                legal events, dates, and timelines. It can identify patterns, sequences, and 
                critical timing that human analysis might miss.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-gray-300">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span>Advanced natural language processing</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span>Semantic understanding of legal concepts</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span>Pattern recognition across millions of cases</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                  <span>Continuous learning and improvement</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">2.3M+</div>
                  <div className="text-gray-400">Legal Cases</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">94.7%</div>
                  <div className="text-gray-400">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">80%</div>
                  <div className="text-gray-400">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">15K+</div>
                  <div className="text-gray-400">Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Experience AI-Powered Legal Analysis?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Try casecade.ai today and see how artificial intelligence can transform 
              your legal research and case analysis workflow.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="px-10 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                Start Free Trial
              </button>
              
              <button className="px-10 py-4 border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;