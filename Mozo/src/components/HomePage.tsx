import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LogOut, Play, Clipboard, FileText, Check, User,
  BarChart2, Clock, Calendar, Award, Star, ChevronRight,
  BookOpen, Target, ArrowUpRight, Bell, Trophy
} from 'lucide-react';

interface HomePageProps {
  user: { name: string; isAdmin?: boolean };
  onLogout: () => void;
  onStartInterview: () => void;
  resumeUploaded?: boolean;
}

const HomePage = ({ user, onLogout, onStartInterview, resumeUploaded = false }: HomePageProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'insights'>('overview');
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [showLeaderboardPreview, setShowLeaderboardPreview] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  // Mock data
  const stats = {
    interviewsCompleted: 12,
    skillScore: 85,
    rank: 'Intermediate',
    upcomingInterviews: 2,
    practiceHours: 24,
    improvementRate: '+15%',
    lastSessionDate: '2023-06-18',
    totalQuestions: 164,
    correctAnswers: 127,
  };
  
  const recentActivities = [
    { id: 1, type: 'interview', title: 'Frontend Developer Interview', date: '2 days ago', score: 88 },
    { id: 2, type: 'practice', title: 'React Hooks Practice Session', date: '5 days ago', score: 92 },
    { id: 3, type: 'interview', title: 'System Design Interview', date: '1 week ago', score: 76 },
  ];
  
  const recommendedSkills = [
    { name: 'React Performance Optimization', level: 'Intermediate', progress: 65 },
    { name: 'TypeScript Advanced Types', level: 'Beginner', progress: 40 },
    { name: 'System Design Principles', level: 'Advanced', progress: 80 },
  ];

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Top 3 candidates for leaderboard preview
  const topCandidates = [
    { name: 'Emily Rodriguez', score: 98, badge: '🚀', avatar: 'https://images.unsplash.com/photo-1573496358961-3c82861ab8f4?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200' },
    { name: 'Michael Chen', score: 95, badge: '🧠', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200' },
    { name: 'Aisha Patel', score: 92, badge: '💻', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw2fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwZGl2ZXJzZXxlbnwwfHx8fDE3NDUyOTcwNjl8MA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clipboard className="h-6 w-6 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-800">Interview Prep</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-900 flex items-center">
              <BarChart2 className="h-5 w-5 mr-1" />
              <span>Dashboard</span>
            </a>
            <button 
              onClick={() => setShowLeaderboardPreview(true)}
              className="text-gray-500 hover:text-gray-900 flex items-center"
            >
              <Trophy className="h-5 w-5 mr-1" />
              <span>Leaderboard</span>
            </button>
            <a href="#" className="text-gray-500 hover:text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-1" />
              <span>Interviews</span>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-1" />
              <span>Resources</span>
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer">
              <Bell className="h-5 w-5 text-gray-500" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">{user.name}</span>
              {user.isAdmin && (
                <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={onLogout}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <span>Logout</span>
              <LogOut className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section with Date/Time */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.name}!
            </h2>
            <p className="text-gray-600">
              {formatDate(currentTime)} • {formatTime(currentTime)}
            </p>
          </div>
          {resumeUploaded ? (
            <div className="mt-4 md:mt-0 bg-green-50 py-2 px-4 rounded-lg border border-green-200 flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700 font-medium">Resume Uploaded</span>
            </div>
          ) : (
            <div className="mt-4 md:mt-0 bg-yellow-50 py-2 px-4 rounded-lg border border-yellow-200 flex items-center">
              <FileText className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-yellow-700 font-medium">Upload Resume to Unlock All Features</span>
            </div>
          )}
        </div>
        
        {/* Dashboard Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Statistics
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === 'insights'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Insights
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Interviews Completed</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.interviewsCompleted}</p>
                      </div>
                      <div className="rounded-full bg-blue-100 p-2">
                        <BarChart2 className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-primary-600 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {stats.improvementRate} from last month
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Skill Score</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.skillScore}%</p>
                      </div>
                      <div className="rounded-full bg-green-100 p-2">
                        <Star className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${stats.skillScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Your Ranking</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.rank}</p>
                      </div>
                      <div className="rounded-full bg-amber-100 p-2">
                        <Award className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-amber-600">
                      <Target className="h-4 w-4 mr-1" />
                      Next: Advanced (15 more points)
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {recentActivities.map((activity, index) => (
                      <div 
                        key={activity.id}
                        className={`flex items-center justify-between p-4 ${
                          index < recentActivities.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`rounded-full p-2 ${
                            activity.type === 'interview' 
                              ? 'bg-blue-100' 
                              : 'bg-purple-100'
                          }`}>
                            {activity.type === 'interview' ? (
                              <User className={`h-5 w-5 ${
                                activity.type === 'interview' 
                                  ? 'text-blue-600' 
                                  : 'text-purple-600'
                              }`} />
                            ) : (
                              <BookOpen className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-500">{activity.date}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          activity.score >= 85 
                            ? 'bg-green-100 text-green-800' 
                            : activity.score >= 70
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          Score: {activity.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Leaderboard Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
                    <button 
                      onClick={() => setShowLeaderboardPreview(prev => !prev)}
                      className="text-sm text-primary-600 cursor-pointer flex items-center"
                    >
                      {showLeaderboardPreview ? 'Hide' : 'View'} Leaderboard <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {showLeaderboardPreview && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6"
                    >
                      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-6 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <Trophy className="h-6 w-6 text-yellow-300 mr-2" />
                            <h3 className="text-white text-lg font-bold">Talent Leaderboard</h3>
                          </div>
                          <a href="#" className="text-white/80 hover:text-white text-sm flex items-center">
                            View Full Rankings <ChevronRight className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                        
                        <div className="relative">
                          <img 
                            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsZWFkZXJib2FyZCUyMHRyb3BoeSUyMGF3YXJkc3xlbnwwfHx8fDE3NDUzMDg1ODN8MA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800" 
                            alt="Leaderboard background" 
                            className="absolute inset-0 opacity-10 object-cover rounded-lg"
                          />
                          
                          <div className="relative z-10 space-y-3">
                            {topCandidates.map((candidate, index) => (
                              <div 
                                key={index}
                                className={`flex items-center p-3 rounded-lg ${
                                  index === 0 
                                    ? 'bg-yellow-500/20 border border-yellow-500/30' 
                                    : index === 1
                                      ? 'bg-gray-500/20 border border-gray-400/30'
                                      : 'bg-amber-700/20 border border-amber-600/30'
                                }`}
                              >
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold text-white">
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </div>
                                <div className="relative mx-3">
                                  <img 
                                    src={candidate.avatar} 
                                    alt={candidate.name} 
                                    className="h-10 w-10 rounded-full object-cover border-2 border-white"
                                  />
                                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center text-xs">
                                    {candidate.badge}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-white font-medium">{candidate.name}</h4>
                                </div>
                                <div className="bg-white/20 text-white font-medium px-2 py-1 rounded-lg text-sm">
                                  {candidate.score}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center text-white/80 text-sm">
                          <span>Your Rank: #12</span>
                          <span>Updated 2 hours ago</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Upcoming Interviews */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
                      <span className="text-sm text-primary-600 cursor-pointer flex items-center">
                        View All <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                    
                    {stats.upcomingInterviews > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 flex">
                          <div className="rounded-full bg-indigo-100 p-3 h-12 w-12 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">Front-end Developer</p>
                            <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
                            <p className="text-xs text-primary-600 mt-1">30 minutes</p>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 flex">
                          <div className="rounded-full bg-indigo-100 p-3 h-12 w-12 flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">System Design Interview</p>
                            <p className="text-sm text-gray-500">Jun 24, 2:00 PM</p>
                            <p className="text-xs text-primary-600 mt-1">45 minutes</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                        <p className="text-gray-500">No upcoming interviews scheduled</p>
                        <button className="text-primary-600 font-medium text-sm mt-2">
                          Schedule an Interview
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Performance Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-500 text-sm">Total Questions</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-500 text-sm">Correct Answers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.correctAnswers}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-500 text-sm">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round((stats.correctAnswers / stats.totalQuestions) * 100)}%
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-500 text-sm">Practice Hours</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.practiceHours}</p>
                    </div>
                  </div>
                </div>
                
                {/* Statistics Chart */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Interview Performance Trend</h3>
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1484981138541-3d074aa97716?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBsZWFkZXJib2FyZCUyMHRyb3BoeSUyMGF3YXJkc3xlbnwwfHx8fDE3NDUzMDg1ODN8MA&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800" 
                      alt="Interview statistics chart"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                      <div className="text-white text-center p-6">
                        <p className="text-2xl font-bold mb-2">Progress Tracking</p>
                        <p className="text-gray-300">Track your interview performance trends over time</p>
                        <button className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded">
                          View Detailed Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'insights' && (
              <div className="space-y-6">
                {/* Skill Assessment */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skill Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Strongest Skills</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">React Fundamentals</span>
                            <span className="text-sm font-medium text-gray-700">96%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: '96%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">JavaScript</span>
                            <span className="text-sm font-medium text-gray-700">92%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">HTML/CSS</span>
                            <span className="text-sm font-medium text-gray-700">90%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-5 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Areas for Improvement</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">System Design</span>
                            <span className="text-sm font-medium text-gray-700">65%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Data Structures</span>
                            <span className="text-sm font-medium text-gray-700">58%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '58%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Backend Development</span>
                            <span className="text-sm font-medium text-gray-700">45%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-red-500 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recommended Focus Areas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Focus Areas</h3>
                  
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {recommendedSkills.map((skill, index) => (
                      <div key={index} className={`p-4 flex items-center justify-between ${
                        index < recommendedSkills.length - 1 ? 'border-b border-gray-200' : ''
                      }`}>
                        <div>
                          <p className="font-medium text-gray-900">{skill.name}</p>
                          <p className="text-sm text-gray-500">Level: {skill.level}</p>
                        </div>
                        <button className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors">
                          Start Practice
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Personalized Advice */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Personalized Advice</h3>
                  <p className="text-blue-100 mb-4">Based on your recent performance, here's what you should focus on:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-blue-200 flex-shrink-0 mt-0.5" />
                      <span>Practice more system design questions to improve architectural thinking</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-blue-200 flex-shrink-0 mt-0.5" />
                      <span>Focus on algorithm problems involving data structures</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-blue-200 flex-shrink-0 mt-0.5" />
                      <span>Spend time on backend concepts to become a more versatile developer</span>
                    </li>
                  </ul>
                  <button className="bg-white text-indigo-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                    View Detailed Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Card */}
        <motion.div
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8">
              <div className="rounded-full bg-primary-100 p-3 w-14 h-14 flex items-center justify-center mb-4">
                {resumeUploaded ? (
                  <Play className="h-7 w-7 text-primary-600" />
                ) : (
                  <FileText className="h-7 w-7 text-primary-600" />
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {resumeUploaded 
                  ? "Ready to Start Your Interview" 
                  : "Upload Your Resume to Begin"}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {resumeUploaded 
                  ? "Your resume has been analyzed and your skills are ready for matching with relevant interview questions."
                  : "Upload your resume to help us tailor questions specific to your experience and skill set."}
              </p>
              
              {resumeUploaded && (
                <div className="mb-6 bg-green-50 p-3 rounded-lg">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-green-800 font-medium">Resume processed successfully</p>
                      <p className="text-green-700 text-sm">Skills and experience extracted</p>
                    </div>
                  </div>
                </div>
              )}
              
              <motion.button
                className="btn-primary w-full md:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStartInterview}
              >
                {resumeUploaded ? "Start Interview Session" : "Upload Resume"}
              </motion.button>
            </div>
            
            <div className="relative hidden md:block overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkYXNoYm9hcmQlMjBzdGF0aXN0aWNzJTIwY2hhcnRzfGVufDB8fHx8MTc0NTI0MzgwNnww&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800" 
                alt="Professional working on dashboard" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary-900/80"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xl font-bold">Improve Your Interview Skills</p>
                <p className="text-white/80">Practice makes perfect</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default HomePage;
 