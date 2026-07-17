import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaUser, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const activeSession = localStorage.getItem('activeSession');
    if (activeSession) {
      try {
        const session = JSON.parse(activeSession);
        const userKey = `user_${session.email}`;
        const savedUser = localStorage.getItem(userKey);
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          onLogin(userData);
          return;
        }
      } catch (e) {}
    }

    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [onLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!isLogin && !name) {
      setError('Please enter your name');
      return;
    }

    const userKey = `user_${email}`;
    const existingUser = localStorage.getItem(userKey);
    
    if (isLogin) {
      if (existingUser) {
        try {
          const userData = JSON.parse(existingUser);
          const storedPassword = localStorage.getItem(`pass_${email}`);
          if (storedPassword && storedPassword !== password) {
            setError('Incorrect password. Please try again.');
            return;
          }
          
          const historyKey = `history_${email}`;
          const savedHistory = localStorage.getItem(historyKey);
          if (savedHistory) {
            const historyData = JSON.parse(savedHistory);
            if (historyData.length > 0) {
              setSuccess(`Welcome back! You have ${historyData.length} saved predictions.`);
            }
          }
          
          if (rememberMe) {
            localStorage.setItem('activeSession', JSON.stringify({
              email: email,
              timestamp: Date.now()
            }));
            localStorage.setItem('savedEmail', email);
          }
          
          setPassword('');
          onLogin(userData);
          return;
        } catch (e) {
          setError('Error logging in. Please try again.');
          return;
        }
      } else {
        setError('No account found. Please sign up first.');
        return;
      }
    } else {
      if (existingUser) {
        setError('This email is already registered. Please login instead.');
        return;
      }
      
      const newUser = {
        email: email,
        name: name
      };
      localStorage.setItem(userKey, JSON.stringify(newUser));
      localStorage.setItem(`pass_${email}`, password);
      
      const historyKey = `history_${email}`;
      if (!localStorage.getItem(historyKey)) {
        localStorage.setItem(historyKey, JSON.stringify([]));
      }
      
      setSuccess('Account created successfully!');
      
      if (rememberMe) {
        localStorage.setItem('activeSession', JSON.stringify({
          email: email,
          timestamp: Date.now()
        }));
        localStorage.setItem('savedEmail', email);
      }
      
      setPassword('');
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {isLogin ? 'Welcome Back to' : 'Join'}
          </h2>
          <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 font-serif mb-2">
            የሐ Yeha
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {isLogin ? 'Login to continue' : 'Start your study journey'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm border border-green-200 dark:border-green-800 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., John Doe"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="student@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {isLogin ? 'Enter your password' : 'Must be at least 6 characters'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="rememberMe" className="text-sm text-slate-600 dark:text-slate-300">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {isLogin ? 'Login' : 'Create Account'} <FaArrowRight />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setName('');
                setPassword('');
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline ml-1"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;