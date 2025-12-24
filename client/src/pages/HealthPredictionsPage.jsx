import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HealthPredictionsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const predictionOptions = [
    {
      id: 'diabetes',
      title: 'Diabetes Prediction',
      description: 'Predict diabetes risk based on medical parameters',
      icon: '🩸',
      color: 'from-red-400 to-red-500',
      bgColor: 'from-red-50 to-red-100',
      features: ['8 Medical Parameters', 'ML-powered Analysis', 'High Accuracy (77%)']
    },
    {
      id: 'stress',
      title: 'Stress & Wellness',
      description: 'Assess your mental wellness and stress levels',
      icon: '🧠',
      color: 'from-blue-400 to-blue-500',
      bgColor: 'from-blue-50 to-blue-100',
      features: ['Emotional Assessment', 'Personalized Suggestions', 'Wellness Tracking']
    },
    {
      id: 'heart',
      title: 'Heart Health',
      description: 'Evaluate cardiovascular health risks',
      icon: '❤️',
      color: 'from-pink-400 to-pink-500',
      bgColor: 'from-pink-50 to-pink-100',
      features: ['Cardiac Risk Factors', 'Prevention Insights', 'Health Monitoring']
    },
    {
      id: 'mental',
      title: 'Mental Health',
      description: 'Comprehensive mental health assessment using validated clinical questionnaires',
      icon: '🧠',
      color: 'from-purple-400 to-purple-500',
      bgColor: 'from-purple-50 to-purple-100',
      features: ['PHQ-9, GAD-7, PSS-10, WHO-5', 'Depression & Anxiety Screening', 'Personalized Recommendations']
    }
  ];

  const handlePredictionClick = (predictionId) => {
    switch (predictionId) {
      case 'diabetes':
        navigate('/diabetes-prediction');
        break;
      case 'stress':
        navigate('/wellness-prediction');
        break;
      case 'heart':
        navigate('/heart-disease-prediction');
        break;
      case 'mental':
        navigate('/mental-health-assessment');
        break;
      default:
        break;
    }
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
        {/* Header */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-center space-x-4 mb-6">
                <span className="text-4xl animate-bounce">🏥</span>
                <span className="text-4xl animate-bounce delay-100">🔬</span>
                <span className="text-4xl animate-bounce delay-200">📊</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                Health Predictions
                <span className="block bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent text-3xl md:text-5xl">
                  Powered by AI & ML
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-pink-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                Take control of your health with our advanced AI-powered prediction tools.
                Get personalized insights and early warnings for better health outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Prediction Options Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-4">
                Choose Your Health Assessment
              </h2>
              <p className="text-pink-600 text-lg font-light">
                Select the prediction tool that best fits your health monitoring needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {predictionOptions.map((option) => (
                <div
                  key={option.id}
                  className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-pink-100/50 p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl cursor-pointer"
                  onClick={() => handlePredictionClick(option.id)}
                >
                  <div className={`bg-gradient-to-br ${option.color} p-6 rounded-2xl text-white mb-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-5xl">{option.icon}</span>
                      <div className="text-right">
                        <h3 className="text-xl font-bold">{option.title}</h3>
                        <div className="w-8 h-1 bg-white/50 rounded-full mt-2"></div>
                      </div>
                    </div>
                    <p className="text-white/90 leading-relaxed">{option.description}</p>
                  </div>

                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${option.bgColor}`}>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Features:</h4>
                    <ul className="space-y-2">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <span className="text-pink-500 mr-3">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      className="w-full mt-6 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePredictionClick(option.id);
                      }}
                    >
                      Start Assessment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-pink-100/50 to-pink-200/30">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="flex justify-center space-x-4 mb-6">
                <span className="text-4xl animate-pulse">ℹ️</span>
                <span className="text-4xl animate-pulse delay-100">🔒</span>
                <span className="text-4xl animate-pulse delay-200">🛡️</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-6">
                Your Health Data is Safe
              </h2>
              <p className="text-xl text-pink-700 mb-8 leading-relaxed font-light">
                All predictions are processed locally or on secure servers. Your health information
                is never stored or shared without your explicit consent.
              </p>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-pink-200/50">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🔐</div>
                    <h3 className="font-semibold text-pink-800 mb-2">Privacy First</h3>
                    <p className="text-pink-600 text-sm">Your data stays private and secure</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="font-semibold text-pink-800 mb-2">AI-Powered</h3>
                    <p className="text-pink-600 text-sm">Advanced machine learning algorithms</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-4">📈</div>
                    <h3 className="font-semibold text-pink-800 mb-2">Evidence-Based</h3>
                    <p className="text-pink-600 text-sm">Backed by medical research and data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 text-white py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4">Take Control of Your Health Today</h3>
              <p className="text-pink-100 leading-relaxed font-light">
                Prevention is better than cure. Start your health journey with our intelligent prediction tools.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <span className="text-pink-300 text-2xl animate-pulse">🌟</span>
              <span className="text-pink-300">Your Health, Your Future</span>
              <span className="text-pink-300 text-2xl animate-pulse">🌟</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HealthPredictionsPage;
