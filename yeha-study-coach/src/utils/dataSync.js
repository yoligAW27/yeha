
export const getCurrentUser = () => {
  const activeSession = localStorage.getItem('activeSession');
  if (!activeSession) return null;
  try {
    return JSON.parse(activeSession);
  } catch {
    return null;
  }
};

export const getUserData = (email) => {
  if (!email) return null;
  const key = `user_${email}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const saveUserData = (email, data) => {
  if (!email) return;
  const key = `user_${email}`;
  localStorage.setItem(key, JSON.stringify(data));
};


export const getHistory = (email) => {
  if (!email) return [];
  const key = `history_${email}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveHistory = (email, history) => {
  if (!email) return;
  const key = `history_${email}`;
  localStorage.setItem(key, JSON.stringify(history));
};


export const addHistoryEntry = (email, entry) => {
  if (!email) {
    console.warn("addHistoryEntry: No email provided");
    return [];
  }
  const history = getHistory(email);
  const newEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    ...entry,
    timestamp: new Date().toISOString(), 
    date: new Date().toISOString()       
  };
  const updated = [newEntry, ...history];
  saveHistory(email, updated);
  console.log(" History entry added for:", email, "Total:", updated.length);
  return updated;
};


export const getProfile = (email) => {
  if (!email) return null;
  const key = `profile_${email}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const saveProfile = (email, profile) => {
  if (!email) return;
  const key = `profile_${email}`;
  localStorage.setItem(key, JSON.stringify(profile));
};


export const calculateStats = (history) => {
  if (!history || history.length === 0) {
    return {
      totalAssessments: 0,
      totalSessions: 0,
      studyStreak: 0,
      mostStudiedSubject: 'N/A',
      lastActivity: 'No activity yet'
    };
  }

  const assessments = history.filter(item => item.type === 'assessment');
  const sessions = history.filter(item => item.type === 'session');

  
  const subjectCount = {};
  history.forEach(item => {
    if (item.subject) {
      subjectCount[item.subject] = (subjectCount[item.subject] || 0) + 1;
    }
  });
  let mostStudied = 'N/A';
  let maxCount = 0;
  Object.keys(subjectCount).forEach(key => {
    if (subjectCount[key] > maxCount) {
      maxCount = subjectCount[key];
      mostStudied = key;
    }
  });

  // Streak
  let streak = 0;
  if (history.length > 0) {
    const dates = history.map(item => {
      if (!item.timestamp && !item.date) return null;
      const dateStr = item.timestamp || item.date;
      const d = new Date(dateStr);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }).filter(d => d !== null);
    
    const uniqueDates = [...new Set(dates.map(d => d.getTime()))].map(t => new Date(t));
    uniqueDates.sort((a, b) => b - a);
    
    if (uniqueDates.length > 0) {
      streak = 1;
      let currentDate = uniqueDates[0];
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        if (uniqueDates[i].getTime() === prevDate.getTime()) {
          streak++;
          currentDate = uniqueDates[i];
        } else {
          break;
        }
      }
    }
  }

  // Format last activity for display
  let lastActivity = 'No activity yet';
  if (history.length > 0) {
    const last = history[0];
    const dateStr = last.timestamp || last.date;
    if (dateStr) {
      try {
        lastActivity = new Date(dateStr).toLocaleDateString();
      } catch {
        lastActivity = 'No activity yet';
      }
    }
  }

  return {
    totalAssessments: assessments.length,
    totalSessions: sessions.length,
    studyStreak: streak,
    mostStudiedSubject: mostStudied,
    lastActivity: lastActivity
  };
};


export const notifyDataUpdated = () => {
  console.log("📡 yeha-data-updated event dispatched");
  try {
    window.dispatchEvent(new CustomEvent('yeha-data-updated'));
  } catch (e) {
    console.error("Failed to dispatch event:", e);
  }
};

export const subscribeToUpdates = (callback) => {
  const handler = () => {
    console.log("📡 Data update received, reloading...");
    callback();
  };
  window.addEventListener('yeha-data-updated', handler);
  return () => window.removeEventListener('yeha-data-updated', handler);
};

export const getStudyStats = calculateStats;

export const getUserName = (email) => {
  if (!email) return 'Student';
  const profile = getProfile(email);
  if (profile?.name) return profile.name;
  return email.split('@')[0]; // fallback
};



