import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import StudySession from './components/StudySession';
import EndSession from './components/EndSession';
import NewRequest from './components/NewRequest';
import History from './components/History';
import { mockData } from './data/mockData';
import { getCurrentUser, getUserData, getProfile, notifyDataUpdated } from './utils/dataSync';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showStudySession, setShowStudySession] = useState(false);
  const [showEndSession, setShowEndSession] = useState(false);
  const [profileKey, setProfileKey] = useState(0);

  // ─── Load User Data ──────────────────────────────────────────────────
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      setDarkMode(false);
    }

    const activeSession = getCurrentUser();
    if (activeSession) {
      const email = activeSession.email;
      setUserEmail(email);
      
      const userData = getUserData(email);
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('activeSession');
      }
    }
  }, []);

  // ─── Dark Mode ──────────────────────────────────────────────────────
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // ─── Navigation Listener ──────────────────────────────────────────
  useEffect(() => {
    const handleNavigate = (event) => {
      setCurrentPage(event.detail);
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  // ───  GLOBAL DATA UPDATE LISTENER ──────────────────────────────────
  useEffect(() => {
    const handleDataUpdate = () => {
      console.log(" App: Data update event received");
      setProfileKey(prev => prev + 1);
    };
    window.addEventListener('yeha-data-updated', handleDataUpdate);
    return () => window.removeEventListener('yeha-data-updated', handleDataUpdate);
  }, []);

  const handleLogin = (userData) => {
  setUser(userData);
  setUserEmail(userData.email);
  setIsLoggedIn(true);
  setCurrentPage('dashboard');
  
  
  localStorage.setItem('activeSession', JSON.stringify({
    email: userData.email,
    timestamp: Date.now()
  }));
  
  setProfileKey(prev => prev + 1);
};

  const handleLogout = () => {
    localStorage.removeItem('activeSession');
    localStorage.removeItem('savedEmail');
    setIsLoggedIn(false);
    setUser(null);
    setUserEmail('');
    setCurrentPage('home');
    setShowStudySession(false);
    setShowEndSession(false);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleStartStudySession = () => {
    setShowStudySession(true);
    setCurrentPage('study-session');
  };

  const handleEndStudySession = () => {
    setShowStudySession(false);
    setShowEndSession(true);
  };

  const handleSaveReflection = () => {
    setShowEndSession(false);
    setCurrentPage('dashboard');
    setProfileKey(prev => prev + 1);
    notifyDataUpdated();
  };

  const handleSkipReflection = () => {
    setShowEndSession(false);
    setCurrentPage('dashboard');
  };

  const handleCloseStudySession = () => {
    setShowStudySession(false);
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        {currentPage === 'login' ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Home onGetStarted={() => setCurrentPage('login')} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {!showStudySession && !showEndSession && (
        <>
          {currentPage === 'dashboard' && (
            <Dashboard setCurrentPage={setCurrentPage} />
          )}
          {currentPage === 'profile' && (
            <Profile onStartSession={handleStartStudySession} refreshKey={profileKey} />
          )}
          {currentPage === 'new-request' && (
            <NewRequest subjects={mockData.subjects} />
          )}
          {currentPage === 'history' && <History />}
        </>
      )}

      {showStudySession && (
        <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-slate-900 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="container-custom flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-serif">የሐ</span>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100">Study Session</span>
              </div>
              <button onClick={handleCloseStudySession} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">✕ Close</button>
            </div>
          </div>
          <StudySession onEndSession={handleEndStudySession} />
        </div>
      )}

      {showEndSession && (
        <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-slate-900 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="container-custom flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-serif">የሐ</span>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100">Session Reflection</span>
              </div>
              <button onClick={handleSkipReflection} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">✕ Skip</button>
            </div>
          </div>
          <EndSession onSave={handleSaveReflection} onSkip={handleSkipReflection} />
        </div>
      )}
    </div>
  );
}

export default App;