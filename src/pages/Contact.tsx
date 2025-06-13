import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "hello@cascade.ai",
      description: "Get in touch for general inquiries"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Speak with our team directly"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Legal Tech Ave, San Francisco, CA 94105",
      description: "Our headquarters in the heart of SF"
    }
  ];

  const faqs = [
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI maintains a 94.7% accuracy rate in case analysis and precedent identification, validated through extensive testing with legal professionals."
    },
    {
      question: "Is my data secure and confidential?",
      answer: "Yes, we use enterprise-grade encryption and comply with all legal industry standards for data protection and client confidentiality."
    },
    {
      question: "Can I integrate with my existing legal software?",
      answer: "We offer APIs and integrations with major legal practice management systems. Contact us to discuss your specific integration needs."
    },
    {
      question: "What types of cases can the AI analyze?",
      answer: "Our AI can analyze various case types including employment law, contract disputes, personal injury, intellectual property, and more."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-white">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ready to transform your legal practice? We're here to help you get started 
              with cascade.ai and answer any questions you might have.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                Send us a Message
              </h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="bg-green-500/20 p-4 rounded-full w-fit mx-auto mb-4">
                    <CheckCircle className="h-12 w-12 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors duration-300"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors duration-300"
                        placeholder="john@lawfirm.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company/Firm
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors duration-300"
                        placeholder="Law Firm Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors duration-300"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors duration-300"
                    >
                      <option value="">Select a subject</option>
                      <option value="demo">Request a Demo</option>
                      <option value="pricing">Pricing Information</option>
                      <option value="integration">Integration Support</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors duration-300 resize-none"
                      placeholder="Tell us about your needs and how we can help..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info & Quick Actions */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-white p-3 rounded-xl flex-shrink-0">
                        <info.icon className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">
                          {info.title}
                        </h4>
                        <p className="text-gray-300 font-medium mb-1">
                          {info.details}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Quick Actions
                </h3>
                
                <div className="space-y-4">
                  <button className="w-full flex items-center space-x-4 p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                    <div className="bg-white p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-black" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">Schedule a Demo</div>
                      <div className="text-sm text-gray-400">See cascade.ai in action</div>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center space-x-4 p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                    <div className="bg-white p-2 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-black" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">Live Chat</div>
                      <div className="text-sm text-gray-400">Chat with our support team</div>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center space-x-4 p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                    <div className="bg-white p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-black" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">Office Hours</div>
                      <div className="text-sm text-gray-400">Mon-Fri, 9AM-6PM PST</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400">
              Quick answers to common questions about cascade.ai
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;