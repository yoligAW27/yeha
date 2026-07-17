import React, { useState } from 'react';
import { 
  FaMagic, FaBook, FaClock, FaChartLine, 
  FaCheckCircle, FaArrowRight, FaArrowLeft,
  FaCheck
} from 'react-icons/fa';
import { addHistoryEntry, saveProfile, notifyDataUpdated } from '../utils/dataSync';

const NewRequest = ({ subjects }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [formData, setFormData] = useState({
    subject: '',
    customSubject: '',
    currentGrade: '',
    studyHours: '',
    methods: [],
    learningStyles: [],
    preferredMethods: [],
    challenges: [],
    confidenceLevel: '',
    goals: [],
    motivations: []
  });

  const toggleSelection = (array, value, setter) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Subject Details</h3>
        <p className="text-slate-500 dark:text-slate-400">Tell us about the subject you're working on</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Subject
        </label>
        <select
          value={formData.subject}
          onChange={(e) => {
            const value = e.target.value;
            setFormData({ 
              ...formData, 
              subject: value,
              methods: []
            });
          }}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="" className="text-slate-600 dark:text-slate-300">Select a subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.name} className="text-slate-800 dark:text-slate-100">
              {s.name}
            </option>
          ))}
          <option value="Other" className="text-slate-800 dark:text-slate-100">Other (type your own)</option>
        </select>
      </div>

      {formData.subject === 'Other' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Enter your subject name
          </label>
          <input
            type="text"
            value={formData.customSubject}
            onChange={(e) => setFormData({ ...formData, customSubject: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Biology, History, Economics"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Current Grade (percentage)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={formData.currentGrade}
          onChange={(e) => setFormData({ ...formData, currentGrade: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., 72"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Study Hours Per Week
        </label>
        <input
          type="number"
          min="0"
          max="20"
          value={formData.studyHours}
          onChange={(e) => setFormData({ ...formData, studyHours: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g., 4"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Study Methods You Use for This Subject
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Choose all that apply to you</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'reading-notes', label: 'Reading Notes' },
            { value: 'practice-problems', label: 'Practice Problems' },
            { value: 'active-recall', label: 'Active Recall' },
            { value: 'spaced-repetition', label: 'Spaced Repetition' },
            { value: 'mind-maps', label: 'Mind Maps' },
            { value: 'flashcards', label: 'Flashcards' },
            { value: 'teaching-others', label: 'Teaching Others' },
            { value: 'videos', label: 'Watching Videos' }
          ].map((option) => {
            const isSelected = formData.methods.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleSelection(
                  formData.methods, 
                  option.value, 
                  (newVal) => setFormData({ ...formData, methods: newVal })
                )}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all min-h-[36px] sm:min-h-[40px] ${
                  isSelected
                    ? 'bg-indigo-600 text-white cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer'
                }`}
              >
                {option.label} {isSelected && <FaCheck className="inline ml-1" size={12} />}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Selected: {formData.methods.length} method(s)
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Learning Preferences</h3>
        <p className="text-slate-500 dark:text-slate-400">Understanding how you learn best helps us give better recommendations</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Your Learning Styles
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Choose all that describe how you learn</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'reading', label: 'Reading & Notes', desc: 'Learning through reading and writing' },
            { value: 'visual', label: 'Videos & Visuals', desc: 'Learning through watching and seeing' },
            { value: 'practice', label: 'Practice Problems', desc: 'Learning through doing and solving' },
            { value: 'collaborative', label: 'Group Discussion', desc: 'Learning through teaching others' },
            { value: 'audio', label: 'Audio & Podcasts', desc: 'Learning through listening' },
            { value: 'mixed', label: 'Mixed / Flexible', desc: 'Using multiple approaches' }
          ].map((option) => {
            const isSelected = formData.learningStyles.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleSelection(
                  formData.learningStyles, 
                  option.value, 
                  (newVal) => setFormData({ ...formData, learningStyles: newVal })
                )}
                className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="font-semibold text-slate-800 dark:text-slate-100">{option.label}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{option.desc}</div>
                {isSelected && <FaCheck className="text-indigo-600 mt-2" size={16} />}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Selected: {formData.learningStyles.length} style(s)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Most Effective Study Methods
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Choose all that work best for you</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'active-recall', label: 'Active Recall' },
            { value: 'spaced-repetition', label: 'Spaced Repetition' },
            { value: 'practice-problems', label: 'Practice Problems' },
            { value: 'mind-maps', label: 'Mind Maps' },
            { value: 'teaching-others', label: 'Teaching Others' },
            { value: 'summarizing', label: 'Summarizing' },
            { value: 'flashcards', label: 'Flashcards' },
            { value: 'none', label: 'No Structured Method' }
          ].map((option) => {
            const isSelected = formData.preferredMethods.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleSelection(
                  formData.preferredMethods, 
                  option.value, 
                  (newVal) => setFormData({ ...formData, preferredMethods: newVal })
                )}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all min-h-[36px] sm:min-h-[40px] ${
                  isSelected
                    ? 'bg-indigo-600 text-white cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer'
                }`}
              >
                {option.label} {isSelected && <FaCheck className="inline ml-1" size={12} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Study Challenges</h3>
        <p className="text-slate-500 dark:text-slate-400">Understanding your obstacles helps us provide targeted advice</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Biggest Study Challenges
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Choose all that apply to you</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'focus', label: 'Staying Focused', desc: 'I get distracted easily' },
            { value: 'understanding', label: 'Understanding Concepts', desc: 'Topics feel too complex' },
            { value: 'retention', label: 'Remembering', desc: 'I forget what I studied' },
            { value: 'time', label: 'Time Management', desc: 'I can\'t manage study time' },
            { value: 'motivation', label: 'Motivation', desc: 'I struggle to stay motivated' },
            { value: 'method', label: 'Finding Methods', desc: 'I don\'t know how to study' },
            { value: 'procrastination', label: 'Procrastination', desc: 'I keep delaying' },
            { value: 'burnout', label: 'Burnout', desc: 'I feel exhausted' }
          ].map((option) => {
            const isSelected = formData.challenges.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleSelection(
                  formData.challenges, 
                  option.value, 
                  (newVal) => setFormData({ ...formData, challenges: newVal })
                )}
                className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="font-semibold text-slate-800 dark:text-slate-100">{option.label}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{option.desc}</div>
                {isSelected && <FaCheck className="text-indigo-600 mt-2" size={16} />}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Selected: {formData.challenges.length} challenge(s)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Confidence Level in Your Current Study Methods
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'high', label: 'Very Confident' },
            { value: 'medium', label: 'Somewhat Confident' },
            { value: 'low', label: 'Not Confident' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFormData({ ...formData, confidenceLevel: option.value })}
              className={`p-4 rounded-lg border-2 text-center transition-all cursor-pointer ${
                formData.confidenceLevel === option.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <div className="font-semibold text-slate-800 dark:text-slate-100">{option.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

 
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Goals & Motivation</h3>
        <p className="text-slate-500 dark:text-slate-400">What drives you to study? This helps us tailor recommendations</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Your Main Goals
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Choose all that apply</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'improve-grades', label: 'Improve Grades', desc: 'I want better marks' },
            { value: 'understand-deeper', label: 'Deeper Understanding', desc: 'I want to truly learn' },
            { value: 'save-time', label: 'Save Time', desc: 'I want to study efficiently' },
            { value: 'career-prep', label: 'Career Preparation', desc: 'I want to build skills' },
            { value: 'pass-exam', label: 'Pass an Exam', desc: 'I need to pass an exam' },
            { value: 'personal-growth', label: 'Personal Growth', desc: 'I love learning' }
          ].map((option) => {
            const isSelected = formData.goals.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleSelection(
                  formData.goals, 
                  option.value, 
                  (newVal) => setFormData({ ...formData, goals: newVal })
                )}
                className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="font-semibold text-slate-800 dark:text-slate-100">{option.label}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{option.desc}</div>
                {isSelected && <FaCheck className="text-indigo-600 mt-2" size={16} />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          What Motivates You to Study?
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Choose all that apply</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'curiosity', label: 'Curiosity' },
            { value: 'grades', label: 'Grades' },
            { value: 'career', label: 'Career' },
            { value: 'personal', label: 'Personal Growth' },
            { value: 'achievement', label: 'Achievement' },
            { value: 'pressure', label: 'External Pressure' }
          ].map((option) => {
            const isSelected = formData.motivations.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleSelection(
                  formData.motivations, 
                  option.value, 
                  (newVal) => setFormData({ ...formData, motivations: newVal })
                )}
                className={`p-4 rounded-lg border-2 text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{option.label}</div>
                {isSelected && <FaCheck className="text-indigo-600 mt-1 mx-auto" size={14} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

 
  const generateRecommendations = () => {
    const { 
      subject, customSubject, currentGrade, studyHours, methods,
      learningStyles, preferredMethods, challenges,
      confidenceLevel, goals, motivations
    } = formData;
    
    const grade = parseInt(currentGrade);
    const hours = parseInt(studyHours);
    const subjectName = subject === 'Other' ? customSubject : subject;

    const recommendations = [];

    const effectiveMethods = {
      'active-recall': { score: 88, label: 'Active Recall' },
      'practice-problems': { score: 85, label: 'Practice Problems' },
      'spaced-repetition': { score: 80, label: 'Spaced Repetition' },
      'mind-maps': { score: 78, label: 'Mind Maps' },
      'flashcards': { score: 82, label: 'Flashcards' },
      'teaching-others': { score: 85, label: 'Teaching Others' },
      'summarizing': { score: 75, label: 'Summarizing' },
      'reading-notes': { score: 45, label: 'Reading Notes' },
      'videos': { score: 60, label: 'Watching Videos' }
    };

    let bestMethod = 'practice-problems';
    let bestScore = 0;
    Object.keys(effectiveMethods).forEach(method => {
      if (preferredMethods.includes(method) || methods.includes(method)) {
        const score = effectiveMethods[method]?.score || 50;
        if (score > bestScore) {
          bestScore = score;
          bestMethod = method;
        }
      }
    });

    const challengeAdvice = {
      'focus': { tip: 'Try the Pomodoro Technique: 25 minutes studying, 5 minutes break', method: 'active-recall' },
      'understanding': { tip: 'Use the Feynman Technique: Explain the concept as if teaching someone else', method: 'teaching-others' },
      'retention': { tip: 'Use Spaced Repetition with flashcards. Review after 1 day, 3 days, then 1 week', method: 'spaced-repetition' },
      'time': { tip: 'Create a weekly study schedule. Study in 2-hour blocks with 15-minute breaks', method: 'practice-problems' },
      'motivation': { tip: 'Set small, achievable goals. Use the "Seinfeld Strategy" — don\'t break the chain', method: 'active-recall' },
      'method': { tip: 'Start with Active Recall combined with Spaced Repetition', method: 'active-recall' },
      'procrastination': { tip: 'Use the "5-Minute Rule": Commit to studying for just 5 minutes', method: 'practice-problems' },
      'burnout': { tip: 'Take regular breaks. Study for 50 minutes, break for 10 minutes', method: 'mind-maps' }
    };

    challenges.forEach(challenge => {
      if (challengeAdvice[challenge]) {
        recommendations.push({
          type: 'challenge',
          title: challengeAdvice[challenge].tip,
          description: `Based on your challenge: ${challenge}`,
          priority: 'high'
        });
      }
    });

    goals.forEach(goal => {
      if (goal === 'improve-grades') {
        recommendations.push({
          type: 'goal',
          title: 'Focus on past exam questions',
          description: 'Practicing with previous exams builds familiarity with question patterns and topics.',
          priority: 'high'
        });
      }
      if (goal === 'understand-deeper') {
        recommendations.push({
          type: 'goal',
          title: 'Teach what you\'ve learned to someone else',
          description: 'If you can\'t explain it simply, you haven\'t understood it well enough yet.',
          priority: 'medium'
        });
      }
      if (goal === 'save-time') {
        recommendations.push({
          type: 'goal',
          title: 'Apply the Pareto Principle (80/20 Rule)',
          description: 'Focus 80% of your effort on the 20% of concepts that appear most frequently on exams.',
          priority: 'medium'
        });
      }
    });

    if (hours < 5) {
      recommendations.push({
        type: 'time',
        title: `Increase study time to 8-10 hours per week`,
        description: `You're currently studying ${hours} hours. Increasing to 8 hours could improve your grade by 5-10%.`,
        priority: 'high'
      });
    }

    if (confidenceLevel === 'low') {
      recommendations.push({
        type: 'confidence',
        title: 'Build confidence with small, achievable wins',
        description: 'Master one topic at a time. Use the "2-Minute Rule" to overcome resistance.',
        priority: 'high'
      });
    }

    motivations.forEach(motivation => {
      if (motivation === 'curiosity') {
        recommendations.push({
          type: 'motivation',
          title: 'Follow your curiosity beyond the curriculum',
          description: 'Exploring topics you find interesting builds deeper understanding and makes studying enjoyable.',
          priority: 'low'
        });
      }
    });

    const methodScores = {
      'reading-notes': 45, 'practice-problems': 85, 'active-recall': 88,
      'spaced-repetition': 80, 'mind-maps': 78, 'flashcards': 82,
      'teaching-others': 85, 'summarizing': 75, 'videos': 60
    };

    const currentAvgMethodScore = methods.reduce((sum, m) => sum + (methodScores[m] || 50), 0) / (methods.length || 1);
    const bestMethodScore = methodScores[bestMethod] || 85;
    const hourBoost = Math.min(hours * 1.5, 12);
    
    let currentPredicted = Math.min(grade + (currentAvgMethodScore / 100) * 25 + hourBoost, 100);
    let bestPredicted = Math.min(grade + (bestMethodScore / 100) * 30 + hourBoost * 1.2, 100);
    
    currentPredicted = Math.round(currentPredicted);
    bestPredicted = Math.round(bestPredicted);

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return {
      currentPredicted,
      bestPredicted,
      improvement: bestPredicted - grade,
      recommendedMethod: bestMethod,
      recommendations,
      subjectName,
      summary: {
        subject: subjectName,
        currentGrade: grade,
        studyHours: hours,
        methods: methods,
        learningStyles: learningStyles,
        preferredMethods: preferredMethods,
        challenges: challenges,
        goals: goals,
        motivations: motivations,
        confidence: confidenceLevel
      },
      recommendedMethodLabel: effectiveMethods[bestMethod]?.label || bestMethod
    };
  };

 
const handleSubmit = () => {
  setLoading(true);
  
  setTimeout(() => {
    const resultData = generateRecommendations();
    const subjectName = formData.subject === 'Other' ? formData.customSubject : formData.subject;
    
    let email = '';
    
    const activeSession = localStorage.getItem('activeSession');
    if (activeSession) {
      try {
        const session = JSON.parse(activeSession);
        email = session.email;
      } catch (e) {}
    }
    
    if (!email) {
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(key => key.startsWith('user_'));
      if (userKeys.length > 0) {
        try {
          const userData = JSON.parse(localStorage.getItem(userKeys[userKeys.length - 1]));
          email = userData.email;
        } catch (e) {}
      }
    }
    
    const historyEntry = {
      type: 'assessment',
      subject: subjectName,
      currentGrade: parseInt(formData.currentGrade),
      predictedGrade: resultData.bestPredicted,
      improvement: resultData.improvement,
      method: resultData.recommendedMethodLabel || resultData.recommendedMethod,
      recommendedMethod: resultData.recommendedMethod,
      recommendedMethodLabel: resultData.recommendedMethodLabel,
      studyHours: parseInt(formData.studyHours),
      learningStyles: formData.learningStyles,
      challenges: formData.challenges,
      goals: formData.goals,
      recommendations: resultData.recommendations,
      recommendation: resultData.recommendations[0]?.title || 'Keep studying!',
      date: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      confidence: formData.confidenceLevel,
      motivations: formData.motivations,
      methods: formData.methods
    };

    const profileData = {
      learningStyles: formData.learningStyles,
      preferredMethods: formData.preferredMethods,
      challenges: formData.challenges,
      goals: formData.goals,
      confidence: formData.confidenceLevel,
      methods: formData.methods,
      motivations: formData.motivations,
      recommendations: resultData.recommendations,
      subject: formData.subject,
      studyHours: formData.studyHours,
      currentGrade: formData.currentGrade,
      recommendedMethod: resultData.recommendedMethod,
      recommendedMethodLabel: resultData.recommendedMethodLabel,
      timestamp: new Date().toISOString()
    };

    if (email) {
      saveProfile(email, profileData);
      console.log(" Profile saved for:", email);
    }

    setResult({
      ...resultData,
      historyEntry
    });
    
    setLoading(false);
  }, 1500);
};


  
const handleSaveToHistory = () => {
  if (result && result.historyEntry) {
   
    let email = '';
    

    const activeSession = localStorage.getItem('activeSession');
    if (activeSession) {
      try {
        const session = JSON.parse(activeSession);
        email = session.email;
        console.log("📝 Found email from activeSession:", email);
      } catch (e) {
        console.error("Error parsing session:", e);
      }
    }
    
   
    if (!email) {
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(key => key.startsWith('user_'));
      console.log("📝 Found user keys:", userKeys);
      
      if (userKeys.length > 0) {
        
        const lastUserKey = userKeys[userKeys.length - 1];
        try {
          const userData = JSON.parse(localStorage.getItem(lastUserKey));
          email = userData.email;
          console.log("📝 Found email from user data:", email);
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
    
   
    if (!email) {
      const savedEmail = localStorage.getItem('savedEmail');
      if (savedEmail) {
        email = savedEmail;
        console.log(" Found email from savedEmail:", email);
      }
    }
    
    if (!email) {
      console.error(" No email found — cannot save to history");
      alert("Session expired. Please log in again.");
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'login' }));
      return;
    }
    
    console.log(" Saving to history for email:", email);
    console.log(" Entry:", result.historyEntry);
    
    
    addHistoryEntry(email, result.historyEntry);
    console.log(" Assessment saved to history");
    
    
    notifyDataUpdated();
    
   
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'dashboard' }));
    
    
    setFormData({
      subject: '',
      customSubject: '',
      currentGrade: '',
      studyHours: '',
      methods: [],
      learningStyles: [],
      preferredMethods: [],
      challenges: [],
      confidenceLevel: '',
      goals: [],
      motivations: []
    });
    setStep(1);
    setResult(null);
  }
};
  
  const renderResult = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Your Personalized Study Plan</h3>
        <p className="text-slate-500 dark:text-slate-400">Based on your responses, here's what we recommend</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
        <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Study Profile Summary</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-slate-500 dark:text-slate-400">Subject:</span>
          <span className="font-medium text-slate-800 dark:text-slate-100">{result.summary.subject}</span>
          <span className="text-slate-500 dark:text-slate-400">Current Grade:</span>
          <span className="font-medium text-slate-800 dark:text-slate-100">{result.summary.currentGrade}%</span>
          <span className="text-slate-500 dark:text-slate-400">Study Hours:</span>
          <span className="font-medium text-slate-800 dark:text-slate-100">{result.summary.studyHours} hours/week</span>
          <span className="text-slate-500 dark:text-slate-400">Confidence:</span>
          <span className="font-medium text-slate-800 dark:text-slate-100 capitalize">{result.summary.confidence}</span>
        </div>
        {result.summary.methods.length > 0 && (
          <div className="mt-2">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Methods used: </span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{result.summary.methods.join(', ')}</span>
          </div>
        )}
        {result.summary.challenges.length > 0 && (
          <div className="mt-1">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Challenges: </span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{result.summary.challenges.join(', ')}</span>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm opacity-80">Current</p>
            <p className="text-3xl font-bold">{result.summary.currentGrade}%</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Predicted</p>
            <p className="text-3xl font-bold">{result.bestPredicted}%</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Improvement</p>
            <p className="text-3xl font-bold text-yellow-300">+{result.improvement}%</p>
          </div>
          <div>
            <p className="text-sm opacity-80">Best Method</p>
            <p className="text-lg font-bold">{result.recommendedMethodLabel}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Recommendations</h4>
        {result.recommendations.map((rec, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border-l-4 ${
              rec.priority === 'high' 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                : rec.priority === 'medium'
                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            }`}
          >
            <p className="font-semibold text-slate-800 dark:text-slate-100">{rec.title}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{rec.description}</p>
            <span className={`text-xs uppercase font-semibold ${
              rec.priority === 'high' ? 'text-red-600' : 
              rec.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
            }`}>
              {rec.priority} priority
            </span>
          </div>
        ))}
      </div>

      {/* ─── ⭐ SAVE TO HISTORY BUTTON ─── */}
      <button
        onClick={handleSaveToHistory}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
      >
        <FaCheckCircle /> Save to History
      </button>
    </div>
  );

  const renderForm = () => (
    <>
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
          <span>Step {step} of 4</span>
          <span>{Math.round(step/4 * 100)}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${step/4 * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}

      <div className="flex flex-wrap gap-4 mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 min-w-[100px] px-6 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 text-base min-h-[48px] cursor-pointer"
          >
            <FaArrowLeft /> Back
          </button>
        )}
        
        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex-1 min-w-[100px] bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-base min-h-[48px] cursor-pointer"
          >
            Next <FaArrowRight />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 min-w-[100px] bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-base min-h-[48px] cursor-pointer"
          >
            {loading ? 'Analyzing...' : <><FaMagic /> Get Plan</>}
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="container-custom py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
          New Request
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
          Fill out all sections to receive personalized recommendations from የሐ Yeha
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto">
        {result ? renderResult() : renderForm()}
      </div>
    </div>
  );
};

export default NewRequest;