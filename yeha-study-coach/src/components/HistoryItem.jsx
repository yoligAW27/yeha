import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaBook, FaClock, FaLightbulb, FaStar, FaCalendar } from 'react-icons/fa';

const HistoryItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'assessment': return <FaBook className="text-indigo-500" />;
      case 'session': return <FaClock className="text-green-500" />;
      case 'recommendation': return <FaLightbulb className="text-yellow-500" />;
      default: return <FaStar className="text-purple-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'assessment': return 'Assessment';
      case 'session': return 'Study Session';
      case 'recommendation': return 'Recommendation';
      default: return 'Activity';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all overflow-hidden">
      {/* Summary View */}
      <div 
        className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {getTypeIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {item.subject || 'Unknown Subject'}
                </h4>
                <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                  {getTypeLabel(item.type)}
                </span>
                {item.improvement !== undefined && item.improvement !== null && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.improvement > 0 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : item.improvement < 0
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {item.improvement > 0 ? `+${item.improvement}%` : item.improvement === 0 ? '0%' : `${item.improvement}%`}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <FaCalendar size={10} />
                  {item.date || 'Unknown date'}
                </span>
                {item.method && (
                  <span className="flex items-center gap-1">
                    <FaLightbulb size={10} />
                    {item.method.replace(/-/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            {expanded ? (
              <FaChevronUp className="text-slate-400" />
            ) : (
              <FaChevronDown className="text-slate-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="space-y-3">
            {/* Grade Info */}
            {item.currentGrade !== undefined && item.predictedGrade !== undefined && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-slate-700 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Current Grade</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{item.currentGrade}%</p>
                </div>
                <div className="bg-white dark:bg-slate-700 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Predicted Grade</p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{item.predictedGrade}%</p>
                </div>
              </div>
            )}

            {/* Study Details */}
            <div className="grid grid-cols-2 gap-3">
              {item.studyHours && (
                <div className="bg-white dark:bg-slate-700 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Study Hours</p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{item.studyHours}h/week</p>
                </div>
              )}
              {item.method && (
                <div className="bg-white dark:bg-slate-700 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Method</p>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{item.method.replace(/-/g, ' ')}</p>
                </div>
              )}
            </div>

            {/* Learning Styles */}
            {item.learningStyles && item.learningStyles.length > 0 && (
              <div className="bg-white dark:bg-slate-700 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Learning Styles</p>
                <div className="flex flex-wrap gap-1">
                  {item.learningStyles.map((style, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges */}
            {item.challenges && item.challenges.length > 0 && (
              <div className="bg-white dark:bg-slate-700 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Challenges</p>
                <div className="flex flex-wrap gap-1">
                  {item.challenges.map((challenge, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs">
                      {challenge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Goals */}
            {item.goals && item.goals.length > 0 && (
              <div className="bg-white dark:bg-slate-700 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Goals</p>
                <div className="flex flex-wrap gap-1">
                  {item.goals.map((goal, i) => (
                    <span key={i} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            {item.recommendation && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Recommendation</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{item.recommendation}</p>
              </div>
            )}

            {/* Notes */}
            {item.notes && (
              <div className="bg-white dark:bg-slate-700 p-3 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Notes</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{item.notes}</p>
              </div>
            )}

            {/* Timestamp */}
            <div className="text-xs text-slate-400 dark:text-slate-500 text-right">
              {item.timestamp ? new Date(item.timestamp).toLocaleString() : item.date}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryItem;