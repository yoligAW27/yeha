import React, { useState, useEffect } from 'react';
import { 
  FaBrain, FaLightbulb, FaExclamationTriangle, FaCheckCircle, 
  FaBullseye, FaBookOpen, FaUser, FaEnvelope, FaCalendar,
  FaEdit, FaSave, FaTimes, FaKey, FaUserCircle,
  FaBook, FaClock, FaChartLine, FaHistory, FaRedo,
  FaFire  
} from 'react-icons/fa';
import { 
  getCurrentUser, 
  getUserData, 
  getHistory, 
  getProfile, 
  calculateStats,  
  subscribeToUpdates,
  saveUserData,
  saveProfile,
  notifyDataUpdated
} from '../utils/dataSync';

const Profile = ({ onStartSession }) => {
  const [profile, setProfile] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    totalAssessments: 0,
    totalSessions: 0,
    lastAssessment: 'Never',
    lastLogin: 'Today',
    studyStreak: 0,
    mostStudied: 'N/A'
  });
  const [recentActivity, setRecentActivity] = useState([]);

const loadProfile = () => {
  console.log(" Profile: Loading from History...");
  setLoading(true);

  const user = getCurrentUser();
  if (!user) {
    setProfile(null);
    setLoading(false);
    return;
  }

  const email = user.email;
  setUserEmail(email);

  
  const userData = getUserData(email);
  if (userData) {
    setUserName(userData.name || 'Student');
    setEditName(userData.name || 'Student');
    setEditEmail(userData.email || email);
    setJoinDate(userData.joinDate || new Date().toLocaleDateString());
  } else {
    const newUserData = {
      name: email.split('@')[0] || 'Student',
      email: email,
      joinDate: new Date().toLocaleDateString()
    };
    saveUserData(email, newUserData);
    setUserName(newUserData.name);
    setEditName(newUserData.name);
    setEditEmail(email);
    setJoinDate(newUserData.joinDate);
  }

  const profileData = getProfile(email);
  if (profileData) {
    setProfile(profileData);
    console.log(" Profile loaded");
  } else {
    setProfile(null);
  }

  
  const history = getHistory(email);
  console.log("👤 Profile: History entries:", history.length);

  
  const statsData = calculateStats(history);  
  
  const assessments = history.filter(item => item.type === 'assessment');
  const sessions = history.filter(item => item.type === 'session');
  
  setStats({
    totalAssessments: assessments.length,
    totalSessions: sessions.length,
    lastAssessment: history.length > 0 ? history[0].date : 'Never',
    lastLogin: new Date().toLocaleDateString(),
    studyStreak: statsData.studyStreak || 0,
    mostStudied: statsData.mostStudiedSubject || 'N/A'
  });

  setRecentActivity(history.slice(0, 5));

  setLoading(false);
};

  useEffect(() => {
    loadProfile();
  }, []);

 
  useEffect(() => {
    const unsubscribe = subscribeToUpdates(loadProfile);
    return unsubscribe;
  }, []);


  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
    if (!isEditing) {
      setEditName(userName);
      setEditEmail(userEmail);
      setEditPassword('');
      setEditConfirmPassword('');
    }
  };

const handleSaveProfile = () => {


  try {
    const oldEmail = user.email;
    const userData = getUserData(oldEmail) || {};
    userData.name = editName;
    userData.email = editEmail;
    userData.joinDate = userData.joinDate || new Date().toISOString();
    saveUserData(oldEmail, userData);

    if (editPassword) {
      localStorage.setItem(`pass_${oldEmail}`, editPassword);
    }

    if (editEmail !== oldEmail) {
      localStorage.setItem('activeSession', JSON.stringify({
        email: editEmail,
        timestamp: Date.now()
      }));
    }

    setUserName(editName);
    setSuccess('Profile updated successfully!');
    setIsEditing(false);
    notifyDataUpdated();  

  } catch (e) {
    setError('Error saving profile: ' + e.message);
  }
};

  const handleRetakeAssessment = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'new-request' }));
  };

  if (loading) {
    return (
      <div className="container-custom py-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-custom py-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4 text-slate-300 dark:text-slate-600">
            <FaBrain className="mx-auto" size={64} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            No Study Profile Yet
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Complete the assessment to build your personalized study profile.
          </p>
          <button
            onClick={handleRetakeAssessment}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all cursor-pointer"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* ─── Header ─── */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Your Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal information and learning profile
          </p>
        </div>
        <button
          onClick={handleEditToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isEditing
              ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400'
          }`}
        >
          {isEditing ? <FaTimes /> : <FaEdit />}
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
          {success}
        </div>
      )}

      {/* ─── Personal Information ─── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <FaUser className="text-indigo-600 dark:text-indigo-400" />
          Personal Information
        </h2>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your@email.com"
              />
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <FaKey className="text-yellow-500" />
                Change Password (optional)
              </h4>
              <div className="space-y-3">
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="New password (min 6 characters)"
                />
                <input
                  type="password"
                  value={editConfirmPassword}
                  onChange={(e) => setEditConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveProfile}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                <FaSave /> Save Changes
              </button>
              <button
                onClick={handleEditToggle}
                className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <FaUserCircle className="text-2xl text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Full Name</p>
                <p className="font-medium text-slate-800 dark:text-slate-100">{userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <FaEnvelope className="text-xl text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Email Address</p>
                <p className="font-medium text-slate-800 dark:text-slate-100">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <FaCalendar className="text-xl text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Joined</p>
                <p className="font-medium text-slate-800 dark:text-slate-100">{joinDate || 'Today'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── ⭐ Account Statistics (CALCULATED FROM HISTORY) ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
          <FaBook className="text-indigo-600 dark:text-indigo-400 mx-auto text-xl mb-1" />
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalAssessments}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Assessments</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
          <FaClock className="text-green-600 dark:text-green-400 mx-auto text-xl mb-1" />
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalSessions}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Study Sessions</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
          <FaFire className="text-orange-500 mx-auto text-xl mb-1" />
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.studyStreak}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Day Streak</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
          <FaHistory className="text-purple-600 dark:text-purple-400 mx-auto text-xl mb-1" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{stats.lastAssessment}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Last Assessment</p>
        </div>
      </div>

      {/* ─── ⭐ Recent Activity ─── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No activity yet. Complete your first assessment!</p>
        ) : (
          recentActivity.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg mb-2">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">{item.subject || 'Unknown'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{item.type || 'Activity'}</p>
              </div>
              <p className="text-xs text-slate-400">{item.date}</p>
            </div>
          ))
        )}
      </div>

      {/* ─── Learning Profile ─── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <FaBrain className="text-indigo-600 dark:text-indigo-400" />
          Your Learning Profile
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
              <FaBrain className="text-indigo-500" /> Learning Style
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.learningStyles && profile.learningStyles.length > 0 ? (
                profile.learningStyles.map((style, i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                    {style.replace('-', ' ')}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-sm">Not specified</span>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
              <FaExclamationTriangle className="text-red-500" /> Main Challenge
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.challenges && profile.challenges.length > 0 ? (
                profile.challenges.map((challenge, i) => (
                  <span key={i} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm">
                    {challenge}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-sm">Not specified</span>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
              <FaBullseye className="text-purple-500" /> Primary Goal
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.goals && profile.goals.length > 0 ? (
                profile.goals.map((goal, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                    {goal.replace('-', ' ')}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 text-sm">Not specified</span>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-1">
              <FaCheckCircle className="text-green-500" /> Recommended Method
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
              {profile.recommendedMethodLabel || profile.recommendedMethod || 'Not specified'}
            </span>
          </div>
        </div>

        {profile.recommendations && profile.recommendations.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-start gap-3">
              <FaLightbulb className="text-yellow-500 text-xl mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Personalized Tip</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {profile.recommendations[0]?.title || "Complete the assessment to get personalized tips!"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRetakeAssessment}
            className="flex items-center gap-2 px-6 py-3 border-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-400 dark:hover:text-slate-900 transition-all"
          >
            <FaRedo /> Retake Assessment
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
          Your study history will be preserved. Only your learning profile will be updated.
        </p>
      </div>

      {/* ─── Start Study Session ─── */}
      <div className="text-center">
        <button
          onClick={onStartSession}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
        >
          <FaBookOpen /> Start Study Session
        </button>
      </div>
    </div>
  );
};

export default Profile;