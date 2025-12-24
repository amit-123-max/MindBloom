import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiService from '../services/api'

const ManageStressPage = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [stressData, setStressData] = useState({
    academicPressure: 1,
    examAnxiety: 1,
    timeManagement: 1,
    peerComparison: 1,
    futureUncertainty: 1,
    sleepQuality: 1,
    copingMechanisms: 1,
    journalEntry: ''
  })
  const [stressLevel, setStressLevel] = useState(0)
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathingTime, setBreathingTime] = useState(120) // 2 minutes in seconds
  const [breathingDuration, setBreathingDuration] = useState(120)
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [predictions, setPredictions] = useState(null)

  const stressQuestions = [
    {
      id: 'academicPressure',
      question: 'How much academic pressure do you feel?',
      description: 'Rate your current academic workload and deadlines'
    },
    {
      id: 'examAnxiety',
      question: 'How anxious do you feel about upcoming exams?',
      description: 'Rate your exam-related stress and worry'
    },
    {
      id: 'timeManagement',
      question: 'How well are you managing your time?',
      description: 'Rate your ability to balance studies and personal time'
    },
    {
      id: 'peerComparison',
      question: 'How often do you compare yourself to peers?',
      description: 'Rate how social comparison affects your stress levels'
    },
    {
      id: 'futureUncertainty',
      question: 'How uncertain do you feel about your future?',
      description: 'Rate your anxiety about career and life goals'
    },
    {
      id: 'sleepQuality',
      question: 'How would you rate your sleep quality?',
      description: 'Rate how well you sleep and recover'
    },
    {
      id: 'copingMechanisms',
      question: 'How effective are your current coping strategies?',
      description: 'Rate your ability to handle stress when it arises'
    }
  ]

  const handleSliderChange = (questionId, value) => {
    setStressData(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }))
  }

  // Breathing exercise timer effect
  useEffect(() => {
    let interval = null
    if (isBreathing && breathingTime > 0) {
      interval = setInterval(() => {
        setBreathingTime(time => {
          if (time <= 1) {
            setIsBreathing(false)
            alert('Breathing exercise completed! How do you feel?')
            return breathingDuration
          }
          return time - 1
        })
      }, 1000)
    } else if (!isBreathing) {
      setBreathingTime(breathingDuration)
    }
    return () => clearInterval(interval)
  }, [isBreathing, breathingTime, breathingDuration])

  const calculateStressLevel = () => {
    const total = Object.values(stressData).reduce((sum, value) => sum + value, 0)
    return Math.round((total / 56) * 100) // Max score is 56 (7 questions * 8 max)
  }

  const nextStep = () => {
    if (currentStep < stressQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setStressLevel(calculateStressLevel())
      setShowResults(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const startBreathing = () => {
    setIsBreathing(true)
  }

  const stopBreathing = () => {
    setIsBreathing(false)
    setBreathingTime(breathingDuration)
  }

  const formatBreathingTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async () => {
    // Validate that all questions are answered
    const requiredFields = ['academicPressure', 'examAnxiety', 'timeManagement', 'peerComparison', 'futureUncertainty', 'sleepQuality', 'copingMechanisms']
    const missingFields = requiredFields.filter(field => !stressData[field] || stressData[field] < 1 || stressData[field] > 8)

    if (missingFields.length > 0) {
      alert(`Please answer all questions before submitting. Missing: ${missingFields.join(', ')}`)
      return
    }

    setIsSubmitting(true)
    try {
      const submissionData = {
        ...stressData,
        stressLevel,
        timestamp: new Date()
      }

      console.log('Submitting stress data:', submissionData)
      const response = await apiService.post('/student/stress', submissionData)

      if (response.predictions) {
        setPredictions(response.predictions)
      }

      alert('Stress assessment submitted successfully!')
    } catch (error) {
      console.error('Error submitting stress data:', error)
      alert(`Failed to submit assessment: ${error.message || 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStressLevelColor = (level) => {
    if (level < 30) return 'text-green-600'
    if (level < 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStressLevelLabel = (level) => {
    if (level < 30) return 'Low Stress'
    if (level < 60) return 'Moderate Stress'
    return 'High Stress'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">📚</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Academic Stress & Exam Anxiety Management
            </h1>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light leading-relaxed">
              Take control of your academic stress with our comprehensive assessment and personalized coping strategies.
            </p>
          </div>

          {!showResults ? (
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-pink-100/50">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-pink-800">
                    Question {currentStep + 1} of {stressQuestions.length}
                  </span>
                  <div className="flex space-x-2">
                    {stressQuestions.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index <= currentStep ? 'bg-pink-500' : 'bg-pink-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-pink-800 mb-2">
                    {stressQuestions[currentStep].question}
                  </h3>
                  <p className="text-pink-600">{stressQuestions[currentStep].description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-pink-600">Not at all</span>
                    <span className="text-sm text-pink-600">Extremely</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={stressData[stressQuestions[currentStep].id]}
                    onChange={(e) => handleSliderChange(stressQuestions[currentStep].id, e.target.value)}
                    className="w-full h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-pink-500 mt-2">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                    <span>8</span>
                  </div>
                  <div className="text-center mt-4">
                    <span className="text-2xl font-bold text-pink-700">
                      {stressData[stressQuestions[currentStep].id]}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-6 py-3 bg-pink-100 text-pink-700 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-200 transition-all duration-300"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    {currentStep === stressQuestions.length - 1 ? 'See Results' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Stress Level Meter */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-3xl font-bold text-pink-800 mb-6 text-center">Your Stress Assessment</h2>

                <div className="text-center mb-8">
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#f3f4f6"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#ec4899"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - stressLevel / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-pink-700">{stressLevel}%</div>
                        <div className={`text-lg font-semibold ${getStressLevelColor(stressLevel)}`}>
                          {getStressLevelLabel(stressLevel)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {predictions && (
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-pink-800 mb-4">AI Recommendations</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">🧠</span>
                        <div>
                          <p className="font-semibold text-pink-800">Predicted Stress Level: {predictions.stressLevel}</p>
                          <p className="text-pink-600">{predictions.advice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={() => setShowResults(false)}
                    className="px-6 py-3 bg-pink-100 text-pink-700 rounded-xl font-semibold hover:bg-pink-200 transition-all duration-300 mr-4"
                  >
                    Retake Assessment
                  </button>
                </div>
              </div>

              {/* Breathing Exercise */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-3xl font-bold text-pink-800 mb-6 text-center">Breathing Exercise</h2>

                <div className="text-center mb-8">
                  <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center text-white text-6xl transition-all duration-3000 ${
                    isBreathing ? 'animate-pulse scale-110' : 'scale-100'
                  }`}>
                    {isBreathing ? '🌬️' : '🫁'}
                  </div>

                  {isBreathing && (
                    <div className="mt-4 mb-4">
                      <div className="text-3xl font-mono text-pink-700 font-bold">
                        {formatBreathingTime(breathingTime)}
                      </div>
                      <div className="w-full bg-pink-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${((breathingDuration - breathingTime) / breathingDuration) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <p className="text-pink-600 mt-4">
                    {isBreathing ? 'Breathe in... hold... breathe out...' : 'Click below to start a breathing exercise'}
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <label className="text-pink-700 font-semibold">Duration:</label>
                    <select
                      value={breathingDuration}
                      onChange={(e) => {
                        const newDuration = parseInt(e.target.value)
                        setBreathingDuration(newDuration)
                        setBreathingTime(newDuration)
                      }}
                      disabled={isBreathing}
                      className="px-3 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value={60}>1 minute</option>
                      <option value={120}>2 minutes</option>
                      <option value={180}>3 minutes</option>
                      <option value={300}>5 minutes</option>
                    </select>
                  </div>

                  <div className="flex justify-center space-x-4">
                    {!isBreathing ? (
                      <button
                        onClick={startBreathing}
                        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        Start Breathing Exercise
                      </button>
                    ) : (
                      <button
                        onClick={stopBreathing}
                        className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        Stop Exercise
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stress Journal */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-3xl font-bold text-pink-800 mb-6 text-center">Stress Journal</h2>

                <div className="mb-6">
                  <label className="block text-lg font-semibold text-pink-800 mb-3">
                    What's causing you stress today? How are you feeling?
                  </label>
                  <textarea
                    value={stressData.journalEntry}
                    onChange={(e) => setStressData(prev => ({ ...prev, journalEntry: e.target.value }))}
                    placeholder="Write about your thoughts, feelings, and any specific stressors..."
                    className="w-full h-32 p-4 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ManageStressPage
