import React from 'react';
import { FaGraduationCap, FaChartLine, FaLightbulb, FaRocket } from 'react-icons/fa';

const Home = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-dark dark:to-gray-900">
      {/* Hero Section */}
      <div className="container-custom py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/20 rounded-full">
              <FaGraduationCap className="text-6xl text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-800 dark:text-slate-100">
             <span className="text-indigo-600 dark:text-indigo-400 font-serif">የሐ</span>
             <span className="text-slate-800 dark:text-slate-100"> Yeha</span>
         </h1>
         <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Where Knowledge Begins
         </p> 
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Discover your perfect study method. Get personalized recommendations and track your progress.
          </p>
          
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 hover:scale-105 transition-all shadow-lg"
          >
            Get Started <FaRocket />
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <FaChartLine className="text-3xl text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-dark dark:text-light">Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-400">Monitor your grades and study habits over time</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <FaLightbulb className="text-3xl text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-dark dark:text-light">Smart Recommendations</h3>
            <p className="text-gray-600 dark:text-gray-400">Get personalized study method suggestions</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <FaGraduationCap className="text-3xl text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-dark dark:text-light">Study Smarter</h3>
            <p className="text-gray-600 dark:text-gray-400">Learn efficient methods that work for you</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;