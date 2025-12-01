import React, { useState, useRef, useEffect } from 'react';
import type { AIResearchRecord } from '../types';

interface AIResearchChatbotProps {
  candidateId: string;
  candidateName: string;
  onSaveResearch: (research: AIResearchRecord) => void;
  existingRecords?: AIResearchRecord[];
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ResearchFinding {
  topic: string;
  findings: string[];
  sources: string[];
}

const AIResearchChatbot: React.FC<AIResearchChatbotProps> = ({
  candidateId,
  candidateName,
  onSaveResearch,
  existingRecords = []
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello! I'm your AI Research Assistant. I'll help you research and verify information about ${candidateName}. What would you like me to investigate? (e.g., verify LinkedIn profile, check GitHub projects, research company background, validate certifications)`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResearch, setCurrentResearch] = useState<ResearchFinding | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulated AI research function
  const performAIResearch = async (query: string): Promise<ResearchFinding> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate different research scenarios based on query
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('github') || lowerQuery.includes('portfolio')) {
      return {
        topic: 'GitHub & Portfolio Verification',
        findings: [
          'Found GitHub profile with 45 public repositories',
          'Primary focus on Machine Learning projects',
          'Recent activity: Active contributor in last 7 days',
          'Most popular project: "AI-Speech-Recognition" with 234 stars',
          'Code quality: Generally well-structured with good documentation',
          'Collaboration: Member of 3 open-source organizations'
        ],
        sources: ['GitHub API', 'Portfolio Website', 'GitHub Insights']
      };
    } else if (lowerQuery.includes('linkedin') || lowerQuery.includes('experience')) {
      return {
        topic: 'LinkedIn & Professional Experience',
        findings: [
          'LinkedIn profile verified - 5+ years experience',
          'Currently employed at TechCorp as ML Engineer',
          'Previously worked at DataFlow (2 years) and ResearchLab (1.5 years)',
          'Endorsements: 89 for Machine Learning, 76 for Python, 65 for Deep Learning',
          'Recommendations: 8 positive recommendations from colleagues',
          'Skills endorsement growth: +15% in last 6 months'
        ],
        sources: ['LinkedIn', 'Company Records', 'Professional Network']
      };
    } else if (lowerQuery.includes('education') || lowerQuery.includes('degree')) {
      return {
        topic: 'Education & Certifications',
        findings: [
          'Bachelor\'s Degree in Computer Science - MIT (Graduated 2019)',
          'Master\'s Degree in Artificial Intelligence - Stanford (Graduated 2021)',
          'Certifications: TensorFlow Professional (Valid), AWS ML Specialty (Valid)',
          'Online Courses Completed: 12 relevant courses on Machine Learning',
          'GPA: 3.8/4.0 (Undergraduate), 3.9/4.0 (Graduate)',
          'Published Research: 3 papers in peer-reviewed journals'
        ],
        sources: ['University Records', 'Certification Databases', 'Academic Publications']
      };
    } else if (lowerQuery.includes('background') || lowerQuery.includes('verify')) {
      return {
        topic: 'Background Verification',
        findings: [
          'Identity verified through multiple sources',
          'Employment history validated with previous employers',
          'No criminal record found',
          'Reference check in progress (1 of 3 completed)',
          'Credit check: Good standing',
          'All information matches submitted documents'
        ],
        sources: ['Background Check Provider', 'Employer Records', 'Government Records']
      };
    } else if (lowerQuery.includes('skills') || lowerQuery.includes('technical')) {
      return {
        topic: 'Technical Skills Assessment',
        findings: [
          'Primary Skills: Python (Expert), Machine Learning (Advanced), Deep Learning (Advanced)',
          'Secondary Skills: TensorFlow (Advanced), PyTorch (Intermediate), Scikit-learn (Expert)',
          'Cloud Platforms: AWS ML (Proficient), Google Cloud AI (Proficient)',
          'Data Management: SQL (Expert), Spark (Advanced), Hadoop (Intermediate)',
          'Soft Skills: Leadership (Strong), Communication (Strong), Team Collaboration (Excellent)',
          'Language Proficiency: English (Fluent), Spanish (Fluent)'
        ],
        sources: ['LinkedIn Profile', 'GitHub Analysis', 'Assessment Results']
      };
    } else {
      return {
        topic: 'General Research',
        findings: [
          'Candidate appears to be a strong fit for AI/ML roles',
          'Active in the tech community and contributes to open source',
          'Demonstrates continuous learning through certifications',
          'Professional network includes leaders in AI field',
          'Strong track record based on available information',
          'Recommended for technical interview round'
        ],
        sources: ['Multiple Data Sources', 'Public Records', 'Professional Network']
      };
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Perform AI research
      const research = await performAIResearch(input);
      setCurrentResearch(research);

      // Add AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `I've completed my research on "${research.topic}". Here are the findings:\n\n${research.findings.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n📊 Sources: ${research.sources.join(', ')}\n\nWould you like to save these findings to the candidate's profile?`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I encountered an error during the research. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResearch = () => {
    if (!currentResearch) return;

    const record: AIResearchRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      topic: currentResearch.topic,
      findings: currentResearch.findings.join('\n'),
      sources: currentResearch.sources,
      savedByUser: true
    };

    onSaveResearch(record);

    // Add confirmation message
    const confirmMessage: Message = {
      id: (Date.now() + 2).toString(),
      sender: 'ai',
      text: `✅ Research findings on "${currentResearch.topic}" have been saved to ${candidateName}'s profile. Would you like to research another topic?`,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, confirmMessage]);
    setCurrentResearch(null);
  };

  const handleDiscardResearch = () => {
    const discardMessage: Message = {
      id: (Date.now() + 2).toString(),
      sender: 'ai',
      text: 'Understood. The research findings were not saved. Feel free to ask me to research something else!',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, discardMessage]);
    setCurrentResearch(null);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <h2 className="text-lg font-bold">🤖 AI Research Assistant</h2>
        <p className="text-sm opacity-90">Researching: {candidateName}</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-lg whitespace-pre-wrap text-sm ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none animate-pulse">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Research Options (if research is available) */}
      {currentResearch && (
        <div className="border-t bg-blue-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700">Save these findings?</p>
          <div className="flex gap-3">
            <button
              onClick={handleSaveResearch}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              ✅ Save to Profile
            </button>
            <button
              onClick={handleDiscardResearch}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              ❌ Discard
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me to research... (GitHub, LinkedIn, skills, background, etc.)"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            {isLoading ? '🔍' : '🔎'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Try: "Check GitHub", "Verify LinkedIn", "Validate certifications", "Background check"
        </p>
      </div>
    </div>
  );
};

export default AIResearchChatbot;
