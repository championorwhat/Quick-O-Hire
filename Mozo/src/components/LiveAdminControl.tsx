import  { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Clock, Send, Play, Eye, LogOut,
  CheckCircle, AlertCircle, Users, BellRing, 
  X, ChevronDown, RefreshCw, Zap, Menu, 
  ArrowRight, Filter, Settings, BarChart2
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  status: 'waiting' | 'live' | 'completed';
  position: string;
  question: number;
  remainingTime?: number;
}

interface LiveAdminControlProps {
  onLogout: () => void;
  onNavigate: (view: 'admin' | 'livecontrol' | 'leaderboard') => void;
}

const LiveAdminControl = ({ onLogout, onNavigate }: LiveAdminControlProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([
    { 
      id: '1', 
      name: 'Emily Rodriguez', 
      avatar: 'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      status: 'live',
      position: 'Frontend Developer',
      question: 3,
      remainingTime: 43
    },
    { 
      id: '2', 
      name: 'Michael Chen', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      status: 'waiting',
      position: 'Backend Developer',
      question: 0
    },
    { 
      id: '3', 
      name: 'Aisha Patel', 
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw2fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      status: 'waiting',
      position: 'UX Designer',
      question: 0
    },
    { 
      id: '4', 
      name: 'David Cooper', 
      avatar: 'https://images.unsplash.com/photo-1474176857210-7287d38d27c6?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      status: 'completed',
      position: 'Data Scientist',
      question: 5
    },
    { 
      id: '5', 
      name: 'Sarah Miller', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      status: 'waiting',
      position: 'Product Manager',
      question: 0
    },
    { 
      id: '6', 
      name: 'James Wilson', 
      avatar: 'https://images.unsplash.com/photo-1568038479111-87bf80659645?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw5fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      status: 'waiting',
      position: 'DevOps Engineer',
      question: 0
    }
  ]);
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(candidates[0]);
  const [transcripts, setTranscripts] = useState<{id: string, text: string, isUser: boolean}[]>([
    { id: '1', text: "Tell me about your experience with React.", isUser: true },
    { id: '2', text: "I've been working with React for about three years now. I started with class components but quickly transitioned to hooks when they were released. I've built several complex applications using React, Redux for state management, and React Router for navigation.", isUser: false },
    { id: '3', text: "Can you give a specific example of a challenging React problem you solved?", isUser: true },
    { id: '4', text: "One of the most challenging problems I faced was optimizing performance in a large application with deeply nested components. I implemented React.memo, useMemo, and useCallback hooks to prevent unnecessary re-renders. I also used virtualization for long lists to only render visible items.", isUser: false },
    { id: '5', text: "How do you handle API requests and data fetching in your React applications?", isUser: true }
  ]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMicActive, setIsMicActive] = useState(true);
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  
  const transcriptRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Timer effect
  useEffect(() => {
    if (!selectedCandidate || selectedCandidate.status !== 'live' || typeof selectedCandidate.remainingTime === 'undefined') return;
    
    const timer = setInterval(() => {
      setCandidates(prev => prev.map(c => 
        c.id === selectedCandidate.id && typeof c.remainingTime !== 'undefined'
          ? { ...c, remainingTime: c.remainingTime - 1 }
          : c
      ));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [selectedCandidate]);
  
  // Auto-scroll to bottom of transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcripts]);
  
  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };
  
  const handleActionButton = (candidate: Candidate) => {
    if (candidate.status === 'waiting') {
      // Start interview
      setCandidates(prev => prev.map(c => 
        c.id === candidate.id
          ? { ...c, status: 'live', question: 1, remainingTime: 120 }
          : c
      ));
      
      setSelectedCandidate(prev => 
        prev?.id === candidate.id
          ? { ...prev, status: 'live', question: 1, remainingTime: 120 }
          : prev
      );
      
      showToastNotification(`Interview with ${candidate.name} started`);
    } else if (candidate.status === 'live') {
      // Just observe/continue
      setSelectedCandidate(candidate);
    } else {
      // Review completed interview
      setSelectedCandidate(candidate);
    }
  };
  
  const sendQuestion = () => {
    if (!newQuestion.trim() || !selectedCandidate) return;
    
    // Add question to transcripts
    setTranscripts(prev => [...prev, { 
      id: (prev.length + 1).toString(), 
      text: newQuestion, 
      isUser: true 
    }]);
    
    setNewQuestion('');
    setIsProcessing(true);
    
    // Simulate AI/candidate thinking
    setTimeout(() => {
      setIsProcessing(false);
      
      // Add mock response
      const responses = [
        "For API requests, I typically use Axios or the fetch API wrapped in custom hooks. I implement loading states, error handling, and data caching. I often use React Query for managing server state because it provides great features like background updates and automatic refetching.",
        "I'm familiar with both RESTful APIs and GraphQL. I prefer using GraphQL for complex applications because it gives clients more control over the data they receive and reduces over-fetching.",
        "I usually create a services layer that abstracts the API calls, then use React's Context API or a state management library like Redux to manage the fetched data and make it available throughout the application."
      ];
      
      setTranscripts(prev => [...prev, { 
        id: (prev.length + 1).toString(), 
        text: responses[Math.floor(Math.random() * responses.length)], 
        isUser: false 
      }]);
    }, 3000);
  };
  
  const handleNudgeCandidate = () => {
    if (!selectedCandidate) return;
    
    showToastNotification(`Nudge sent to ${selectedCandidate.name}`);
    
    // Simulate candidate response after nudge
    setTimeout(() => {
      if (isProcessing) {
        setIsProcessing(false);
        
        setTranscripts(prev => [...prev, { 
          id: (prev.length + 1).toString(), 
          text: "Sorry for the pause. To continue my answer, I also make sure to handle loading and error states properly in the UI, showing loading spinners or skeleton screens during data fetching and meaningful error messages when something goes wrong.", 
          isUser: false 
        }]);
      }
    }, 2000);
  };
  
  const toggleQuestionComplete = () => {
    setQuestionCompleted(!questionCompleted);
    
    showToastNotification(questionCompleted 
      ? "Question marked as incomplete" 
      : "Question marked as complete");
  };
  
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  
  const formatTime = (seconds?: number) => {
    if (typeof seconds === 'undefined') return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile menu button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu className="h-6 w-6 text-gray-200" />
      </button>
      
      {/* Side Panel */}
      <div 
        className={`fixed lg:relative inset-y-0 left-0 transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-72 bg-gray-800 transition-transform duration-200 ease-in-out z-30 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-400" />
            <h2 className="font-semibold text-lg">Live Candidates</h2>
          </div>
          <div className="bg-indigo-900/50 px-2 py-1 rounded-md text-xs font-medium text-indigo-300">
            {candidates.filter(c => c.status === 'live').length} Live
          </div>
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-3 bg-gray-900/30 border-b border-gray-700 flex items-center justify-between">
          <button 
            className="text-sm text-white flex items-center bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition-colors"
            onClick={() => onNavigate('admin')}
          >
            <BarChart2 className="h-4 w-4 mr-1.5" />
            Back to Dashboard
          </button>
          <button className="text-xs text-gray-300 flex items-center">
            <Settings className="h-3.5 w-3.5 mr-1" />
            Settings
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {candidates.map(candidate => (
            <motion.div
              key={candidate.id}
              className={`p-3 border-b border-gray-700 cursor-pointer ${
                selectedCandidate?.id === candidate.id ? 'bg-indigo-900/30' : 'hover:bg-gray-700/50'
              }`}
              onClick={() => handleCandidateSelect(candidate)}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={candidate.avatar} 
                      alt={candidate.name} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-gray-800 ${
                      candidate.status === 'live' 
                        ? 'bg-red-500' 
                        : candidate.status === 'waiting' 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-sm">{candidate.name}</h3>
                    <p className="text-xs text-gray-400">{candidate.position}</p>
                  </div>
                </div>
                <div className={`text-xs px-1.5 py-0.5 rounded-md ${
                  candidate.status === 'live' 
                    ? 'bg-red-900/30 text-red-400' 
                    : candidate.status === 'waiting' 
                      ? 'bg-yellow-900/30 text-yellow-400' 
                      : 'bg-green-900/30 text-green-400'
                }`}>
                  {candidate.status === 'live' 
                    ? `Q${candidate.question}` 
                    : candidate.status === 'waiting' 
                      ? 'Waiting' 
                      : 'Done'}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <button
                  className={`text-xs px-3 py-1 rounded-md 
                    ${candidate.status === 'waiting' 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : candidate.status === 'live' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    } transition-colors`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionButton(candidate);
                  }}
                >
                  {candidate.status === 'waiting' ? (
                    <span className="flex items-center">
                      <Play className="h-3 w-3 mr-1" /> Start
                    </span>
                  ) : candidate.status === 'live' ? (
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" /> Observe
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Review
                    </span>
                  )}
                </button>
                
                {candidate.status === 'live' && (
                  <div className="text-xs text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(candidate.remainingTime)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={onLogout}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm flex items-center justify-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
          {selectedCandidate && (
            <div className="flex items-center">
              <img 
                src={selectedCandidate.avatar} 
                alt={selectedCandidate.name} 
                className="h-10 w-10 rounded-full object-cover mr-3"
              />
              <div>
                <h2 className="font-semibold">{selectedCandidate.name}</h2>
                <div className="flex items-center text-sm text-gray-400">
                  <span className="mr-3">{selectedCandidate.position}</span>
                  <div className={`h-2 w-2 rounded-full mr-1.5 ${
                    selectedCandidate.status === 'live' 
                      ? 'bg-red-500' 
                      : selectedCandidate.status === 'waiting' 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`} />
                  <span>{
                    selectedCandidate.status === 'live' 
                      ? 'Live Interview' 
                      : selectedCandidate.status === 'waiting' 
                        ? 'Waiting to Start' 
                        : 'Interview Complete'
                  }</span>
                </div>
              </div>
            </div>
          )}
          
          {selectedCandidate?.status === 'live' && (
            <div className="flex items-center space-x-3">
              <div className="bg-gray-900 rounded-md px-3 py-1.5 flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1.5 text-indigo-400" />
                <span className="font-mono font-medium">
                  {formatTime(selectedCandidate?.remainingTime)} left for Q{selectedCandidate?.question}
                </span>
              </div>
              <div className={`flex items-center px-3 py-1.5 rounded-md ${isMicActive ? 'bg-red-900/30 text-red-400' : 'bg-gray-700 text-gray-400'}`}>
                <Mic className="h-4 w-4 mr-1.5" />
                <span className="text-sm">{isMicActive ? 'Mic On' : 'Mic Off'}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto">
          {selectedCandidate ? (
            <>
              {/* Transcription Panel */}
              <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 mb-4">
                <div className="p-3 bg-gray-700 text-sm font-medium flex justify-between items-center">
                  <span>Live Transcription</span>
                  
                  {isProcessing && (
                    <div className="flex items-center text-indigo-300 text-xs px-2 py-1 bg-indigo-900/30 rounded-md">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      >
                        <RefreshCw className="h-3 w-3 mr-1.5" />
                      </motion.div>
                      AI Processing
                    </div>
                  )}
                </div>
                
                <div 
                  ref={transcriptRef}
                  className="p-4 h-64 md:h-80 overflow-y-auto bg-gray-900/50"
                >
                  {selectedCandidate.status !== 'waiting' ? (
                    <div className="space-y-4">
                      {transcripts.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-3/4 rounded-lg px-4 py-2 text-sm ${
                            message.isUser
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-200'
                          }`}>
                            {message.text}
                          </div>
                        </motion.div>
                      ))}
                      
                      {isProcessing && (
                        <div className="flex justify-start">
                          <div className="bg-gray-700 rounded-lg px-4 py-2 text-gray-300 text-sm">
                            <motion.div 
                              className="flex space-x-1"
                              initial="initial"
                              animate="animate"
                            >
                              {[0, 1, 2].map((dot) => (
                                <motion.div
                                  key={dot}
                                  className="h-2 w-2 rounded-full bg-gray-400"
                                  variants={{
                                    initial: { y: 0 },
                                    animate: {
                                      y: [-3, 0, -3],
                                      transition: {
                                        delay: dot * 0.15,
                                        repeat: Infinity,
                                        duration: 1
                                      }
                                    }
                                  }}
                                />
                              ))}
                            </motion.div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <p>Interview has not started yet</p>
                        <button 
                          className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm"
                          onClick={() => handleActionButton(selectedCandidate)}
                        >
                          Start Interview
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Controls */}
              {selectedCandidate.status === 'live' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Follow-up Question */}
                  <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-sm font-medium mb-2">Follow-up Question</h3>
                    <div className="flex space-x-2">
                      <textarea
                        ref={questionInputRef}
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Type a follow-up question..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={2}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={sendQuestion}
                        disabled={!newQuestion.trim() || isProcessing}
                      >
                        <Send className="h-5 w-5" />
                      </motion.button>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[
                        "Tell me more about that project",
                        "How did you solve that problem?",
                        "Can you elaborate on your approach?",
                        "What technologies did you use?",
                        "What challenges did you face?"
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-md"
                          onClick={() => setNewQuestion(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Control Actions */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col justify-between">
                    <h3 className="text-sm font-medium mb-3">Interview Controls</h3>
                    
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm flex items-center justify-center"
                        onClick={handleNudgeCandidate}
                      >
                        <BellRing className="h-4 w-4 mr-2" />
                        Nudge Candidate
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-2 px-4 rounded-md text-sm flex items-center justify-center ${
                          questionCompleted
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                        onClick={toggleQuestionComplete}
                      >
                        {questionCompleted ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Question Completed
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Question Complete
                          </>
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-2 px-4 rounded-md text-sm flex items-center justify-center ${
                          isMicActive
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                        onClick={() => setIsMicActive(!isMicActive)}
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        {isMicActive ? 'Mute Microphone' : 'Unmute Microphone'}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm flex items-center justify-center"
                        onClick={() => {
                          setQuestionCompleted(true);
                          showToastNotification("Moving to next question");
                          
                          // Simulate going to next question
                          if (selectedCandidate && selectedCandidate.question < 5) {
                            setCandidates(prev => prev.map(c => 
                              c.id === selectedCandidate.id
                                ? { ...c, question: c.question + 1, remainingTime: 120 }
                                : c
                            ));
                            
                            setSelectedCandidate(prev => 
                              prev ? { ...prev, question: prev.question + 1, remainingTime: 120 } : null
                            );
                          }
                        }}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Next Question
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Status/Metrics Dashboard */}
              {selectedCandidate.status === 'live' && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-xs text-gray-400 mb-1">Session Duration</h3>
                    <div className="text-xl font-semibold">12:34</div>
                    <div className="mt-2 text-xs text-gray-500">Started at 3:45 PM</div>
                  </div>
                  
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-xs text-gray-400 mb-1">Questions Completed</h3>
                    <div className="text-xl font-semibold">{selectedCandidate.question - 1}/5</div>
                    <div className="mt-2 h-1.5 bg-gray-700 rounded-full">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${((selectedCandidate.question - 1) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-xs text-gray-400 mb-1">Average Response Time</h3>
                    <div className="text-xl font-semibold">45s</div>
                    <div className="mt-2 text-xs text-gray-500">+5s from benchmark</div>
                  </div>
                  
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-xs text-gray-400 mb-1">Sentiment Analysis</h3>
                    <div className="text-xl font-semibold text-green-400">Positive</div>
                    <div className="mt-2 flex space-x-1">
                      <div className="h-1.5 flex-1 bg-green-500 rounded-full"></div>
                      <div className="h-1.5 flex-1 bg-gray-700 rounded-full"></div>
                      <div className="h-1.5 flex-1 bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                <p className="text-lg">Select a candidate to begin</p>
                <p className="text-sm mt-1">Choose from the list on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-4 right-4 bg-gray-800 border border-indigo-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="h-4 w-4 text-indigo-400 mr-2" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveAdminControl;
 