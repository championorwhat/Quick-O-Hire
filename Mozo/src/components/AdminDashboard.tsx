import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, FileText, Users, Filter, Clock, Bell, Moon, Sun, 
  Search, ChevronDown, ChevronRight, Check, X, Star, AlertCircle, LogOut,
  Activity, Zap, Radio, BarChart2
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  skills: string[];
  score: number;
  sentiment: string;
  resumeUrl: string;
  resumeName: string;
  interviewDate: string;
  status: 'pending' | 'shortlisted' | 'rejected';
  questions: {
    question: string;
    answer: string;
    score: number;
  }[];
}

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigate: (view: 'admin' | 'livecontrol' | 'leaderboard') => void;
}

const AdminDashboard = ({ onLogout, onNavigate }: AdminDashboardProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'filters'>('list');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [sentimentFilter, setSentimentFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInterviews, setActiveInterviews] = useState(2);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      message: 'Follow-up question incoming for candidate Sarah Miller',
      time: '2 min ago'
    },
    {
      id: '2',
      message: 'New candidate Michael Chen submitted a resume',
      time: '10 min ago'
    },
    {
      id: '3',
      message: 'Interview scheduled with David Smith',
      time: '1 hour ago'
    }
  ]);
  const [remainingTime, setRemainingTime] = useState(45); // seconds
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock data for candidates
  const mockCandidates: Candidate[] = [
    {
      id: '1',
      name: 'Sarah Miller',
      email: 'sarah.miller@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTIxNDIxNXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      skills: ['React', 'TypeScript', 'Node.js', 'UI/UX'],
      score: 92,
      sentiment: 'Positive',
      resumeUrl: '#',
      resumeName: 'sarah_miller_resume.pdf',
      interviewDate: '2023-06-15',
      status: 'pending',
      questions: [
        {
          question: 'Tell me about your experience with React.',
          answer: 'I have been working with React for over 3 years, building complex applications with state management solutions like Redux and Context API. I have also implemented custom hooks for reusable logic.',
          score: 95
        },
        {
          question: 'How do you approach responsive design?',
          answer: 'I always start with a mobile-first approach, using media queries to adapt for larger screens. I prefer using flexible units like percentage, em, and rem, and often use CSS Grid or Flexbox for layouts.',
          score: 90
        },
        {
          question: 'Describe a challenging project you worked on.',
          answer: 'I worked on a real-time dashboard that had performance issues. I implemented virtualization and memoization to only render visible components and prevent unnecessary re-renders. This improved performance by 70%.',
          score: 88
        }
      ]
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTIxNDIxNXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      skills: ['JavaScript', 'Vue.js', 'Python', 'Data Visualization'],
      score: 87,
      sentiment: 'Neutral',
      resumeUrl: '#',
      resumeName: 'michael_chen_resume.pdf',
      interviewDate: '2023-06-16',
      status: 'pending',
      questions: [
        {
          question: 'Tell me about your experience with JavaScript frameworks.',
          answer: 'I have worked extensively with Vue.js and have some experience with React. I am comfortable with component-based architecture and state management in both frameworks.',
          score: 85 
        },
        {
          question: 'How do you handle API integrations?',
          answer: 'I usually use Axios for API calls, setting up interceptors for common error handling. I organize API calls in separate service files and use async/await for clean code.',
          score: 88
        },
        {
          question: 'Describe your experience with data visualization.',
          answer: 'I have used D3.js and Chart.js to create interactive dashboards. I have experience transforming complex data sets into meaningful visualizations.',
          score: 90
        }
      ]
    },
    {
      id: '3',
      name: 'David Smith',
      email: 'david.smith@example.com',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTIxNDIxNXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      score: 78,
      sentiment: 'Positive',
      resumeUrl: '#',
      resumeName: 'david_smith_resume.pdf',
      interviewDate: '2023-06-17',
      status: 'pending',
      questions: [
        {
          question: 'Tell me about your full-stack experience.',
          answer: 'I have built several full-stack applications using the MERN stack (MongoDB, Express, React, Node.js). I am comfortable working on both frontend and backend aspects of development.',
          score: 82
        },
        {
          question: 'How do you approach database design?',
          answer: 'I start by understanding the data relationships and access patterns. For MongoDB, I focus on designing schemas that make common queries efficient while balancing normalization and denormalization.',
          score: 75
        },
        {
          question: 'Describe your experience with authentication systems.',
          answer: 'I have implemented JWT-based auth systems and OAuth integrations. I understand security considerations like token storage, CSRF protection, and handling refresh tokens.',
          score: 80
        }
      ]
    },
    {
      id: '4',
      name: 'Jennifer Lopez',
      email: 'jennifer.lopez@example.com',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTIxNDIxNXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      skills: ['UX Design', 'Figma', 'HTML/CSS', 'React'],
      score: 90,
      sentiment: 'Positive',
      resumeUrl: '#',
      resumeName: 'jennifer_lopez_resume.pdf',
      interviewDate: '2023-06-18',
      status: 'shortlisted',
      questions: [
        {
          question: 'Tell me about your design process.',
          answer: 'My design process starts with understanding user needs through research. I create wireframes, then move to high-fidelity prototypes in Figma. I collaborate with developers and conduct user testing to refine designs.',
          score: 92
        },
        {
          question: 'How do you ensure your designs are accessible?',
          answer: 'I follow WCAG guidelines, ensuring sufficient color contrast, keyboard navigation, and proper alt text. I test with screen readers and consider diverse user needs from the beginning of the design process.',
          score: 88
        },
        {
          question: 'Describe a situation where you had to redesign a feature based on user feedback.',
          answer: 'We received feedback that our checkout process was confusing. I conducted user testing to identify pain points, then redesigned the flow to be more intuitive, reducing cart abandonment by 25%.',
          score: 90
        }
      ]
    },
    {
      id: '5',
      name: 'Robert Khan',
      email: 'robert.khan@example.com',
      avatar: 'https://images.unsplash.com/photo-1474176857210-7287d38d27c6?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTIxNDIxNXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      skills: ['DevOps', 'AWS', 'Docker', 'CI/CD'],
      score: 82,
      sentiment: 'Neutral',
      resumeUrl: '#',
      resumeName: 'robert_khan_resume.pdf',
      interviewDate: '2023-06-19',
      status: 'rejected',
      questions: [
        {
          question: 'Describe your experience with cloud infrastructure.',
          answer: 'I have designed and maintained AWS infrastructures using services like EC2, S3, Lambda, and ECS. I use Infrastructure as Code with Terraform and CloudFormation to ensure consistency and repeatability.',
          score: 85
        },
        {
          question: 'How do you approach CI/CD pipeline design?',
          answer: 'I design pipelines with automated testing, security scanning, and deployment stages. I have used Jenkins, GitHub Actions, and AWS CodePipeline to implement continuous integration and delivery workflows.',
          score: 80
        },
        {
          question: 'Tell me about a time you improved system reliability.',
          answer: 'I implemented automated failover mechanisms and improved our monitoring system. I also conducted chaos engineering experiments to identify weak points in our infrastructure.',
          score: 75
        }
      ]
    },
    {
      id: '6',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      avatar: 'https://images.unsplash.com/photo-1508835277982-1c1b0e205603?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw2fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTIxNDIxNXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200',
      skills: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes'],
      score: 85,
      sentiment: 'Positive',
      resumeUrl: '#',
      resumeName: 'alex_johnson_resume.pdf',
      interviewDate: '2023-06-20',
      status: 'pending',
      questions: [
        {
          question: 'Tell me about your experience with microservices architecture.',
          answer: 'I have designed and implemented microservices using Spring Boot, with service discovery through Eureka and API gateway patterns. I have addressed challenges like data consistency, service communication, and distributed monitoring.',
          score: 88
        },
        {
          question: 'How do you approach testing in a microservices environment?',
          answer: 'I implement unit tests for business logic, integration tests for service boundaries, and contract tests to ensure API compatibility. I also use end-to-end tests sparingly for critical paths.',
          score: 85
        },
        {
          question: 'Describe your experience with containerization and orchestration.',
          answer: 'I have containerized applications with Docker and managed them with Kubernetes. I am familiar with concepts like pods, deployments, services, and configMaps, as well as helm for package management.',
          score: 82
        }
      ]
    }
  ];

  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  
  // Timer effect for the countdown
  useEffect(() => {
    if (remainingTime <= 0) return;
    
    const timer = setTimeout(() => {
      setRemainingTime(time => time - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [remainingTime]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Filter candidates based on selected filters
  const filteredCandidates = candidates.filter(candidate => {
    // Search query filter
    if (searchQuery && !candidate.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Skill filter
    if (selectedSkill && !candidate.skills.includes(selectedSkill)) {
      return false;
    }
    
    // Score range filter
    if (candidate.score < scoreRange[0] || candidate.score > scoreRange[1]) {
      return false;
    }
    
    // Sentiment filter
    if (sentimentFilter && candidate.sentiment !== sentimentFilter) {
      return false;
    }
    
    return true;
  });

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleStatusChange = (candidateId: string, status: 'shortlisted' | 'rejected') => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, status } 
        : candidate
    ));
    
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate({ ...selectedCandidate, status });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // All skills from candidates for filter options
  const allSkills = Array.from(
    new Set(mockCandidates.flatMap(candidate => candidate.skills))
  ).sort();

  // UI theme classes based on dark mode
  const getThemeClasses = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-100',
    sidebar: darkMode ? 'bg-gray-800' : 'bg-white',
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    active: darkMode ? 'bg-gray-700' : 'bg-primary-50',
    input: darkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary-500' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500',
    button: darkMode
      ? 'bg-primary-600 hover:bg-primary-700 text-white'
      : 'bg-primary-600 hover:bg-primary-700 text-white',
    buttonSecondary: darkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-white'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  };

  return (
    <div className={`flex h-screen ${getThemeClasses.bg} transition-colors duration-200`}>
      {/* Sidebar */}
      <div 
        className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
          ${getThemeClasses.sidebar} border-r ${getThemeClasses.border} shadow-lg lg:shadow-none flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-2 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className={`ml-2 font-bold text-lg ${getThemeClasses.text}`}>Admin Dashboard</h1>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className={`${getThemeClasses.textSecondary} text-sm font-medium uppercase tracking-wider`}>
                Navigation
              </div>
            </div>
            <div className="space-y-1">
              <button 
                onClick={() => onNavigate('admin')}
                className={`flex items-center w-full p-2.5 rounded-lg transition-colors ${getThemeClasses.active} text-primary-600 dark:text-primary-400`}
              >
                <BarChart2 size={18} className="mr-2" />
                <span>Dashboard</span>
              </button>
              
              <button 
                onClick={() => onNavigate('livecontrol')}
                className={`flex items-center w-full p-2.5 rounded-lg transition-colors ${getThemeClasses.hover} ${getThemeClasses.textSecondary}`}
              >
                <Radio size={18} className="mr-2" />
                <span>Live Control</span>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className={`${getThemeClasses.textSecondary} text-sm font-medium uppercase tracking-wider`}>
                Data
              </div>
            </div>
            <div className="space-y-1">
              <button 
                onClick={() => setActiveTab('list')}
                className={`flex items-center w-full p-2.5 rounded-lg transition-colors ${
                  activeTab === 'list' 
                    ? `${getThemeClasses.active} text-primary-600 dark:text-primary-400` 
                    : `${getThemeClasses.hover} ${getThemeClasses.textSecondary}`
                }`}
              >
                <Users size={18} className="mr-2" />
                <span>Candidate List</span>
              </button>
              <button 
                onClick={() => setActiveTab('filters')}
                className={`flex items-center w-full p-2.5 rounded-lg transition-colors ${
                  activeTab === 'filters' 
                    ? `${getThemeClasses.active} text-primary-600 dark:text-primary-400` 
                    : `${getThemeClasses.hover} ${getThemeClasses.textSecondary}`
                }`}
              >
                <Filter size={18} className="mr-2" />
                <span>Filters</span>
              </button>
              
              <button 
                onClick={() => onNavigate('leaderboard')}
                className={`flex items-center w-full p-2.5 rounded-lg transition-colors ${getThemeClasses.hover} ${getThemeClasses.textSecondary}`}
              >
                <Activity size={18} className="mr-2" />
                <span>Leaderboard</span>
              </button>
            </div>
          </div>
          
          {activeTab === 'filters' && (
            <div className="mb-6">
              <div className="mb-4">
                <label className={`block ${getThemeClasses.textSecondary} text-sm font-medium mb-2`}>
                  Skill
                </label>
                <select 
                  value={selectedSkill || ''} 
                  onChange={(e) => setSelectedSkill(e.target.value || null)}
                  className={`w-full p-2 rounded-lg border ${getThemeClasses.input}`}
                >
                  <option value="">All Skills</option>
                  {allSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className={`block ${getThemeClasses.textSecondary} text-sm font-medium mb-2`}>
                  Score Range: {scoreRange[0]} - {scoreRange[1]}
                </label>
                <div className="flex gap-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={scoreRange[0]} 
                    onChange={(e) => setScoreRange([parseInt(e.target.value), scoreRange[1]])}
                    className="w-full"
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={scoreRange[1]} 
                    onChange={(e) => setScoreRange([scoreRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className={`block ${getThemeClasses.textSecondary} text-sm font-medium mb-2`}>
                  Sentiment
                </label>
                <div className="space-y-2">
                  {['Positive', 'Neutral', 'Negative'].map(sentiment => (
                    <label key={sentiment} className="flex items-center">
                      <input 
                        type="radio" 
                        name="sentiment" 
                        value={sentiment} 
                        checked={sentimentFilter === sentiment} 
                        onChange={() => setSentimentFilter(sentimentFilter === sentiment ? null : sentiment)}
                        className="mr-2"
                      />
                      <span className={getThemeClasses.textSecondary}>{sentiment}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setSelectedSkill(null);
                  setScoreRange([0, 100]);
                  setSentimentFilter(null);
                  setSearchQuery('');
                }}
                className={`mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline`}
              >
                Reset Filters
              </button>
            </div>
          )}
          
          <div className="mt-auto pt-6 space-y-3">
            <button 
              onClick={toggleDarkMode}
              className={`flex items-center w-full p-2.5 rounded-lg transition-colors ${getThemeClasses.hover} ${getThemeClasses.textSecondary}`}
            >
              {darkMode ? (
                <>
                  <Sun size={18} className="mr-2" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} className="mr-2" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            
            <button 
              onClick={onLogout}
              className={`flex items-center w-full p-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors`}
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className={`${getThemeClasses.sidebar} border-b ${getThemeClasses.border} p-4 flex items-center justify-between shadow-sm`}>
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <MenuIcon />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search candidates..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border ${getThemeClasses.input} w-full md:w-64`}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('livecontrol')}
              className="hidden md:flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <Radio className="h-4 w-4 mr-1.5" />
              Live Control Panel
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 ${getThemeClasses.card} shadow-lg rounded-lg z-10 border ${getThemeClasses.border} overflow-hidden`}>
                  <div className={`p-3 border-b ${getThemeClasses.border} flex justify-between items-center`}>
                    <h3 className={`text-sm font-medium ${getThemeClasses.text}`}>Notifications</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                      {notifications.length} new
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b ${getThemeClasses.border} last:border-0`}
                      >
                        <p className={`text-sm ${getThemeClasses.text} mb-1`}>{notification.message}</p>
                        <p className={`text-xs ${getThemeClasses.textMuted}`}>{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center">
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`${getThemeClasses.textSecondary} hidden md:block text-sm`}>
              <span className="font-medium">Admin User</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTIxNDIxNXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200" 
                alt="Admin" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4">
          {/* Header banner */}
          <div className="w-full rounded-xl overflow-hidden mb-6 relative h-40">
            <img 
              src="https://images.unsplash.com/photo-1503455637927-730bce8583c0?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkYXNoYm9hcmQlMjBoZWFkZXIlMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc0NTI5OTEwM3ww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=800"
              alt="Dashboard Header"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-transparent"></div>
            <div className="absolute top-0 left-0 p-6 flex flex-col h-full justify-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/80 mt-2">Manage candidates, interviews and monitor performance</p>
              <div className="mt-4">
                <button 
                  className="bg-white text-primary-700 px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-gray-100 transition-colors flex items-center"
                  onClick={() => onNavigate('livecontrol')}
                >
                  <Zap className="h-4 w-4 mr-1.5" />
                  Go to Live Control Panel
                </button>
              </div>
            </div>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {/* Active Interviews */}
            <motion.div 
              className={`${getThemeClasses.card} rounded-lg shadow border ${getThemeClasses.border} p-4`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className={`text-lg font-medium ${getThemeClasses.text}`}>Active Interviews</h2>
                  <p className={`${getThemeClasses.textMuted} text-sm`}>Currently in progress</p>
                </div>
                <div className="rounded-full bg-primary-100 dark:bg-primary-900 p-2">
                  <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className={`text-3xl font-bold ${getThemeClasses.text}`}>{activeInterviews}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Live now
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary-500" />
                      <span className={getThemeClasses.textSecondary}>Remaining time:</span>
                    </div>
                    <span className={`font-medium ${getThemeClasses.text}`}>{formatTime(remainingTime)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Candidate Stats */}
            <motion.div 
              className={`${getThemeClasses.card} rounded-lg shadow border ${getThemeClasses.border} p-4`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className={`text-lg font-medium ${getThemeClasses.text}`}>Candidate Stats</h2>
                  <p className={`${getThemeClasses.textMuted} text-sm`}>Overall metrics</p>
                </div>
                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-2">
                  <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                  <div className={`text-lg font-bold ${getThemeClasses.text}`}>{candidates.length}</div>
                  <div className={`text-xs ${getThemeClasses.textMuted}`}>Total</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {candidates.filter(c => c.status === 'shortlisted').length}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-500">Shortlisted</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {candidates.filter(c => c.status === 'rejected').length}
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-500">Rejected</div>
                </div>
              </div>
            </motion.div>
            
            {/* Average Scores */}
            <motion.div 
              className={`${getThemeClasses.card} rounded-lg shadow border ${getThemeClasses.border} p-4`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className={`text-lg font-medium ${getThemeClasses.text}`}>Average Score</h2>
                  <p className={`${getThemeClasses.textMuted} text-sm`}>All candidates</p>
                </div>
                <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-2">
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-end gap-2">
                  <span className={`text-3xl font-bold ${getThemeClasses.text}`}>
                    {Math.round(candidates.reduce((acc, curr) => acc + curr.score, 0) / candidates.length)}%
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    +2.5% from last week
                  </span>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500" 
                      style={{ width: `${Math.round(candidates.reduce((acc, curr) => acc + curr.score, 0) / candidates.length)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Candidate List */}
            <div className={`lg:col-span-1 ${getThemeClasses.card} rounded-lg shadow border ${getThemeClasses.border} overflow-hidden`}>
              <div className={`px-4 py-3 border-b ${getThemeClasses.border} flex justify-between items-center`}>
                <h2 className={`font-medium ${getThemeClasses.text}`}>Candidates ({filteredCandidates.length})</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                  {filteredCandidates.filter(c => c.status === 'pending').length} pending
                </span>
              </div>
              <div className="h-[calc(100vh-16rem)] overflow-y-auto p-2">
                <AnimatePresence>
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate) => (
                      <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                          selectedCandidate?.id === candidate.id 
                            ? `${getThemeClasses.active} border border-primary-200 dark:border-primary-800` 
                            : `${getThemeClasses.hover} border border-transparent`
                        }`}
                        onClick={() => handleCandidateSelect(candidate)}
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                            <img 
                              src={candidate.avatar} 
                              alt={candidate.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className={`font-medium truncate ${getThemeClasses.text}`}>
                                {candidate.name}
                              </p>
                              <div className={`text-xs px-1.5 py-0.5 rounded-full ${
                                candidate.status === 'shortlisted' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                  : candidate.status === 'rejected'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}>
                                {candidate.status === 'shortlisted' 
                                  ? 'Shortlisted' 
                                  : candidate.status === 'rejected'
                                    ? 'Rejected'
                                    : 'Pending'}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p className={`text-xs truncate ${getThemeClasses.textMuted}`}>
                                {candidate.skills.slice(0, 2).join(', ')}
                                {candidate.skills.length > 2 && '...'}
                              </p>
                              <div className="flex items-center">
                                <div className={`text-xs font-medium ${
                                  candidate.score >= 85 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : candidate.score >= 70
                                      ? 'text-blue-600 dark:text-blue-400'
                                      : 'text-yellow-600 dark:text-yellow-400'
                                }`}>
                                  {candidate.score}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className={`${getThemeClasses.textMuted} text-sm`}>No candidates match the filters</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Candidate Details */}
            <div className="lg:col-span-2">
              {selectedCandidate ? (
                <motion.div 
                  className={`${getThemeClasses.card} rounded-lg shadow border ${getThemeClasses.border} overflow-hidden`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`p-6 border-b ${getThemeClasses.border}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={selectedCandidate.avatar} 
                            alt={selectedCandidate.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h2 className={`text-xl font-bold ${getThemeClasses.text}`}>
                            {selectedCandidate.name}
                          </h2>
                          <p className={`${getThemeClasses.textMuted}`}>
                            {selectedCandidate.email}
                          </p>
                          <div className="flex items-center mt-1">
                            <div className={`text-xs px-2 py-0.5 rounded-full mr-2 ${
                              selectedCandidate.sentiment === 'Positive' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : selectedCandidate.sentiment === 'Negative'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                              {selectedCandidate.sentiment}
                            </div>
                            <div className={`text-xs px-2 py-0.5 rounded-full ${
                              selectedCandidate.score >= 85 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : selectedCandidate.score >= 70
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}>
                              Score: {selectedCandidate.score}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleStatusChange(selectedCandidate.id, 'shortlisted')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                            selectedCandidate.status === 'shortlisted'
                              ? 'bg-green-600 text-white cursor-default'
                              : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                          }`}
                          disabled={selectedCandidate.status === 'shortlisted'}
                        >
                          <Check size={16} className="mr-1" />
                          {selectedCandidate.status === 'shortlisted' ? 'Shortlisted' : 'Shortlist'}
                        </button>
                        <button 
                          onClick={() => handleStatusChange(selectedCandidate.id, 'rejected')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                            selectedCandidate.status === 'rejected'
                              ? 'bg-red-600 text-white cursor-default'
                              : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
                          }`}
                          disabled={selectedCandidate.status === 'rejected'}
                        >
                          <X size={16} className="mr-1" />
                          {selectedCandidate.status === 'rejected' ? 'Rejected' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Skills */}
                    <div className="mb-6">
                      <h3 className={`text-lg font-medium mb-3 ${getThemeClasses.text}`}>Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Resume */}
                    <div className="mb-6">
                      <h3 className={`text-lg font-medium mb-3 ${getThemeClasses.text}`}>Resume</h3>
                      <div className={`p-4 border ${getThemeClasses.border} rounded-lg flex items-center`}>
                        <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2 mr-3">
                          <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${getThemeClasses.text}`}>{selectedCandidate.resumeName}</p>
                          <p className={`text-xs ${getThemeClasses.textMuted}`}>Uploaded on {selectedCandidate.interviewDate}</p>
                        </div>
                        <button className="px-3 py-1 rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-sm hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
                          View
                        </button>
                      </div>
                    </div>
                    
                    {/* Interview Answers */}
                    <div className="mb-6">
                      <h3 className={`text-lg font-medium mb-3 ${getThemeClasses.text}`}>Interview Answers</h3>
                      <div className="space-y-4">
                        {selectedCandidate.questions.map((qa, idx) => (
                          <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`border ${getThemeClasses.border} rounded-lg overflow-hidden`}
                          >
                            <div className={`p-3 border-b ${getThemeClasses.border} flex justify-between items-center bg-gray-50 dark:bg-gray-800`}>
                              <p className={`font-medium ${getThemeClasses.text}`}>
                                Q{idx + 1}: {qa.question}
                              </p>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                qa.score >= 90 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                  : qa.score >= 80
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                    : qa.score >= 70
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                Score: {qa.score}%
                              </div>
                            </div>
                            <div className="p-3">
                              <p className={`text-sm ${getThemeClasses.textSecondary}`}>{qa.answer}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* AI Summary */}
                    <div>
                      <h3 className={`text-lg font-medium mb-3 ${getThemeClasses.text}`}>AI-Generated Summary</h3>
                      <div className={`p-4 border ${getThemeClasses.border} rounded-lg bg-gray-50 dark:bg-gray-800/50`}>
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className={`text-sm ${getThemeClasses.textSecondary} mb-2`}>
                              {selectedCandidate.name} demonstrates {selectedCandidate.score >= 85 ? 'strong' : selectedCandidate.score >= 70 ? 'good' : 'adequate'} technical knowledge with a {selectedCandidate.sentiment.toLowerCase()} communication style. Their answers show {selectedCandidate.score >= 85 ? 'excellent' : selectedCandidate.score >= 70 ? 'solid' : 'basic'} understanding of core concepts.
                            </p>
                            <p className={`text-sm ${getThemeClasses.textSecondary} mb-2`}>
                              Their strongest areas include {selectedCandidate.skills.slice(0, 2).join(' and ')}, with opportunities for improvement in providing more detailed examples and specific use cases.
                            </p>
                            <p className={`text-sm ${getThemeClasses.textSecondary}`}>
                              Recommendation: {
                                selectedCandidate.score >= 85 
                                  ? 'Strong candidate, recommend advancing to next round.' 
                                  : selectedCandidate.score >= 75
                                    ? 'Potential candidate, consider technical follow-up interview.'
                                    : 'Consider other candidates with stronger technical skills.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className={`${getThemeClasses.card} rounded-lg shadow border ${getThemeClasses.border} p-8 h-full flex items-center justify-center`}>
                  <div className="text-center">
                    <Users className={`h-12 w-12 mx-auto ${getThemeClasses.textMuted} mb-4`} />
                    <h3 className={`text-lg font-medium mb-2 ${getThemeClasses.text}`}>
                      No Candidate Selected
                    </h3>
                    <p className={`${getThemeClasses.textMuted} max-w-md mx-auto`}>
                      Select a candidate from the list to view their details, interview answers, and AI-generated summary.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// MenuIcon component
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

export default AdminDashboard;
 