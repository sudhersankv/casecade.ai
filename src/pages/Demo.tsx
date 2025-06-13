import React, { useState } from 'react';
import { Brain, Clock, ArrowLeft } from 'lucide-react';
import DemoInterface from '../components/DemoInterface';
import TimelineGenerator from '../components/TimelineGenerator';

const Demo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<'selection' | 'assistant' | 'timeline'>('selection');

  const renderDemoSelection = () => (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-white">
              Choose Your Demo Experience
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore our AI-powered legal tools. Try our intelligent legal assistant or 
              experience our advanced timeline generation capabilities.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Options */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Legal Assistant Demo */}
            <div 
              onClick={() => setSelectedDemo('assistant')}
              className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 transform hover:scale-105 cursor-pointer"
            >
              <div className="text-center">
                <div className="bg-white p-6 rounded-2xl w-fit mx-auto mb-6">
                  <Brain className="h-12 w-12 text-black" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-300">
                  AI Legal Assistant
                </h3>
                
                <p className="text-gray-400 leading-relaxed mb-6">
                  Experience our conversational AI that can analyze cases, find precedents, 
                  provide strategic insights, and answer complex legal questions with advanced reasoning.
                </p>

                <div className="space-y-2 text-left mb-6">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span>Case analysis and strategic insights</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span>Precedent discovery from 2.3M+ cases</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span>Document analysis and review</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span>Interactive legal consultation</span>
                  </div>
                </div>
                
                <button className="w-full px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all duration-300">
                  Try Legal Assistant
                </button>
              </div>
            </div>

            {/* Timeline Generator Demo */}
            <div 
              onClick={() => setSelectedDemo('timeline')}
              className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 transform hover:scale-105 cursor-pointer"
            >
              <div className="text-center">
                <div className="bg-white p-6 rounded-2xl w-fit mx-auto mb-6">
                  <Clock className="h-12 w-12 text-black" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-300">
                  Timeline Generator
                </h3>
                
                <p className="text-gray-400 leading-relaxed mb-6">
                  Transform case descriptions and legal documents into detailed, chronological 
                  timelines with advanced temporal reasoning and event analysis.
                </p>

                <div className="space-y-2 text-left mb-6">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span>Automatic event extraction</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span>Temporal relationship analysis</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span>Event importance classification</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span>Interactive timeline visualization</span>
                  </div>
                </div>
                
                <button className="w-full px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all duration-300">
                  Try Timeline Generator
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderBackButton = () => (
    <div className="fixed top-20 left-4 z-50">
      <button
        onClick={() => setSelectedDemo('selection')}
        className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Demo Selection</span>
      </button>
    </div>
  );

  if (selectedDemo === 'selection') {
    return renderDemoSelection();
  }

  return (
    <div className="relative">
      {renderBackButton()}
      {selectedDemo === 'assistant' && <DemoInterface />}
      {selectedDemo === 'timeline' && <TimelineGenerator />}
    </div>
  );
};

export default Demo;