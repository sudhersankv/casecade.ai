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

const Features: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced Temporal Reasoning",
      description: "Our AI uses sophisticated temporal reasoning to understand complex legal timelines and case chronologies with unprecedented accuracy. It can identify critical dates, sequence events, and understand the temporal relationships between different legal actions.",
      benefits: ["Automatic timeline generation", "Event sequence analysis", "Critical date identification", "Temporal pattern recognition"]
    },
    {
      icon: Calendar,
      title: "Automated Timeline Generation",
      description: "Convert case descriptions into detailed, chronological timelines automatically, helping you visualize case progression clearly and identify key moments that could impact your legal strategy.",
      benefits: ["Visual timeline creation", "Chronological organization", "Key event highlighting", "Interactive timeline navigation"]
    },
    {
      icon: Search,
      title: "Intelligent Case Discovery",
      description: "Access our comprehensive database of 2.3M+ US legal cases to find relevant precedents and similar cases instantly. Our AI understands legal concepts and can find cases based on factual similarity, not just keyword matching.",
      benefits: ["2.3M+ case database", "Semantic search capabilities", "Precedent identification", "Similar case matching"]
    },
    {
      icon: Gavel,
      title: "Legal Document Analysis",
      description: "Upload and analyze legal documents with AI-powered insights, extracting key information and identifying critical patterns that might be missed in manual review.",
      benefits: ["Document parsing", "Key information extraction", "Pattern identification", "Automated summarization"]
    },
    {
      icon: BarChart3,
      title: "Case Outcome Prediction",
      description: "Leverage historical data and AI analysis to predict potential case outcomes and strategic recommendations based on similar cases and their results.",
      benefits: ["Outcome probability analysis", "Strategic recommendations", "Risk assessment", "Success rate predictions"]
    },
    {
      icon: Shield,
      title: "Secure & Confidential",
      description: "Enterprise-grade security ensures your sensitive legal data remains protected with end-to-end encryption, secure data handling, and compliance with legal industry standards.",
      benefits: ["End-to-end encryption", "GDPR compliance", "Secure data storage", "Access controls"]
    }
  ];

  const stats = [
    { icon: Database, label: "Legal Cases", value: "2.3M+", description: "Comprehensive US case database" },
    { icon: Users, label: "Legal Professionals", value: "15K+", description: "Trusted by law firms nationwide" },
    { icon: TrendingUp, label: "Accuracy Rate", value: "94.7%", description: "AI analysis accuracy" },
    { icon: Zap, label: "Time Saved", value: "80%", description: "Average research time reduction" }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-white">
              Powerful <span className="text-gray-300">AI</span> Features
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Advanced temporal reasoning, comprehensive <span className="text-gray-300">legal</span> analysis, and intelligent case discovery 
              powered by cutting-edge artificial intelligence technology.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 transform hover:scale-105"
              >
                <div className="flex items-start space-x-6">
                  <div className="bg-white p-4 rounded-2xl flex-shrink-0">
                    <feature.icon className="h-8 w-8 text-black" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center space-x-3 text-gray-300">
                          <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Trusted by <span className="text-gray-300">Legal</span> Professionals
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of lawyers who rely on our <span className="text-gray-300">AI</span>-powered platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500"
              >
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-white p-4 rounded-xl">
                    <stat.icon className="h-8 w-8 text-black" />
                  </div>
                </div>
                
                <div className="text-4xl font-bold mb-2 text-white">
                  {stat.value}
                </div>
                
                <div className="text-lg font-medium text-gray-300 mb-2">
                  {stat.label}
                </div>
                
                <div className="text-sm text-gray-400">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Experience the Future of <span className="text-gray-300">Legal</span> Research
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              See how our <span className="text-gray-300">AI</span>-powered features can transform your <span className="text-gray-300">legal</span> practice and save you hours of research time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="px-10 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                Start Free Trial
              </button>
              
              <button className="px-10 py-4 border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;