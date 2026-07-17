import React, { useState, useEffect } from 'react';
import { 
  FaBook, FaClock, FaFire, FaBrain, FaPlus, FaArrowRight, 
  FaHistory, FaUser, FaLightbulb, FaStar, FaRocket
} from 'react-icons/fa';
import { 
  getCurrentUser, 
  getHistory, 
  getProfile, 
  calculateStats,
  subscribeToUpdates 
} from '../utils/dataSync';
import { getUserName } from '../utils/historyUtils';

const Dashboard = ({ setCurrentPage }) => {
  const [userName, setUserName] = useState('Student');
  const [greeting, setGreeting] = useState('Good Morning');
  const [greetingEmoji, setGreetingEmoji] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [stats, setStats] = useState({
    totalAssessments: 0,
    totalSessions: 0,
    studyStreak: 0,
    mostStudied: 'N/A',
    lastActivity: 'No activity yet'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [profile, setProfile] = useState(null);
  const [todayRecommendation, setTodayRecommendation] = useState(null);
  const [todayInsight, setTodayInsight] = useState(null);
  const [nextStep, setNextStep] = useState(null);
  const [loading, setLoading] = useState(true);

  const motivationalQuotes = [
    "Ready to continue your learning journey?",
    "Let's make today's study session count.",
    "Every study session brings you closer to your goals.",
    "Today is a great day to learn something new.",
    "Your future self will thank you for studying today.",
    "Small steps lead to big achievements.",
    "Consistency is the key to mastery."
  ];

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning' };
    if (hour < 17) return { text: 'Good Afternoon' };
    return { text: 'Good Evening'};
  };

  const getRandomQuote = () => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  };

  const loadData = () => {
    console.log(" Dashboard: Loading data from History...");
    setLoading(true);

    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const email = user.email;
    console.log(" Dashboard: User email:", email);

    // ── Greeting ──
    const greetingData = getTimeBasedGreeting();
    setGreeting(greetingData.text);
    setGreetingEmoji(greetingData.emoji);
    setMotivationalQuote(getRandomQuote());

    // ── User Name ──
    const name = getUserName(email);
    setUserName(name);

    // ── Profile ──
    const profileData = getProfile(email);
    if (profileData) {
      setProfile(profileData);
    }

    
    const history = getHistory(email);
    console.log(" Dashboard: History entries:", history.length);

  
    const statsData = calculateStats(history);
    setStats({
      totalAssessments: statsData.totalAssessments || 0,
      totalSessions: statsData.totalSessions || 0,
      studyStreak: statsData.studyStreak || 0,
      mostStudied: statsData.mostStudiedSubject || 'N/A',
      lastActivity: statsData.lastActivity || 'No activity yet'
    });

    
    setRecentActivity(history.slice(0, 5));

   
    if (profileData && history.length > 0) {
      const lastAssessment = history.find(item => item.type === 'assessment');
      if (lastAssessment) {
        setTodayRecommendation({
          subject: lastAssessment.subject || 'Your subject',
          method: lastAssessment.recommendedMethodLabel || lastAssessment.method || 'Active Recall',
          estimatedTime: Math.round((lastAssessment.studyHours || 2) * 0.75),
          reason: profileData.learningStyles?.includes('practice') 
            ? 'You learn best through active problem solving.'
            : profileData.learningStyles?.includes('visual')
            ? 'Visual learning works well for you.'
            : profileData.learningStyles?.includes('reading')
            ? 'Reading and writing are your strengths.'
            : 'This method matches your learning profile.'
        });
      } else {
        setTodayRecommendation(null);
      }
    } else {
      setTodayRecommendation(null);
    }

    
    if (profileData && history.length > 0) {
      const insights = [];
      if (profileData.learningStyles?.includes('practice')) insights.push("You retain information better when testing yourself.");
      if (profileData.learningStyles?.includes('visual')) insights.push("Visual aids help you understand complex topics.");
      if (profileData.learningStyles?.includes('reading')) insights.push("Reading and writing strengthen your learning.");
      if (profileData.challenges?.includes('focus')) insights.push("Try breaking study sessions into smaller chunks for better focus.");
      if (profileData.challenges?.includes('retention')) insights.push("Spaced repetition could help you retain more information.");
      if (insights.length === 0) insights.push("Keep exploring different study methods to find what works best for you.");
      setTodayInsight(insights[Math.floor(Math.random() * insights.length)]);
    } else {
      setTodayInsight(null);
    }

    
    const sessions = history.filter(item => item.type === 'session');
    if (history.length === 0) {
      setNextStep({ action: 'assessment', label: 'Complete your assessment', description: 'Start your learning journey' });
    } else if (sessions.length === 0) {
      setNextStep({ action: 'session', label: 'Start your first study session', description: 'Apply what you\'ve learned' });
    } else {
      const mostRecent = history[0];
      setNextStep({ 
        action: 'continue', 
        label: `Continue studying ${mostRecent.subject || 'your subject'}`,
        description: 'Keep building on your progress'
      });
    }

    setLoading(false);
  };

  
  useEffect(() => {
    loadData();
  }, []);

  
  useEffect(() => {
    const unsubscribe = subscribeToUpdates(loadData);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const greetingData = getTimeBasedGreeting();
      setGreeting(greetingData.text);
      setGreetingEmoji(greetingData.emoji);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNextStep = () => {
    if (!nextStep) return;
    switch(nextStep.action) {
      case 'assessment': setCurrentPage('new-request'); break;
      case 'session': setCurrentPage('study-session'); break;
      case 'continue': setCurrentPage('study-session'); break;
      default: setCurrentPage('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* ─── Dynamic Greeting ─── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {greeting}, <span className="text-indigo-600 dark:text-indigo-400">{userName}</span> {greetingEmoji}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">
          {motivationalQuote}
        </p>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <FaBook className="text-indigo-600 dark:text-indigo-400 text-xl mb-1" />
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalAssessments}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Assessments</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <FaClock className="text-green-600 dark:text-green-400 text-xl mb-1" />
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalSessions}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Study Sessions</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <FaFire className="text-orange-500 text-xl mb-1" />
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.studyStreak}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Day Streak</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <FaBook className="text-purple-600 dark:text-purple-400 text-xl mb-1" />
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 truncate">{stats.mostStudied}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Most Studied</p>
        </div>
      </div>

      {/* ─── Stats Summary ─── */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Last Activity</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{stats.lastActivity}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Most Studied</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{stats.mostStudied}</p>
          </div>
        </div>
      </div>

      {/* ─── Today's Recommendation ─── */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
          <FaStar className="text-yellow-500" /> Today's Recommendation
        </h3>
        {todayRecommendation ? (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-5 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Subject</p>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{todayRecommendation.subject}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Recommended Method</p>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400">{todayRecommendation.method}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Estimated Time</p>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{todayRecommendation.estimatedTime} Minutes</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Why this method?</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{todayRecommendation.reason}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-500 dark:text-slate-400">Complete your assessment to unlock personalized recommendations.</p>
            <button 
              onClick={() => setCurrentPage('new-request')}
              className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all"
            >
              Start Assessment
            </button>
          </div>
        )}
      </div>

      {/* ─── Today's Insight ─── */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
          <FaLightbulb className="text-yellow-500" /> Today's Insight
        </h3>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <p className="text-slate-700 dark:text-slate-300">
            {todayInsight || "We'll generate personalized insights after your first assessment."}
          </p>
        </div>
      </div>

      {/* ─── Next Step ─── */}
      {nextStep && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
            <FaRocket className="text-indigo-500" /> Your Next Step
          </h3>
          <button 
            onClick={handleNextStep}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all text-left flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold text-lg">{nextStep.label}</p>
              <p className="text-white/80 text-sm">{nextStep.description}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-all">
              <FaArrowRight className="text-white" />
            </div>
          </button>
        </div>
      )}

      {/* ─── Quick Actions ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button onClick={() => setCurrentPage('study-session')} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-center">
          <FaBrain className="text-xl mx-auto mb-1" />
          <p className="text-sm font-medium">Study Session</p>
        </button>
        <button onClick={() => setCurrentPage('new-request')} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all text-center">
          <FaPlus className="text-indigo-600 dark:text-indigo-400 text-xl mx-auto mb-1" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">New Assessment</p>
        </button>
        <button onClick={() => setCurrentPage('history')} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all text-center">
          <FaHistory className="text-purple-600 dark:text-purple-400 text-xl mx-auto mb-1" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">View History</p>
        </button>
        <button onClick={() => setCurrentPage('profile')} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all text-center">
          <FaUser className="text-green-600 dark:text-green-400 text-xl mx-auto mb-1" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Learning Profile</p>
        </button>
      </div>

      {/* ─── Recent Activity ─── */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Activity</h3>
          <button onClick={() => setCurrentPage('history')} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-1">
            View All <FaArrowRight size={12} />
          </button>
        </div>
        
        {recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4 text-slate-300 dark:text-slate-600">
              <FaBook className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Welcome to Yeha!</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
              Complete your first assessment to discover how you learn best and begin building your personalized study journey.
            </p>
            <button onClick={() => setCurrentPage('new-request')} className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all">
              Start Assessment
            </button>
          </div>
        ) : (
          recentActivity.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 dark:text-slate-100 truncate">
                  {item.subject || 'Unknown Subject'}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="capitalize">{item.type || 'Activity'}</span>
                  {item.method && (
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                      {item.method}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                <p className="text-xs text-slate-400">{item.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;