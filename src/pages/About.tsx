import React from 'react';
import { 
  Brain, 
  Users, 
  Target, 
  Award, 
  Lightbulb, 
  Shield,
  TrendingUp,
  Globe
} from 'lucide-react';

const About: React.FC = () => {
  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      background: "Former Stanford AI researcher with 15+ years in legal tech",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      background: "Ex-Google engineer specializing in NLP and temporal reasoning",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Judge Patricia Williams (Ret.)",
      role: "Chief Legal Advisor",
      background: "30 years on the bench, expert in case law and legal precedents",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Dr. James Liu",
      role: "Head of AI Research",
      background: "PhD in Computer Science, published researcher in legal AI",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "We believe legal analysis requires the highest level of accuracy and attention to detail."
    },
    {
      icon: Shield,
      title: "Security",
      description: "Client confidentiality and data security are paramount in everything we build."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We push the boundaries of what's possible with AI in legal practice."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We work closely with legal professionals to understand their real needs."
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Company Founded",
      description: "Started with a vision to revolutionize legal research using AI"
    },
    {
      year: "2022",
      title: "First AI Model",
      description: "Developed our proprietary temporal reasoning algorithm"
    },
    {
      year: "2023",
      title: "Beta Launch",
      description: "Launched beta with 50 law firms, achieving 94% accuracy rate"
    },
    {
      year: "2024",
      title: "Full Platform",
      description: "Released comprehensive platform serving 15,000+ legal professionals"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-white">
              About cascade.ai
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're revolutionizing legal practice by combining cutting-edge artificial intelligence 
              with deep legal expertise to help lawyers work more efficiently and effectively.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-white">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                We believe that every lawyer deserves access to the most advanced tools and insights 
                to serve their clients better. Our mission is to democratize legal intelligence by 
                making sophisticated AI analysis accessible to law firms of all sizes.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                By combining temporal reasoning, comprehensive case analysis, and intelligent precedent 
                discovery, we're helping legal professionals save time, improve accuracy, and build 
                stronger cases for their clients.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-white p-4 rounded-2xl w-fit mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-black" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">94.7%</div>
                  <div className="text-gray-400">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="bg-white p-4 rounded-2xl w-fit mx-auto mb-4">
                    <Users className="h-8 w-8 text-black" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">15K+</div>
                  <div className="text-gray-400">Legal Professionals</div>
                </div>
                <div className="text-center">
                  <div className="bg-white p-4 rounded-2xl w-fit mx-auto mb-4">
                    <Globe className="h-8 w-8 text-black" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">2.3M+</div>
                  <div className="text-gray-400">Cases Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="bg-white p-4 rounded-2xl w-fit mx-auto mb-4">
                    <Award className="h-8 w-8 text-black" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">80%</div>
                  <div className="text-gray-400">Time Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Our Values
            </h2>
            <p className="text-xl text-gray-400">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500"
              >
                <div className="bg-white p-4 rounded-2xl w-fit mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-black" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">
                  {value.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-400">
              Legal experts and AI researchers working together
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                
                <h3 className="text-xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                
                <div className="text-gray-300 font-medium mb-3">
                  {member.role}
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {member.background}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Our Journey
            </h2>
            <p className="text-xl text-gray-400">
              Key milestones in our mission to transform legal practice
            </p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex items-center space-x-8 bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-500"
              >
                <div className="bg-white text-black px-6 py-3 rounded-xl font-bold text-xl flex-shrink-0">
                  {milestone.year}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {milestone.description}
                  </p>
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
              Join Us in Transforming Legal Practice
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Whether you're a legal professional looking to enhance your practice or a talented 
              individual wanting to join our mission, we'd love to hear from you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="px-10 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                Start Free Trial
              </button>
              
              <button className="px-10 py-4 border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                View Careers
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;