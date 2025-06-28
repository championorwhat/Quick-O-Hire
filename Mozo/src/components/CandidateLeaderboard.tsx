import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, Star, ChevronDown, ChevronUp, Eye, EyeOff, Users, Bell, ArrowUpRight, LogOut } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatar: string;
  emoji: string;
  skillMatch: string;
  tagline: string;
  isYou?: boolean;
}

interface CandidateLeaderboardProps {
  onLogout: () => void;
}

const CandidateLeaderboard = ({ onLogout }: CandidateLeaderboardProps) => {
  const [showYourRank, setShowYourRank] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating data loading
    const timer = setTimeout(() => {
      setCandidates([
        {
          id: "1",
          name: "Emily Rodriguez",
          score: 98,
          rank: 1,
          avatar: "https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
          emoji: "🚀",
          skillMatch: "Full-Stack",
          tagline: "Innovation Master"
        },
        {
          id: "2",
          name: "Michael Chen",
          score: 95,
          rank: 2,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
          emoji: "🧠",
          skillMatch: "Backend",
          tagline: "Fast Thinker"
        },
        {
          id: "3",
          name: "Aisha Patel",
          score: 92,
          rank: 3,
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw2fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
          emoji: "💻",
          skillMatch: "Frontend",
          tagline: "UI Wizard"
        },
        {
          id: "4",
          name: "David Cooper",
          score: 88,
          rank: 4,
          avatar: "https://images.unsplash.com/photo-1474176857210-7287d38d27c6?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTIxNDIxNXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
          emoji: "📊",
          skillMatch: "Data Science",
          tagline: "Analytics Pro"
        },
        {
          id: "5",
          name: "Sophia Adams",
          score: 85,
          rank: 5,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
          emoji: "🔥",
          skillMatch: "UX/UI",
          tagline: "Design Maverick"
        },
        {
          id: "6",
          name: "James Wilson",
          score: 83,
          rank: 6,
          avatar: "https://images.unsplash.com/photo-1568038479111-87bf80659645?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw5fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
          emoji: "🎯",
          skillMatch: "Project Management",
          tagline: "Strategy Expert"
        },
        {
          id: "7",
          name: "Luis Sanchez",
          score: 81,
          rank: 7,
          avatar: "https://images.unsplash.com/photo-1515138692129-197a2c608cfd?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw3fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
          emoji: "🔧",
          skillMatch: "DevOps",
          tagline: "Infrastructure Guru"
        },
        {
          id: "8",
          name: "Olivia Johnson",
          score: 79,
          rank: 8,
          avatar: "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw4fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
          emoji: "📱",
          skillMatch: "Mobile",
          tagline: "App Specialist"
        },
        {
          id: "9",
          name: "You",
          score: 76,
          rank: 12,
          avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
          emoji: "⭐",
          skillMatch: "Frontend",
          tagline: "Rising Star",
          isYou: true
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const visibleCandidates = isExpanded ? candidates : candidates.slice(0, 5);
  
  const getDisplayCandidates = () => {
    if (showYourRank) {
      return [...visibleCandidates, candidates.find(c => c.isYou)].filter(
        (c, index, self) => c && self.findIndex(s => s?.id === c?.id) === index
      );
    }
    return visibleCandidates;
  };

  const displayCandidates = getDisplayCandidates();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getCardBackground = (rank: number, isYou?: boolean) => {
    if (isYou) return "bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30";
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-300 to-amber-500 shadow-lg shadow-amber-200 dark:shadow-amber-900/30";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 shadow-md shadow-gray-200 dark:shadow-gray-900/30";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-700 shadow-md shadow-amber-200 dark:shadow-amber-900/30";
      default:
        return "bg-white dark:bg-gray-800 shadow-sm";
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (score: number) => ({
      width: `${score}%`,
      transition: { duration: 1, ease: "easeOut" }
    })
  };

  // Card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  // Glow animation for top 3
  const glowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <div className="text-center">
            <div className="inline-block">
              <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading candidates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Header with logout */}
      <div className="max-w-xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Trophy className="h-6 w-6 text-primary-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white ml-3">Talent Leaderboard</h1>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <span>Logout</span>
          <LogOut className="ml-1 h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-center mt-4">
        <div className="w-full max-w-xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute left-0 bottom-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
              
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h1 className="text-white text-2xl font-bold">Talent Leaderboard</h1>
                  <p className="text-indigo-100 mt-1 text-sm">Top candidates ranked by performance</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button 
                    className="relative bg-white/10 p-2 rounded-lg text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setHasNotification(false)}
                  >
                    <Bell size={20} />
                    {hasNotification && (
                      <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </motion.button>
                  
                  <motion.button
                    className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      showYourRank 
                        ? "bg-white text-indigo-600" 
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => setShowYourRank(!showYourRank)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showYourRank ? <EyeOff size={16} className="mr-1.5" /> : <Eye size={16} className="mr-1.5" />}
                    {showYourRank ? "Hide Your Rank" : "Show Your Rank"}
                  </motion.button>
                </div>
              </div>
              
              <div className="flex items-center mt-6 bg-white/10 rounded-lg p-3">
                <div className="bg-white/10 p-2 rounded-full mr-3">
                  <Users size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-white font-medium">Total Candidates</p>
                    <div className="flex items-center text-emerald-300 text-sm">
                      <ArrowUpRight size={14} className="mr-1" />
                      <span>+12% this week</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">256</div>
                </div>
              </div>
            </div>
            
            {/* List */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-4 px-2">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Showing {displayCandidates.length} candidates</p>
                {candidates.length > 5 && (
                  <button 
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                    {isExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {displayCandidates.map((candidate, index) => {
                    const isTop3 = candidate.rank <= 3;
                    return (
                      <motion.div
                        key={candidate.id}
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                        className={`rounded-xl overflow-hidden relative ${getCardBackground(candidate.rank, candidate.isYou)}`}
                      >
                        {isTop3 && (
                          <motion.div
                            className="absolute inset-0 rounded-xl bg-white/20"
                            variants={glowVariants}
                            initial="hidden"
                            animate="visible"
                          />
                        )}
                        
                        <div className="p-4 flex items-center relative z-10">
                          <div className="w-10 flex-shrink-0 flex items-center justify-center mr-3">
                            {getRankIcon(candidate.rank)}
                          </div>
                          
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-white">
                              <img 
                                src={candidate.avatar} 
                                alt={candidate.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-base shadow">
                              {candidate.emoji}
                            </div>
                          </div>
                          
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <h3 className={`font-semibold truncate ${candidate.isYou || isTop3 ? "text-white" : "text-gray-800 dark:text-white"}`}>
                                  {candidate.name}
                                </h3>
                                <div className="flex items-center">
                                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${candidate.isYou || isTop3 ? "bg-white/20 text-white" : "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"}`}>
                                    {candidate.skillMatch}
                                  </span>
                                  <span className={`ml-2 text-xs ${candidate.isYou || isTop3 ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                                    {candidate.tagline}
                                  </span>
                                </div>
                              </div>
                              <div className={`px-2 py-1 rounded-full ${candidate.isYou || isTop3 ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"} text-sm font-semibold`}>
                                {candidate.score}%
                              </div>
                            </div>
                            
                            <div className="relative mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className={`absolute left-0 top-0 bottom-0 ${
                                  candidate.isYou 
                                  ? "bg-white" 
                                  : candidate.rank === 1 
                                  ? "bg-yellow-500"
                                  : candidate.rank === 2
                                  ? "bg-gray-300"
                                  : candidate.rank === 3
                                  ? "bg-amber-500"
                                  : "bg-primary-600"
                                }`}
                                custom={candidate.score}
                                variants={progressVariants}
                                initial="hidden"
                                animate="visible"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
              
              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Last updated: Today at 10:42 AM
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  Rankings refresh every 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateLeaderboard;
 