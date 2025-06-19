import React, { useState } from 'react';
import { X, Scale, FileText, Users, Calendar, MapPin } from 'lucide-react';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (case_: any) => void;
}

const CreateCaseModal: React.FC<CreateCaseModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseType: '',
    priority: 'medium',
    status: 'active',
    client: '',
    jurisdiction: '',
    nextDeadline: '',
    isPinned: false
  });

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onCreate(formData);
      setFormData({
        title: '',
        description: '',
        caseType: '',
        priority: 'medium',
        status: 'active',
        client: '',
        jurisdiction: '',
        nextDeadline: '',
        isPinned: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const caseTypes = [
    'Employment Law',
    'Contract Law',
    'Personal Injury',
    'Intellectual Property',
    'Corporate Law',
    'Criminal Law',
    'Family Law',
    'Real Estate Law',
    'Immigration Law',
    'Tax Law',
    'Other'
  ];

  const jurisdictions = [
    'Federal',
    'California',
    'New York',
    'Texas',
    'Florida',
    'Illinois',
    'Pennsylvania',
    'Ohio',
    'Georgia',
    'North Carolina',
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 border border-white/20 rounded-3xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-silver-400 to-silver-300 p-4 rounded-2xl w-fit mx-auto mb-4">
            <Scale className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create New Case</h2>
          <p className="text-gray-400">Set up a new legal case for AI analysis and management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Case Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-silver-400 transition-colors"
                placeholder="Enter a descriptive case title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Case Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-silver-400 transition-colors resize-none"
                placeholder="Provide a detailed description of the case, including key facts and circumstances"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Case Type *
              </label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="caseType"
                  value={formData.caseType}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-silver-400 transition-colors"
                >
                  <option value="" className="bg-black text-white">Select case type</option>
                  {caseTypes.map(type => (
                    <option key={type} value={type} className="bg-black text-white">{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Client Name
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-silver-400 transition-colors"
                  placeholder="Client or party name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Jurisdiction
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleInputChange}
                  className="w-full bg-black border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-silver-400 transition-colors"
                >
                  <option value="" className="bg-black text-white">Select jurisdiction</option>
                  {jurisdictions.map(jurisdiction => (
                    <option key={jurisdiction} value={jurisdiction} className="bg-black text-white">{jurisdiction}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-silver-400 transition-colors"
              >
                <option value="low" className="bg-black text-white">Low Priority</option>
                <option value="medium" className="bg-black text-white">Medium Priority</option>
                <option value="high" className="bg-black text-white">High Priority</option>
                <option value="critical" className="bg-black text-white">Critical Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Case Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-silver-400 transition-colors"
              >
                <option value="active" className="bg-black text-white">Active</option>
                <option value="pending" className="bg-black text-white">Pending</option>
                <option value="on_hold" className="bg-black text-white">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Next Deadline (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="nextDeadline"
                  value={formData.nextDeadline}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-silver-400 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPinned"
              name="isPinned"
              checked={formData.isPinned}
              onChange={handleInputChange}
              className="w-4 h-4 text-silver-400 bg-white/10 border-white/20 rounded focus:ring-silver-400 focus:ring-2"
            />
            <label htmlFor="isPinned" className="text-sm text-gray-300">
              Pin this case to the top of the dashboard
            </label>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-silver-400 to-silver-300 text-black rounded-xl font-bold hover:from-silver-300 hover:to-silver-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCaseModal;