import React, { useState } from 'react';
import { FaCheckCircle, FaClock, FaPencilAlt } from 'react-icons/fa';

const EndSession = ({ onSave, onSkip }) => {
  const [completed, setCompleted] = useState(false);
  const [focus, setFocus] = useState(3);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    const reflection = {
      completed,
      focus,
      notes,
      date: new Date().toLocaleDateString()
    };
    onSave(reflection);
  };

  const handleSkipAndClose = () => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'dashboard' }));
    onSkip();
  };

  return (
    <div className="container-custom py-4 sm:py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            Session Reflection
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Help us improve your future recommendations
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg gap-3">
            <div className="flex items-center gap-3">
              <FaCheckCircle className={completed ? 'text-green-500' : 'text-slate-400'} />
              <span className="text-slate-700 dark:text-slate-300">Completed your goal?</span>
            </div>
            <button
              onClick={() => setCompleted(!completed)}
              className={`w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                completed 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
              }`}
            >
              {completed ? 'Yes' : 'No'}
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <FaClock className="text-indigo-500" />
              <span className="text-slate-700 dark:text-slate-300">How focused were you today?</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setFocus(num)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    focus === num
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              {focus === 1 ? 'Very distracted' : ''}
              {focus === 2 ? 'Somewhat distracted' : ''}
              {focus === 3 ? 'Moderately focused' : ''}
              {focus === 4 ? 'Highly focused' : ''}
              {focus === 5 ? 'Completely focused' : ''}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <FaPencilAlt className="text-indigo-500" /> Any notes? (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Mind maps worked well, felt productive..."
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              rows="3"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all text-base min-h-[52px] cursor-pointer"
            >
              Save Reflection
            </button>
            <button
              onClick={handleSkipAndClose}
              className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-base min-h-[52px] cursor-pointer"
            >
              Skip & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndSession;