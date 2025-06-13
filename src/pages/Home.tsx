import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Clock, 
  Database, 
  Search, 
  ArrowRight, 
  Sparkles,
  BarChart3,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Database, label: "Legal Cases Analyzed", value: "2.3M+", color: "text-white" },
    { icon: Users, label: "Legal Professionals", value: "15K+", color: "text-white" },
    { icon: TrendingUp, label: "Accuracy Rate", value: "94.7%", color: "text-white" },
    { icon: Award, label: "Time Saved", value: "80%", color: "text-white" }
  ];

  const features = [
    {
      icon: Brain,
      title: "Advanced Temporal Reasoning",
      description: "Sophisticated AI that understands complex legal timelines and case chronologies with unprecedented accuracy."
    },
    {
      icon: Clock,
      title: "Automated Timeline Generation",
      description: "Convert case descriptions into detailed, chronological timelines automatically for clear case visualization."
    },
    {
      icon: Search,
      title: "Intelligent Case Discovery",
      description: "Access our comprehensive database of 2.3M+ US legal cases to find relevant precedents instantly."
    },
    {
      icon: BarChart3,
      title: "Case Outcome Prediction",
      description: "Leverage historical data and AI analysis to predict potential outcomes and strategic recommendations."
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="pt-20 pb-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-6 py-3 mb-8">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-white font-medium">Powered by Advanced AI</span>
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white block">
                  Revolutionary
                </span>
                <span className="text-white block mt-2">
                  Legal AI Assistant
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Transform your legal practice with AI-powered case analysis, automated timeline generation, 
                and intelligent precedent discovery. Access 2.3M+ cases with advanced temporal reasoning.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link 
                  to="/demo"
                  className="group px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center space-x-2">
                    <span>Try Demo</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
                
                <Link 
                  to="/features"
                  className="group px-8 py-4 border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <span>Learn More</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced temporal reasoning and comprehensive legal analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
              >
                <div className="mb-6">
                  <div className="bg-white p-3 rounded-xl w-fit">
                    <feature.icon className="h-6 w-6 text-black" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors duration-300">
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

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Trusted by Legal Professionals
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const isActive = currentStat === index;
              
              return (
                <div
                  key={index}
                  className={`text-center transition-all duration-700 transform ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                >
                  <div className={`bg-white/5 border rounded-2xl p-8 transition-all duration-500 ${
                    isActive ? 'border-white/30 bg-white/10' : 'border-white/10'
                  }`}>
                    <div className="mb-6">
                      <div className="mx-auto w-16 h-16 bg-white p-4 rounded-xl">
                        <Icon className="h-8 w-8 text-black" />
                      </div>
                    </div>
                    
                    <div className={`text-4xl font-bold mb-2 transition-all duration-500 ${
                      isActive ? 'text-white' : 'text-gray-300'
                    }`}>
                      {stat.value}
                    </div>
                    
                    <div className="text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Legal Practice?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of legal professionals who trust cascade.ai for advanced case analysis and research.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="group px-10 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center space-x-2">
                  <span>Get Started Now</span>
                  <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </button>
              
              <Link 
                to="/demo"
                className="group px-10 py-4 border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <span>Try Demo</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;