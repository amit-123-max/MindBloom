import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiService from '../services/api'

const FuturePlanningPage = () => {
  const [interests, setInterests] = useState({
    creative: 1,
    analytical: 1,
    social: 1,
    practical: 1,
    leadership: 1,
    helping: 1
  })
  const [strengths, setStrengths] = useState('')
  const [careerConcerns, setCareerConcerns] = useState('')
  const [futureAnxiety, setFutureAnxiety] = useState(5)
  const [selectedCareers, setSelectedCareers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [predictions, setPredictions] = useState(null)
  const [showRoadmap, setShowRoadmap] = useState(false)

  const careerOptions = [
    {
      id: 'software-dev',
      title: 'Software Developer',
      description: 'Building applications and solving technical problems',
      skills: ['Programming', 'Problem Solving', 'Creativity'],
      icon: '💻',
      interests: ['analytical', 'creative']
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Analyzing data to find insights and patterns',
      skills: ['Statistics', 'Programming', 'Critical Thinking'],
      icon: '📊',
      interests: ['analytical']
    },
    {
      id: 'doctor',
      title: 'Medical Doctor',
      description: 'Helping people through healthcare and medicine',
      skills: ['Science', 'Empathy', 'Critical Thinking'],
      icon: '🏥',
      interests: ['helping', 'analytical']
    },
    {
      id: 'teacher',
      title: 'Teacher/Educator',
      description: 'Sharing knowledge and inspiring future generations',
      skills: ['Communication', 'Patience', 'Knowledge'],
      icon: '📚',
      interests: ['social', 'helping']
    },
    {
      id: 'entrepreneur',
      title: 'Entrepreneur',
      description: 'Creating businesses and innovative solutions',
      skills: ['Leadership', 'Creativity', 'Risk Taking'],
      icon: '🚀',
      interests: ['leadership', 'creative']
    },
    {
      id: 'designer',
      title: 'Designer',
      description: 'Creating visual and user experiences',
      skills: ['Creativity', 'Attention to Detail', 'Communication'],
      icon: '🎨',
      interests: ['creative']
    },
    {
      id: 'researcher',
      title: 'Research Scientist',
      description: 'Advancing knowledge through scientific research',
      skills: ['Analytical Thinking', 'Curiosity', 'Patience'],
      icon: '🔬',
      interests: ['analytical']
    },
    {
      id: 'counselor',
      title: 'Counselor/Therapist',
      description: 'Supporting mental health and well-being',
      skills: ['Empathy', 'Listening', 'Communication'],
      icon: '💭',
      interests: ['helping', 'social']
    },
    {
      id: 'engineer',
      title: 'Engineer',
      description: 'Designing and building solutions to real-world problems',
      skills: ['Problem Solving', 'Creativity', 'Technical Skills'],
      icon: '⚙️',
      interests: ['practical', 'analytical']
    },
    {
      id: 'journalist',
      title: 'Journalist/Writer',
      description: 'Investigating and communicating important stories',
      skills: ['Writing', 'Research', 'Communication'],
      icon: '✍️',
      interests: ['social', 'creative']
    }
  ]

  const roadmapSteps = [
    {
      phase: 'Foundation (Current)',
      steps: [
        'Complete current coursework with focus',
        'Build study habits and time management',
        'Identify and develop core skills',
        'Seek mentorship and guidance'
      ]
    },
    {
      phase: 'Exploration (Next 6-12 months)',
      steps: [
        'Research potential career paths',
        'Take relevant electives or courses',
        'Gain practical experience through internships',
        'Network with professionals in your field'
      ]
    },
    {
      phase: 'Development (1-2 years)',
      steps: [
        'Develop specialized skills',
        'Build a portfolio or resume',
        'Consider graduate studies if needed',
        'Take on leadership roles in student organizations'
      ]
    },
    {
      phase: 'Launch (2+ years)',
      steps: [
        'Secure entry-level position',
        'Continue learning and skill development',
        'Build professional network',
        'Set long-term career goals'
      ]
    }
  ]

  const handleInterestChange = (interest, value) => {
    setInterests(prev => ({
      ...prev,
      [interest]: parseInt(value)
    }))
  }

  const toggleCareerSelection = (careerId) => {
    setSelectedCareers(prev =>
      prev.includes(careerId)
        ? prev.filter(id => id !== careerId)
        : [...prev, careerId]
    )
  }

  const getAnxietyLevel = (level) => {
    if (level <= 3) return { label: 'Low Anxiety', color: 'text-green-600' }
    if (level <= 7) return { label: 'Moderate Anxiety', color: 'text-yellow-600' }
    return { label: 'High Anxiety', color: 'text-red-600' }
  }

  const getMatchingCareers = () => {
    return careerOptions.filter(career =>
      career.interests.some(interest => interests[interest] >= 4)
    )
  }

  const handleSubmit = async () => {
    // Validate that at least some interests are rated above 1
    const activeInterests = Object.values(interests).filter(rating => rating > 1)

    if (activeInterests.length === 0) {
      alert('Please rate at least one interest above "Not interested" before submitting.')
      return
    }

    if (!strengths.trim()) {
      alert('Please describe your strengths before submitting.')
      return
    }

    if (selectedCareers.length === 0) {
      alert('Please select at least one career that interests you before submitting.')
      return
    }

    setIsSubmitting(true)
    try {
      const careerData = {
        interests,
        strengths: strengths.trim(),
        careerConcerns: careerConcerns.trim(),
        futureAnxiety,
        selectedCareers,
        timestamp: new Date()
      }

      console.log('Submitting career data:', careerData)
      const response = await apiService.post('/student/career', careerData)

      if (response.predictions) {
        setPredictions(response.predictions)
      }

      setShowRoadmap(true)
      alert('Career planning session saved successfully!')
    } catch (error) {
      console.error('Error submitting career data:', error)
      alert(`Failed to save session: ${error.message || 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const anxietyLevel = getAnxietyLevel(futureAnxiety)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Career Uncertainty & Future Planning
            </h1>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light leading-relaxed">
              Turn "what should I do with my life?" into an exciting exploration. Your future is yours to shape.
            </p>
          </div>

          {!showRoadmap ? (
            <div className="space-y-12">
              {/* Interest Assessment */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">Discover Your Interests</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(interests).map(([interest, value]) => (
                    <div key={interest} className="space-y-3">
                      <label className="block text-lg font-semibold text-pink-800 capitalize">
                        {interest.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="1"
                          max="8"
                          value={value}
                          onChange={(e) => handleInterestChange(interest, e.target.value)}
                          className="flex-1 h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-2xl font-bold text-pink-700 min-w-[40px]">{value}</span>
                      </div>
                      <div className="flex justify-between text-xs text-pink-500">
                        <span>Not interested</span>
                        <span>Very interested</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Concerns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                  <h2 className="text-2xl font-bold text-pink-800 mb-6">Your Strengths</h2>
                  <textarea
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    placeholder="What subjects do you excel at? What skills come naturally to you? What do others compliment you on?"
                    className="w-full h-32 p-4 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                  <h2 className="text-2xl font-bold text-pink-800 mb-6">Career Concerns</h2>
                  <textarea
                    value={careerConcerns}
                    onChange={(e) => setCareerConcerns(e.target.value)}
                    placeholder="What worries you about your future? What uncertainties keep you up at night?"
                    className="w-full h-32 p-4 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Future Anxiety Scale */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">Future Anxiety Level</h2>

                <div className="text-center mb-8">
                  <div className="text-4xl mb-4">🌊</div>
                  <p className="text-lg text-pink-600 mb-6">
                    How anxious do you feel about your future career and life path?
                  </p>

                  <div className="max-w-md mx-auto">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={futureAnxiety}
                      onChange={(e) => setFutureAnxiety(parseInt(e.target.value))}
                      className="w-full h-4 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-pink-500 mt-2">
                      <span>Calm & Confident</span>
                      <span>Very Anxious</span>
                    </div>
                    <div className="text-center mt-4">
                      <div className={`text-2xl font-bold ${anxietyLevel.color}`}>
                        {futureAnxiety}/10 - {anxietyLevel.label}
                      </div>
                    </div>
                  </div>
                </div>

                {futureAnxiety > 7 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">💙</span>
                      <div>
                        <p className="font-semibold text-red-800">Remember: Your Future is Flexible</p>
                        <p className="text-red-600 text-sm">
                          It's normal to feel anxious about the future. Remember that most people change careers multiple times,
                          and your path will evolve as you learn more about yourself.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Career Exploration */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">Explore Career Options</h2>

                <div className="mb-6">
                  <p className="text-pink-600 text-center mb-6">
                    Based on your interests, here are some careers that might suit you:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getMatchingCareers().map(career => (
                      <div
                        key={career.id}
                        onClick={() => toggleCareerSelection(career.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedCareers.includes(career.id)
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-pink-200 hover:border-pink-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{career.icon}</div>
                          <h3 className="font-semibold text-pink-800 mb-1">{career.title}</h3>
                          <p className="text-sm text-pink-600 mb-2">{career.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {career.skills.slice(0, 2).map(skill => (
                              <span key={skill} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Creating Your Roadmap...' : 'Create My Career Roadmap'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">Your Personalized Career Roadmap</h2>

                {/* Selected Careers */}
                {selectedCareers.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-pink-800 mb-4">Careers You're Interested In:</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedCareers.map(careerId => {
                        const career = careerOptions.find(c => c.id === careerId)
                        return (
                          <div key={careerId} className="bg-gradient-to-r from-pink-100 to-pink-200 rounded-xl px-4 py-2">
                            <span className="text-pink-800 font-semibold">{career.icon} {career.title}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Roadmap Timeline */}
                <div className="space-y-6">
                  {roadmapSteps.map((phase, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-pink-800 mb-3">{phase.phase}</h3>
                          <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4">
                            <ul className="space-y-2">
                              {phase.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start space-x-3">
                                  <span className="text-pink-500 mt-1">✓</span>
                                  <span className="text-pink-700">{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      {index < roadmapSteps.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-16 bg-pink-300"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* AI Recommendations */}
                {predictions && (
                  <div className="mt-8 bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-pink-800 mb-4">AI Career Insights</h3>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">🎯</span>
                        <div>
                          <p className="font-semibold text-pink-800">Recommended Career Path: {predictions.primaryCareer}</p>
                          <p className="text-pink-600">{predictions.reasoning}</p>
                        </div>
                      </div>

                      {predictions.nextSteps && (
                        <div className="bg-white rounded-xl p-4">
                          <h4 className="font-semibold text-pink-800 mb-3">Immediate Next Steps:</h4>
                          <ul className="space-y-2">
                            {predictions.nextSteps.map((step, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-pink-500 mt-1">•</span>
                                <span className="text-pink-700">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="bg-white rounded-xl p-4">
                        <h4 className="font-semibold text-pink-800 mb-2">Uncertainty Level Assessment:</h4>
                        <p className="text-pink-600">{predictions.uncertaintyAdvice}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowRoadmap(false)}
                    className="px-6 py-3 bg-pink-100 text-pink-700 rounded-xl font-semibold hover:bg-pink-200 transition-all duration-300 mr-4"
                  >
                    Edit Preferences
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                    Download Roadmap
                  </button>
                </div>
              </div>

              {/* Encouragement Section */}
              <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-3xl p-8 text-white text-center">
                <div className="text-6xl mb-6">🌟</div>
                <h2 className="text-3xl font-bold mb-4">Your Future is Bright</h2>
                <p className="text-xl text-pink-100 mb-6 max-w-3xl mx-auto">
                  Remember: Your career path is not a straight line. It's okay to explore,
                  change directions, and discover new passions along the way. The most
                  successful people are often those who embrace uncertainty and keep learning.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl mb-2">🔄</div>
                    <h3 className="font-bold mb-2">It's Normal to Change</h3>
                    <p className="text-pink-100 text-sm">Most people change careers 5-7 times in their lifetime</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl mb-2">📈</div>
                    <h3 className="font-bold mb-2">Skills Transfer</h3>
                    <p className="text-pink-100 text-sm">Your current skills are more valuable than you think</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-2xl mb-2">⏰</div>
                    <h3 className="font-bold mb-2">Take Your Time</h3>
                    <p className="text-pink-100 text-sm">You have decades ahead - there's no rush to decide everything now</p>
                  </div>
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

export default FuturePlanningPage
