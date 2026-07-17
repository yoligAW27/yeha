import React, { useState, useEffect } from 'react';
import { FaBrain, FaLightbulb, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { getCurrentUser, getProfile, getHistory, addHistoryEntry, notifyDataUpdated } from '../utils/dataSync';

const StudySession = ({ onEndSession }) => {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState('');
  const [goal, setGoal] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [saved, setSaved] = useState(false);

  const loadProfile = () => {
    console.log(" StudySession: Loading...");

    const user = getCurrentUser();
    if (!user) {
      console.log(" No active session found");
      setProfile(null);
      return;
    }

    const email = user.email;
    setUserEmail(email);
    console.log(" StudySession: email =", email);

    const profileData = getProfile(email);
    if (profileData) {
      setProfile(profileData);
      console.log(" StudySession loaded profile");
    } else {
      console.log(" No profile found");
      setProfile(null);
    }

   
    const history = getHistory(email);
    const lastAssessment = history.find(item => item.type === 'assessment');
    if (lastAssessment && lastAssessment.subject) {
      setSubject(lastAssessment.subject);
      console.log(" Latest subject from history:", lastAssessment.subject);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const generateRecommendation = () => {
    if (!subject.trim()) return;
    setLoading(true);

    setTimeout(() => {
      let tip = '';
      let method = '';

      if (!profile || Object.keys(profile).length === 0) {
        tip = `Try the "Active Recall" method for ${subject}. After reading a section, close the book and write down everything you remember. Then check what you missed. This strengthens memory and understanding.`;
        method = "Active Recall";
      } else if (profile.challenges && profile.challenges.includes('focus')) {
        tip = `You mentioned that maintaining focus is difficult. Try studying for 25 minutes, then take a 5-minute break. Use the Pomodoro Technique to stay on track for ${subject}.`;
        method = "Pomodoro Technique";
      } else if (profile.challenges && profile.challenges.includes('retention')) {
        tip = `You struggle with remembering what you study. Use spaced repetition for ${subject}: review your notes after 1 day, 3 days, and 1 week.`;
        method = "Spaced Repetition";
      } else if (profile.challenges && profile.challenges.includes('understanding')) {
        tip = `Complex topics like ${subject} feel overwhelming. Use the Feynman Technique: explain the concept as if teaching someone else.`;
        method = "Feynman Technique";
      } else if (profile.learningStyles && profile.learningStyles.includes('visual')) {
        tip = `Since you're a visual learner, use mind maps, diagrams, and color-coded notes to organize ${subject} information.`;
        method = "Mind Maps & Visuals";
      } else if (profile.learningStyles && profile.learningStyles.includes('practice')) {
        tip = `You learn best by doing. Practice problems, quizzes, and hands-on exercises will help you master ${subject}.`;
        method = "Active Practice";
      } else if (profile.learningStyles && profile.learningStyles.includes('reading')) {
        tip = `Take detailed notes, create outlines, and write summaries for ${subject} in your own words.`;
        method = "Active Reading";
      } else {
        tip = `Try the "Active Recall" method for ${subject}. After reading, close the book and write down everything you remember.`;
        method = "Active Recall";
      }

      setRecommendation({ tip, method, subject });
      setStep(2);
      setLoading(false);
    }, 500);
  };

  const handleStartStudying = () => {
    const session = {
      type: 'session',
      subject: subject || 'Study Session',
      goal: goal || 'Not specified',
      method: recommendation?.method || '',
      recommendation: recommendation?.tip || '',
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString()
    };
    setSessionData(session);
    setStep(3);
  };

const handleSaveSession = () => {
  if (sessionData && userEmail) {
    console.log(" Saving session for email:", userEmail);
    console.log(" Session data:", sessionData);
    
    addHistoryEntry(userEmail, sessionData);
    console.log(" Study session saved to history");
    

    notifyDataUpdated();
    setSaved(true);
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'dashboard' }));
    }, 1500);
  }
};

  const handleClose = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'dashboard' }));
  };

  if (step === 1) {
    return (
      <div className="container-custom py-4 sm:py-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-4xl mb-4 text-indigo-600 dark:text-indigo-400">
              <FaBrain className="mx-auto" size={48} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              What are you studying today?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2">
              {subject ? `Continuing with ${subject}` : "Tell us what you're working on"}
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Data Structures, Calculus, Biology..."
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              onKeyPress={(e) => e.key === 'Enter' && generateRecommendation()}
            />

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What's your goal for this session? (Optional)
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Understand recursion, Master derivatives..."
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              />
            </div>

            <button
              onClick={generateRecommendation}
              disabled={!subject.trim() || loading}
              className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-base min-h-[52px] ${
                subject.trim() && !loading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Generating...' : <>Get Study Guidance <FaArrowRight /></>}
            </button>

            <button
              onClick={handleClose}
              className="w-full py-3 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
            >
              ✕ Close session
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="container-custom py-4 sm:py-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4 text-yellow-500">
              <FaLightbulb className="mx-auto" size={48} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              Your Study Guide
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Based on your learning profile
            </p>
          </div>

          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              <span className="font-semibold">Subject:</span> {subject}
            </p>
            {goal && (
              <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">
                <span className="font-semibold">Goal:</span> {goal}
              </p>
            )}
            <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">
              <span className="font-semibold">Recommended Method:</span> {recommendation?.method || 'Not specified'}
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800 mb-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FaLightbulb className="text-yellow-500" /> Today's Recommendation
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm mt-2 leading-relaxed">
              {recommendation?.tip || 'No specific recommendation available.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStartStudying}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all text-base min-h-[52px] cursor-pointer"
            >
              I'll Start Studying
            </button>
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-base min-h-[52px] cursor-pointer"
            >
              Back
            </button>
          </div>

          <button
            onClick={handleClose}
            className="w-full mt-4 py-3 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
          >
            ✕ Close session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-4 sm:py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4 text-green-500">
            <FaCheckCircle className="mx-auto" size={48} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            Study Session Complete!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {saved ? 'Session saved successfully! Redirecting...' : 'Save this session to your history.'}
          </p>
        </div>

        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            <span className="font-semibold">Subject:</span> {sessionData?.subject || subject}
          </p>
          <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">
            <span className="font-semibold">Goal:</span> {sessionData?.goal || goal || 'Not specified'}
          </p>
          <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">
            <span className="font-semibold">Method:</span> {sessionData?.method || recommendation?.method || 'Not specified'}
          </p>
        </div>

        {!saved ? (
          <button
            onClick={handleSaveSession}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-base min-h-[52px] cursor-pointer"
          >
            <FaCheckCircle /> Save Session
          </button>
        ) : (
          <div className="text-center text-green-600 dark:text-green-400">
            <p> Session saved successfully!</p>
            <p className="text-sm text-slate-500 mt-2">Redirecting to dashboard...</p>
          </div>
        )}

        <button
          onClick={handleClose}
          className="w-full mt-4 py-3 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
        >
          ✕ Close without saving
        </button>
      </div>
    </div>
  );
};

export default StudySession;