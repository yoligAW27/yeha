// ─── src/utils/historyUtils.js ──────────────────────────────────────
// ONLY helper functions for formatting/displaying history data
// All data operations go through dataSync.js

import { getProfile } from './dataSync';

export const getUserName = (email) => {
  if (!email) return 'Student';
  const profile = getProfile(email);
  if (profile?.name) return profile.name;
  return email.split('@')[0];
};

// ⭐ Format date for display (reliable)
export const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown date';
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return 'Unknown date';
  }
};

// ⭐ Helper to check if history has any entries
export const hasHistory = (history) => {
  return history && history.length > 0;
};

// ⭐ Get the latest assessment from history
export const getLatestAssessment = (history) => {
  if (!history || history.length === 0) return null;
  return history.find(item => item.type === 'assessment');
};

// ⭐ Get the latest session from history
export const getLatestSession = (history) => {
  if (!history || history.length === 0) return null;
  return history.find(item => item.type === 'session');
};