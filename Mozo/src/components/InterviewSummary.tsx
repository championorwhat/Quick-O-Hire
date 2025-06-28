import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Download, Star, AlertCircle, ArrowRight, Award, Check, X } from 'lucide-react';

interface InterviewSummaryProps {
  onFinish: () => void;
}

interface QuestionAnswer {
  id: number;
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

const InterviewSummary = ({ onFinish }: InterviewSummaryProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [downloadClicked, setDownloadClicked] = useState(false);

  // Mock data
  const summaryData = {
    skillMatch: 85,
    confidence: "Confident",
    sentiment: "Positive",
    timeSpent: "14 minutes",
    questionsAnswered: 5,
  };

  // Mock Q&A data
  const questionsAnswers: QuestionAnswer[] = [
    {
      id: 1,
      question: "Tell me about your experience with React and TypeScript.",
      answer: "I have been working with React for about three years now. I started with class components but quickly transitioned to hooks when they were released. For TypeScript, I have been using it for the past two years and find it invaluable for catching errors early and improving code documentation through types.",
      score: 92,
      feedback: "Strong technical response with specific examples of experience. Good mention of transition to modern practices."
    },
    {
      id: 2,
      question: "Describe a challenging project you worked on and how you resolved issues.",
      answer: "I worked on a real-time dashboard that had performance issues when displaying large datasets. I implemented virtualization and memoization to only render visible components and prevent unnecessary re-renders. This improved performance by 70%.",
      score: 88,
      feedback: "Good problem-solution structure. Could provide more details on the specific implementation challenges."
    },
    {
      id: 3,
      question: "How do you approach learning new technologies?",
      answer: "I start with official documentation to understand core concepts, then build small projects to apply what I have learned. I usually follow up with more advanced tutorials and join communities for tips and best practices.",
      score: 85,
      feedback: "Solid approach showing systematic learning style. Demonstrates continuous learning mindset."
    },
    {
      id: 4,
      question: "What's your experience with responsive design?",
      answer: "I have implemented responsive designs using media queries, flexbox, and CSS Grid. I follow a mobile-first approach and use tools like Tailwind CSS to ensure consistency across devices.",
      score: 78,
      feedback: "Covers basics but lacks detailed examples of complex responsive UI challenges solved."
    },
    {
      id: 5,
      question: "Where do you see yourself in 5 years?",
      answer: "I aim to grow into a senior developer role where I can architect solutions and mentor junior developers. I am also interested in deepening my expertise in performance optimization and accessibility.",
      score: 82,
      feedback: "Shows clear career direction and growth mindset. Could expand on specific skills to develop."
    }
  ];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDownload = () => {
    setDownloadClicked(true);
    // Mock download functionality
    setTimeout(() => {
      setDownloadClicked(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-blue-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl"
      >
        <div className="card bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
          {/* Header Image */}
          <div className="h-40 overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1559919304-00f415bab202?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBncmFkaWVudCUyMGJhY2tncm91bmQlMjBibHVlfGVufDB8fHx8MTc0NTIxMzk3MXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=800" 
              alt="Interview Summary" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/80"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-3xl font-bold">Interview Summary</h1>
              <p className="text-white/80">Your performance analysis</p>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            {/* Summary Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Skill Match */}
              <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white/70 text-sm">Skill Match</h3>
                    <div className="text-white text-2xl font-bold">{summaryData.skillMatch}%</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-100/20 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary-300" />
                  </div>
                </div>
                <div className="mt-3 bg-white/10 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${summaryData.skillMatch}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Confidence Level */}
              <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white/70 text-sm">Confidence Level</h3>
                    <div className="text-white text-2xl font-bold">{summaryData.confidence}</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100/20 flex items-center justify-center">
                    <Star className="h-6 w-6 text-green-300" />
                  </div>
                </div>
                <div className="mt-3 flex space-x-1">
                  {[1, 2, 3, 4].map((star) => (
                    <div 
                      key={star} 
                      className={`h-2 flex-1 rounded-full ${star <= 3 ? 'bg-green-500' : 'bg-white/20'}`}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Time & Questions */}
              <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white/70 text-sm">Overall Sentiment</h3>
                    <div className="text-white text-2xl font-bold">{summaryData.sentiment}</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-indigo-100/20 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-indigo-300" />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white/5 rounded p-2 text-white/80">
                    <span className="block text-xs text-white/60">Time</span>
                    {summaryData.timeSpent}
                  </div>
                  <div className="bg-white/5 rounded p-2 text-white/80">
                    <span className="block text-xs text-white/60">Questions</span>
                    {summaryData.questionsAnswered} answered
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Question & Answer Analysis */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Question & Answer Analysis</h2>
              
              <div className="space-y-3">
                {questionsAnswers.map((qa, index) => (
                  <motion.div
                    key={qa.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index + 0.5 }}
                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  >
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => toggleExpand(qa.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className={`px-2.5 py-1 text-xs font-medium rounded-full mr-3 ${getScoreBackground(qa.score)} ${getScoreColor(qa.score)}`}>
                            {qa.score}%
                          </div>
                          <h3 className="text-white font-medium line-clamp-1">{qa.question}</h3>
                        </div>
                      </div>
                      <div className="text-white/70">
                        {expandedId === qa.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedId === qa.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10 bg-white/5"
                        >
                          <div className="p-4 text-white/90">
                            <div className="bg-white/10 rounded-lg p-3 mb-3">
                              <p className="text-sm">{qa.answer}</p>
                            </div>
                            
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-white/80 mb-1">Feedback:</h4>
                              <p className="text-sm text-white/70">{qa.feedback}</p>
                            </div>
                            
                            <div className="mt-4 flex items-center">
                              <div className="text-sm text-white/60 mr-1">Strengths:</div>
                              <div className="flex space-x-1">
                                {Array.from({ length: Math.floor(qa.score / 20) }).map((_, i) => (
                                  <Check key={i} size={16} className="text-green-400" />
                                ))}
                                {Array.from({ length: 5 - Math.floor(qa.score / 20) }).map((_, i) => (
                                  <X key={i} size={16} className="text-white/20" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Actions */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={onFinish}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center"
              >
                Return to Dashboard
              </button>
              
              <button
                onClick={handleDownload}
                disabled={downloadClicked}
                className="btn-primary w-full sm:w-auto flex items-center justify-center"
              >
                {downloadClicked ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-2" /> 
                    Download Report (PDF)
                  </>
                )}
              </button>
            </motion.div>
            
            {/* Suggested Next Steps */}
            <motion.div
              className="mt-8 bg-white/5 border border-white/10 rounded-xl p-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-white font-medium mb-3">Suggested Next Steps</h3>
              <div className="space-y-2">
                {[
                  "Practice more technical questions related to performance optimization",
                  "Work on providing more concrete examples in your responses",
                  "Schedule a mock interview with a career coach for feedback"
                ].map((suggestion, index) => (
                  <div key={index} className="flex items-start">
                    <ArrowRight size={16} className="text-primary-400 mr-2 mt-1 flex-shrink-0" />
                    <p className="text-white/80 text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewSummary;
 