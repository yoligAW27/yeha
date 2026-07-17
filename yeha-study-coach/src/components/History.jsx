import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaHistory as FaHistoryIcon } from 'react-icons/fa';
import HistoryStats from './HistoryStats';
import HistoryItem from './HistoryItem';
import { 
  getCurrentUser, 
  getHistory, 
  calculateStats,  
  subscribeToUpdates 
} from '../utils/dataSync';
import { getUserName } from '../utils/historyUtils';

const History = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTime, setFilterTime] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [userName, setUserName] = useState('Student');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const loadHistory = () => {
    console.log(" History: Loading data...");
    setLoading(true);

    const user = getCurrentUser();
    if (!user) {
      console.log(" History: No active session found");
      setHistory([]);
      setFilteredHistory([]);
      setStats(calculateStats([]));
      setLoading(false);
      return;
    }

    const email = user.email;
    setUserEmail(email);
    console.log(" History: Email:", email);

    const name = getUserName(email);
    setUserName(name);
    console.log(" History: User name:", name);

    const userHistory = getHistory(email);
    console.log(" History: Loaded", userHistory.length, "entries");

    setHistory(userHistory);
    setFilteredHistory(userHistory);
    setStats(calculateStats(userHistory));
    setLoading(false);
  };

  // ─── Load on mount ──────────────────────────────────────────────────
  useEffect(() => {
    loadHistory();
  }, []);

  // ─── Listen for storage changes ──────────────────────────────────
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('history_') || e.key === 'activeSession') {
        console.log(" History: Storage changed, reloading...");
        loadHistory();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ───  SUBSCRIBE TO GLOBAL UPDATES ────────────────────────────────
  useEffect(() => {
    const unsubscribe = subscribeToUpdates(loadHistory);
    return unsubscribe;
  }, []);

  // ─── Apply filters and sorting ──────────────────────────────────────
  useEffect(() => {
    let result = [...history];

    if (filterType !== 'all') {
      result = result.filter(item => item.type === filterType);
    }

    if (filterTime !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (filterTime === 'today') {
        result = result.filter(item => {
          const dateStr = item.timestamp || item.date;
          if (!dateStr) return false;
          try {
            const itemDate = new Date(dateStr);
            return new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()) >= today;
          } catch {
            return false;
          }
        });
      } else if (filterTime === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        result = result.filter(item => {
          const dateStr = item.timestamp || item.date;
          if (!dateStr) return false;
          try {
            const itemDate = new Date(dateStr);
            return itemDate >= weekAgo;
          } catch {
            return false;
          }
        });
      } else if (filterTime === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        result = result.filter(item => {
          const dateStr = item.timestamp || item.date;
          if (!dateStr) return false;
          try {
            const itemDate = new Date(dateStr);
            return itemDate >= monthAgo;
          } catch {
            return false;
          }
        });
      }
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(item => {
        return (
          (item.subject && item.subject.toLowerCase().includes(term)) ||
          (item.method && item.method.toLowerCase().includes(term)) ||
          (item.recommendation && item.recommendation.toLowerCase().includes(term)) ||
          (item.notes && item.notes.toLowerCase().includes(term)) ||
          (item.goal && item.goal.toLowerCase().includes(term))
        );
      });
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => {
        const dateA = a.timestamp || a.date || '';
        const dateB = b.timestamp || b.date || '';
        return dateB.localeCompare(dateA);
      });
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => {
        const dateA = a.timestamp || a.date || '';
        const dateB = b.timestamp || b.date || '';
        return dateA.localeCompare(dateB);
      });
    } else if (sortBy === 'subject') {
      result.sort((a, b) => (a.subject || '').localeCompare(b.subject || ''));
    }

    setFilteredHistory(result);
  }, [history, searchTerm, filterType, filterTime, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterTime('all');
    setSortBy('newest');
  };

  if (loading) {
    return (
      <div className="container-custom py-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Your Learning Journey
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {userName}, here's a complete record of your study history
        </p>
      </div>

      <HistoryStats stats={stats} />

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by subject, method, or keyword..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="assessment">Assessments</option>
            <option value="session">Study Sessions</option>
            <option value="recommendation">Recommendations</option>
          </select>

          <select
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="subject">By Subject</option>
          </select>

          {(searchTerm || filterType !== 'all' || filterTime !== 'all') && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex items-center gap-1"
            >
              <FaTimes size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {filteredHistory.length} of {history.length} entries
        </p>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-6xl mb-4 text-slate-300 dark:text-slate-600">
            <FaHistoryIcon className="mx-auto" size={64} />
          </div>
          <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            No History Found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            You haven't completed any study sessions yet. Start your first assessment to begin building your learning journey.
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'new-request' }))}
            className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-all"
          >
            Start Assessment
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item, index) => (
            <HistoryItem key={item.id || index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;