import React from 'react'
import { useNavigate } from 'react-router-dom'

const HealthHubPage = () => {
  const navigate = useNavigate()

  const healthOptions = [
    {
      id: 'stress-wellness',
      title: 'Stress & Wellness Assessment',
      subtitle: 'Mental Health Evaluation',
      description: 'Comprehensive assessment of your stress levels, depression risk, and personalized wellness recommendations.',
      icon: '🧠',
      color: 'from-blue-400 via-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      route: '/wellness-prediction',
      features: ['Stress evaluation', 'Depression risk assessment', 'Personalized insights', 'Progress tracking']
    },
    {
      id: 'diabetes-prediction',
      title: 'Diabetes Prediction',
      subtitle: 'Health Risk Assessment',
      description: 'Advanced machine learning prediction for diabetes risk based on your health metrics and lifestyle factors.',
      icon: '🩸',
      color: 'from-red-400 via-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      route: '/diabetes-prediction',
      features: ['ML-powered prediction', 'Multiple algorithms', 'Health insights', 'Risk assessment']
    },
    {
      id: 'heart-health',
      title: 'Heart Health Monitor',
      subtitle: 'Cardiovascular Assessment',
      description: 'Evaluate your cardiovascular health risks and receive personalized recommendations for heart wellness.',
      icon: '❤️',
      color: 'from-pink-400 via-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
      route: '/heart-health',
      features: ['Heart risk evaluation', 'Lifestyle recommendations', 'Health monitoring', 'Preventive care']
    },
    {
      id: 'mental-fitness',
      title: 'Mental Fitness Tracker',
      subtitle: 'Cognitive Wellness',
      description: 'Track and improve your mental fitness with cognitive assessments and brain health recommendations.',
      icon: '🎯',
      color: 'from-purple-400 via-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      route: '/mental-fitness',
      features: ['Cognitive assessment', 'Mental fitness score', 'Brain exercises', 'Progress tracking']
    }
  ]

  const handleOptionClick = (option) => {
    if (option.route) {
      navigate(option.route)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-300/20 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-100/20 to-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-center space-x-4 mb-6">
                <span className="text-4xl animate-bounce">🏥</span>
                <span className="text-4xl animate-bounce delay-100">💊</span>
                <span className="text-4xl animate-bounce delay-200">🩺</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                Health Prediction Hub
                <span className="block bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                  Choose Your Assessment
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-pink-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                Take control of your health with our comprehensive prediction tools.
                Choose from our range of AI-powered health assessments to understand your risks and get personalized recommendations.
              </p>
            </div>
          </div>
        </section>

        {/* Health Options Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
                Available Health Assessments
              </h2>
              <p className="text-lg text-pink-600 font-light max-w-2xl mx-auto">
                Select the health assessment that best fits your needs. Each tool uses advanced algorithms to provide accurate insights.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {healthOptions.map((option) => (
                <div
                  key={option.id}
                  className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-pink-100/50 overflow-hidden group cursor-pointer"
                  onClick={() => handleOptionClick(option)}
                >
                  <div className={`bg-gradient-to-br ${option.color} p-8 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                          {option.icon}
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-white text-sm font-medium">AI-Powered</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{option.title}</h3>
                      <p className="text-white/90 text-lg font-light">{option.subtitle}</p>
                    </div>
                  </div>

                  <div className={`p-8 bg-gradient-to-br ${option.bgColor}`}>
                    <p className="text-gray-700 leading-relaxed mb-6 text-lg font-light">{option.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {option.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOptionClick(option)
                      }}
                    >
                      Start {option.title}
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
                <span className="text-4xl animate-pulse delay-100">🔬</span>
                <span className="text-4xl animate-pulse delay-200">📊</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-6">
                About Our Health Assessments
              </h2>
              <p className="text-xl text-pink-700 mb-8 leading-relaxed font-light">
                Our AI-powered health prediction tools use advanced machine learning algorithms trained on extensive medical datasets.
                While these assessments provide valuable insights, they are not substitutes for professional medical advice.
              </p>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-pink-200/50">
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🎯</div>
                    <h4 className="font-semibold text-pink-800 mb-2">Accurate Predictions</h4>
                    <p className="text-pink-600 text-sm">Using state-of-the-art ML models with high accuracy rates</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">🔒</div>
                    <h4 className="font-semibold text-pink-800 mb-2">Privacy Protected</h4>
                    <p className="text-pink-600 text-sm">Your health data is encrypted and never shared</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-3">👨‍⚕️</div>
                    <h4 className="font-semibold text-pink-800 mb-2">Medical Disclaimer</h4>
                    <p className="text-pink-600 text-sm">Consult healthcare professionals for medical decisions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HealthHubPage
