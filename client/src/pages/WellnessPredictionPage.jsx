
import React, { useState, useContext, useEffect } from 'react';
import { WellnessContext } from '../context/wellness/WellnessContext';

const WellnessPredictionPage = () => {
  const { assessmentResult, assessmentHistory, loading, error, assessWellness, getAssessmentHistory, clearAssessmentResult } = useContext(WellnessContext);

  const [formData, setFormData] = useState({
    sleepHours: 0,
    exerciseFrequency: 0,
    screenTime: 0,
    littleInterest: 0,
    feelingDown: 0,
    troubleConcentrating: 0,
    feelingTired: 0,
    feelingAnxious: 0,
    hoursWorked: 0,
    deadlinePressure: 'low',
  });

  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

  useEffect(() => {
    // Only load history if user is authenticated and backend is available
    const token = localStorage.getItem('token');
    if (token) {
      // Delay history loading to avoid immediate errors on page load
      const timer = setTimeout(() => {
        getAssessmentHistory();
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHasUserInteracted(true);
    setFormData({
      ...formData,
      [name]: name === 'deadlinePressure' ? value : Number(value),
    });
  };

  const resetForm = () => {
    setFormData({
      sleepHours: 0,
      exerciseFrequency: 0,
      screenTime: 0,
      littleInterest: 0,
      feelingDown: 0,
      troubleConcentrating: 0,
      feelingTired: 0,
      feelingAnxious: 0,
      hoursWorked: 0,
      deadlinePressure: 'low',
    });
    setHasUserInteracted(false);
    setLastSubmissionTime(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentTime = Date.now();

    // Prevent rapid submissions (within 2 seconds)
    if (currentTime - lastSubmissionTime < 2000) {
      console.log('Form submission blocked: Too frequent submissions');
      return;
    }

    // Prevent auto-submission - only allow submission if user has interacted with the form
    if (!hasUserInteracted) {
      console.log('Form submission blocked: User has not interacted with the form yet');
      return;
    }

    // Validate that user has provided meaningful input (not all default values)
    const hasMeaningfulInput = formData.sleepHours > 0 ||
                               formData.exerciseFrequency > 0 ||
                               formData.screenTime > 0 ||
                               formData.littleInterest > 0 ||
                               formData.feelingDown > 0 ||
                               formData.troubleConcentrating > 0 ||
                               formData.feelingTired > 0 ||
                               formData.feelingAnxious > 0 ||
                               formData.hoursWorked > 0 ||
                               formData.deadlinePressure !== 'low';

    if (!hasMeaningfulInput) {
      alert('Please provide some information about your wellbeing before submitting the assessment.');
      return;
    }

    console.log('Form submitted with data:', formData);
    setLastSubmissionTime(currentTime);
    clearAssessmentResult(); // Clear previous results
    await assessWellness(formData);
  };

  const renderPictorialRepresentation = () => {
    if (!assessmentResult) return null;

    const { stressLevel, depressionRisk, suggestions, disclaimer, saved, note } = assessmentResult;

    const getEmoji = (level) => {
      switch (level) {
        case 'Low':
          return '😊';
        case 'Moderate':
          return '😐';
        case 'High':
          return '😟';
        default:
          return '';
      }
    };

    const getStressColor = (level) => {
      switch (level) {
        case 'Low':
          return 'from-green-400 to-green-500';
        case 'Moderate':
          return 'from-yellow-400 to-yellow-500';
        case 'High':
          return 'from-red-400 to-red-500';
        default:
          return 'from-gray-400 to-gray-500';
      }
    };

    const getDepressionColor = (level) => {
      switch (level) {
        case 'Low':
          return 'from-blue-400 to-blue-500';
        case 'Moderate':
          return 'from-purple-400 to-purple-500';
        case 'High':
          return 'from-pink-400 to-pink-500';
        default:
          return 'from-gray-400 to-gray-500';
      }
    };

    return (
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-pink-100/50 p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="flex justify-center space-x-4 mb-6">
            <span className="text-4xl animate-bounce">✨</span>
            <span className="text-4xl animate-bounce delay-100">🌟</span>
            <span className="text-4xl animate-bounce delay-200">✨</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Wellness Insights
          </h3>
          <p className="text-pink-600 text-lg font-light">
            Here's what your responses tell us about your current wellbeing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Stress Level Card */}
          <div className={`bg-gradient-to-br ${getStressColor(stressLevel)} p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold">Stress Level</h4>
              <span className="text-4xl">{getEmoji(stressLevel)}</span>
            </div>
            <div className="text-3xl font-bold mb-2">{stressLevel}</div>
            <div className="text-white/90 text-sm">
              {stressLevel === 'Low' && 'Great job maintaining low stress levels!'}
              {stressLevel === 'Moderate' && 'Some stress is normal - consider stress management techniques.'}
              {stressLevel === 'High' && 'High stress levels detected. Professional support may be beneficial.'}
            </div>
          </div>

          {/* Depression Risk Card */}
          <div className={`bg-gradient-to-br ${getDepressionColor(depressionRisk)} p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold">Depression Risk</h4>
              <span className="text-4xl">{getEmoji(depressionRisk)}</span>
            </div>
            <div className="text-3xl font-bold mb-2">{depressionRisk}</div>
            <div className="text-white/90 text-sm">
              {depressionRisk === 'Low' && 'Low depression risk - keep up your positive habits!'}
              {depressionRisk === 'Moderate' && 'Moderate risk detected. Self-care and support are important.'}
              {depressionRisk === 'High' && 'High risk detected. Consider professional mental health support.'}
            </div>
          </div>
        </div>

        {/* Personalized Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="bg-gradient-to-r from-pink-50 to-pink-100/50 p-6 rounded-2xl border border-pink-200/30 mb-8">
            <h4 className="text-xl font-semibold text-pink-800 mb-4 flex items-center">
              <span className="text-2xl mr-3">💡</span>
              Your Personalized Suggestions
            </h4>
            <div className="grid gap-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 bg-white/70 p-4 rounded-xl border border-pink-200/30">
                  <span className="text-pink-500 font-bold text-lg mt-1">{index + 1}.</span>
                  <span className="text-pink-700 leading-relaxed">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Messages */}
        {(saved === false || note) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-yellow-500 text-xl">⚠️</span>
              <div>
                <p className="text-yellow-800 font-medium">Offline Mode</p>
                <p className="text-yellow-700 text-sm">
                  {note || 'Assessment completed locally. Results not saved to server.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {disclaimer && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl">ℹ️</span>
              <div>
                <h5 className="text-blue-800 font-semibold mb-2">Important Medical Disclaimer</h5>
                <p className="text-blue-700 text-sm leading-relaxed">{disclaimer}</p>
              </div>
            </div>
          </div>
        )}

        {/* Encouragement Message */}
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-pink-100/50 to-pink-200/30 rounded-2xl border border-pink-200/30">
          <p className="text-pink-700 font-medium text-lg mb-2">
            Remember, this is just one step in your wellness journey
          </p>
          <p className="text-pink-600 text-sm">
            Small, consistent actions lead to meaningful change. You've got this! 💪
          </p>
        </div>
      </div>
    );
  };

  const renderAssessmentHistory = () => {
    if (!assessmentHistory || assessmentHistory.length === 0) return null;

    const getEmoji = (level) => {
      switch (level) {
        case 'Low':
          return '😊';
        case 'Moderate':
          return '😐';
        case 'High':
          return '😟';
        default:
          return '';
      }
    };

    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center space-x-4 mb-6">
              <span className="text-4xl animate-pulse">📊</span>
              <span className="text-4xl animate-pulse delay-100">📈</span>
              <span className="text-4xl animate-pulse delay-200">📊</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-4">
              Your Wellness Journey
            </h2>
            <p className="text-pink-600 text-lg font-light max-w-2xl mx-auto">
              Track your progress over time and see how your wellbeing has evolved
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentHistory.map((assessment, index) => (
              <div
                key={assessment._id || index}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-pink-100/50 p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">📅</span>
                    <span className="text-pink-600 font-medium text-sm">
                      {new Date(assessment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium">
                    #{assessmentHistory.length - index}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200/50">
                    <span className="text-green-700 font-medium">Stress Level</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-green-800">{assessment.stressLevel}</span>
                      <span className="text-2xl">{getEmoji(assessment.stressLevel)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                    <span className="text-blue-700 font-medium">Depression Risk</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-blue-800">{assessment.depressionRisk}</span>
                      <span className="text-2xl">{getEmoji(assessment.depressionRisk)}</span>
                    </div>
                  </div>
                </div>

                {assessment.suggestions && assessment.suggestions.length > 0 && (
                  <div className="border-t border-pink-200/50 pt-4">
                    <h5 className="text-sm font-semibold text-pink-800 mb-2 flex items-center">
                      <span className="text-lg mr-2">💡</span>
                      Key Insights
                    </h5>
                    <ul className="space-y-1">
                      {assessment.suggestions.slice(0, 2).map((suggestion, idx) => (
                        <li key={idx} className="text-xs text-pink-600 leading-relaxed">
                          • {suggestion}
                        </li>
                      ))}
                      {assessment.suggestions.length > 2 && (
                        <li className="text-xs text-pink-500 font-medium">
                          +{assessment.suggestions.length - 2} more insights
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {assessment.note && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-700">{assessment.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {assessmentHistory.length > 0 && (
            <div className="text-center mt-12">
              <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-pink-200/50">
                <span className="text-pink-600 font-medium">
                  {assessmentHistory.length} assessment{assessmentHistory.length !== 1 ? 's' : ''} completed
                </span>
                <span className="text-2xl">📈</span>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-300/20 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-100/20 to-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Beautiful Welcome Section */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-center space-x-4 mb-6">
                <span className="text-4xl animate-bounce">🌸</span>
                <span className="text-4xl animate-bounce delay-100">💖</span>
                <span className="text-4xl animate-bounce delay-200">🌺</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                Your Wellness Journey
                <span className="block bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-pink-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                Take a moment to reflect on your wellbeing. Our gentle assessment helps you understand
                your current state and provides personalized insights for your mental wellness journey.
              </p>
            </div>
          </div>
        </section>

        {/* Assessment Form Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-pink-100/50 p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-4">
                  Wellness Assessment
                </h2>
                <p className="text-pink-600 text-lg font-light">
                  Answer these questions honestly to get personalized insights
                </p>
              </div>

              {loading && (
                <div className="mb-6 p-4 bg-pink-50 border border-pink-200 rounded-2xl">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-500 border-t-transparent"></div>
                    <p className="text-pink-700 font-medium">Analyzing your responses...</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} autoComplete="off" className="space-y-8">
                {/* Lifestyle Section */}
                <div className="bg-gradient-to-r from-pink-50 to-pink-100/50 p-6 rounded-2xl border border-pink-200/30">
                  <h3 className="text-xl font-semibold text-pink-800 mb-6 flex items-center">
                    <span className="text-2xl mr-3">🌅</span>
                    Lifestyle & Daily Habits
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="sleepHours" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">😴</span>
                        Sleep Hours (0-12)
                      </label>
                      <input
                        type="number"
                        id="sleepHours"
                        name="sleepHours"
                        value={formData.sleepHours}
                        onChange={handleChange}
                        min="0"
                        max="12"
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="7-9 hours recommended"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="exerciseFrequency" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">🏃‍♀️</span>
                        Exercise Days/Week (0-7)
                      </label>
                      <input
                        type="number"
                        id="exerciseFrequency"
                        name="exerciseFrequency"
                        value={formData.exerciseFrequency}
                        onChange={handleChange}
                        min="0"
                        max="7"
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="3-5 days recommended"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="screenTime" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">📱</span>
                        Screen Time Hours/Day
                      </label>
                      <input
                        type="number"
                        id="screenTime"
                        name="screenTime"
                        value={formData.screenTime}
                        onChange={handleChange}
                        min="0"
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="Less than 3 hours ideal"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="hoursWorked" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">💼</span>
                        Work Hours/Week
                      </label>
                      <input
                        type="number"
                        id="hoursWorked"
                        name="hoursWorked"
                        value={formData.hoursWorked}
                        onChange={handleChange}
                        min="0"
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="40 hours standard"
                      />
                    </div>
                  </div>
                </div>

                {/* Emotional State Section */}
                <div className="bg-gradient-to-r from-pink-50 to-pink-100/50 p-6 rounded-2xl border border-pink-200/30">
                  <h3 className="text-xl font-semibold text-pink-800 mb-6 flex items-center">
                    <span className="text-2xl mr-3">💭</span>
                    Emotional Well-being (0-3 scale)
                  </h3>
                  <p className="text-pink-600 text-sm mb-6 font-light">
                    Rate how much you've experienced these feelings in the past 2 weeks (0=Not at all, 3=Almost every day)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="littleInterest" className="text-pink-700 font-medium">
                        Little interest or pleasure in doing things
                      </label>
                      <select
                        id="littleInterest"
                        name="littleInterest"
                        value={formData.littleInterest}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value={0}>0 - Not at all</option>
                        <option value={1}>1 - Several days</option>
                        <option value={2}>2 - More than half the days</option>
                        <option value={3}>3 - Almost every day</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="feelingDown" className="text-pink-700 font-medium">
                        Feeling down, depressed, or hopeless
                      </label>
                      <select
                        id="feelingDown"
                        name="feelingDown"
                        value={formData.feelingDown}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value={0}>0 - Not at all</option>
                        <option value={1}>1 - Several days</option>
                        <option value={2}>2 - More than half the days</option>
                        <option value={3}>3 - Almost every day</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="troubleConcentrating" className="text-pink-700 font-medium">
                        Trouble concentrating on things
                      </label>
                      <select
                        id="troubleConcentrating"
                        name="troubleConcentrating"
                        value={formData.troubleConcentrating}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value={0}>0 - Not at all</option>
                        <option value={1}>1 - Several days</option>
                        <option value={2}>2 - More than half the days</option>
                        <option value={3}>3 - Almost every day</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="feelingTired" className="text-pink-700 font-medium">
                        Feeling tired or having little energy
                      </label>
                      <select
                        id="feelingTired"
                        name="feelingTired"
                        value={formData.feelingTired}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value={0}>0 - Not at all</option>
                        <option value={1}>1 - Several days</option>
                        <option value={2}>2 - More than half the days</option>
                        <option value={3}>3 - Almost every day</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="feelingAnxious" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">😰</span>
                        Feeling anxious or on edge
                      </label>
                      <select
                        id="feelingAnxious"
                        name="feelingAnxious"
                        value={formData.feelingAnxious}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value={0}>0 - Not at all</option>
                        <option value={1}>1 - Several days</option>
                        <option value={2}>2 - More than half the days</option>
                        <option value={3}>3 - Almost every day</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="deadlinePressure" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">⏰</span>
                        Current Deadline Pressure
                      </label>
                      <select
                        id="deadlinePressure"
                        name="deadlinePressure"
                        value={formData.deadlinePressure}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value="low">Low - Comfortable timeline</option>
                        <option value="medium">Medium - Some pressure but manageable</option>
                        <option value="high">High - Intense deadline pressure</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Analyzing Your Well-being...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <span>🌟</span>
                        <span>Get My Wellness Insights</span>
                        <span>🌟</span>
                      </span>
                    )}
                  </button>
                </div>

                {error && !error.includes('assessment history') && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-center font-medium">{error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {assessmentResult && (
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              {renderPictorialRepresentation()}
            </div>
          </section>
        )}

        {/* Assessment History Section */}
        {renderAssessmentHistory()}

        {/* Motivational Message Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-pink-100/50 to-pink-200/30">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex justify-center space-x-4 mb-6">
                <span className="text-4xl animate-pulse">🤝</span>
                <span className="text-4xl animate-pulse delay-100">💕</span>
                <span className="text-4xl animate-pulse delay-200">🌈</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-6">
                You're Not Alone in This Journey
              </h2>
              <p className="text-xl text-pink-700 mb-8 leading-relaxed font-light">
                Mental wellness challenges affect millions of people worldwide. The fact that you're here,
                taking this step to understand and improve your wellbeing, shows incredible strength and self-awareness.
                Remember, seeking help and taking care of your mental health is a sign of wisdom, not weakness.
              </p>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-pink-200/50">
                <blockquote className="text-2xl font-light text-pink-800 italic mb-6">
                  "It's not difficult to care for your mental health. It becomes difficult when you don't."
                </blockquote>
                <p className="text-pink-600 font-medium">- We are all in this together 💪</p>
              </div>
            </div>
          </div>
        </section>

        {/* Beautiful Footer */}
        <footer className="bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 text-white py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 to-transparent"></div>
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <div className="mb-8">
              <div className="flex justify-center space-x-4 mb-6">
                <span className="text-3xl animate-bounce">🌸</span>
                <span className="text-3xl animate-bounce delay-100">💖</span>
                <span className="text-3xl animate-bounce delay-200">🌺</span>
                <span className="text-3xl animate-bounce delay-300">💕</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-100 to-white bg-clip-text text-transparent">
                MindBloom Wellness
              </h3>
              <p className="text-pink-100 leading-relaxed mb-6 font-light">
                Your trusted companion for mental wellness. Every step you take towards better mental health
                creates ripples of positive change in your life and the lives of those around you.
              </p>
            </div>

            <div className="border-t border-pink-500/50 pt-8">
              <p className="text-pink-200 text-sm font-light">
                Made with 💖 for your mental wellbeing journey
              </p>
              <div className="flex justify-center space-x-6 mt-6">
                <span className="text-pink-300 text-2xl animate-pulse">🌸</span>
                <span className="text-pink-300 text-2xl animate-pulse delay-100">Take care of yourself</span>
                <span className="text-pink-300 text-2xl animate-pulse delay-200">🌸</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WellnessPredictionPage;

