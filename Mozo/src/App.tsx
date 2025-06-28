import  { useState } from 'react';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import ResumeUploadPage from './components/ResumeUploadPage';
import InterviewInterface from './components/InterviewInterface';
import InterviewSummary from './components/InterviewSummary';
import AdminDashboard from './components/AdminDashboard';
import CandidateLeaderboard from './components/CandidateLeaderboard';
import LiveAdminControl from './components/LiveAdminControl';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ name: '', isAdmin: false });
  const [currentView, setCurrentView] = useState<'home' | 'resume' | 'interview' | 'summary' | 'admin' | 'leaderboard' | 'livecontrol'>('home');
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const handleLogin = (userData: { name: string; email: string; password?: string }) => {
    // Mock admin login check
    const isAdmin = userData.email.includes('admin');
    setUser({ 
      name: userData.name || userData.email.split('@')[0],
      isAdmin
    });
    setIsAuthenticated(true);
    
    // Navigate admin to admin dashboard automatically
    if (isAdmin) {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ name: '', isAdmin: false });
    setCurrentView('home');
    setResumeUploaded(false);
  };

  const handleStartInterview = () => {
    if (resumeUploaded) {
      setCurrentView('interview');
    } else {
      setCurrentView('resume');
    }
  };

  const handleProceedFromResume = () => {
    setResumeUploaded(true);
    setCurrentView('interview');
  };

  const handleFinishInterview = () => {
    setCurrentView('summary');
  };

  const handleFinishSummary = () => {
    setCurrentView('home');
  };

  const handleNavigation = (view: 'admin' | 'livecontrol' | 'leaderboard') => {
    setCurrentView(view);
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Admin views
  if (user.isAdmin) {
    switch (currentView) {
      case 'livecontrol':
        return <LiveAdminControl onLogout={handleLogout} onNavigate={handleNavigation} />;
      case 'leaderboard':
        return <CandidateLeaderboard onLogout={handleLogout} />;
      case 'admin':
      default:
        return <AdminDashboard onLogout={handleLogout} onNavigate={handleNavigation} />;
    }
  }

  // User views
  switch (currentView) {
    case 'resume':
      return <ResumeUploadPage onProceed={handleProceedFromResume} onLogout={handleLogout} />;
    case 'interview':
      return <InterviewInterface onFinish={handleFinishInterview} onLogout={handleLogout} />;
    case 'summary':
      return <InterviewSummary onFinish={handleFinishSummary} onLogout={handleLogout} />;
    case 'leaderboard':
      return <CandidateLeaderboard onLogout={handleLogout} />;
    case 'home':
    default:
      return (
        <HomePage 
          user={user} 
          onLogout={handleLogout} 
          onStartInterview={handleStartInterview}
          resumeUploaded={resumeUploaded}
        />
      );
  }
}

export default App;
 