import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiService from '../services/api'

const ConfidencePage = () => {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [reflections, setReflections] = useState({})
  const [anonymousJournal, setAnonymousJournal] = useState('')
  const [currentAffirmation, setCurrentAffirmation] = useState(0)
  const [comparisonThoughts, setComparisonThoughts] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [predictions, setPredictions] = useState(null)

  const reflectionPrompts = [
    {
      id: 'strengths',
      prompt: 'What are 3 things you do well that make you unique?',
      placeholder: 'I excel at understanding complex concepts, I\'m empathetic towards others, I have great organizational skills...'
    },
    {
      id: 'achievements',
      prompt: 'List 5 achievements from the past year that you\'re proud of',
      placeholder: 'Completed a challenging course, helped a friend through a difficult time, learned a new skill...'
    },
    {
      id: 'challenges',
      prompt: 'What challenges have you overcome that show your resilience?',
      placeholder: 'Dealt with exam anxiety, balanced multiple responsibilities, adapted to online learning...'
    },
    {
      id: 'growth',
      prompt: 'How have you grown as a person in the last 6 months?',
      placeholder: 'I\'ve become more confident in expressing my opinions, I\'ve learned to ask for help when needed...'
    },
    {
      id: 'support',
      prompt: 'Who in your life believes in you and supports your dreams?',
      placeholder: 'My family, my best friend, my professor, my mentor...'
    }
  ]

  const affirmations = [
    'I am capable of achieving my academic goals',
    'My worth is not determined by grades or comparisons',
    'I bring unique value and perspective to my studies',
    'I am resilient and can overcome academic challenges',
    'My efforts and dedication matter more than perfection',
    'I am deserving of success and happiness',
    'My voice and opinions are valuable',
    'I learn and grow from every experience',
    'I am worthy of respect and kindness',
    'My future is bright and full of possibilities'
  ]

  const detoxTips = [
    {
      title: 'Limit Social Media Time',
      description: 'Set specific times for checking social media and stick to them. Consider a "social media detox" day.',
      icon: '📱'
    },
    {
      title: 'Focus on Your Journey',
      description: 'Remember that everyone\'s path is different. Your timeline doesn\'t have to match anyone else\'s.',
      icon: '🎯'
    },
    {
      title: 'Celebrate Small Wins',
      description: 'Acknowledge and celebrate your daily achievements, no matter how small they seem.',
      icon: '🎉'
    },
    {
      title: 'Practice Gratitude',
      description: 'Each day, write down 3 things you\'re grateful for about yourself and your life.',
      icon: '🙏'
    },
    {
      title: 'Set Personal Goals',
      description: 'Focus on goals that matter to you personally, not what others expect or achieve.',
      icon: '📝'
    },
    {
      title: 'Limit Negative Self-Talk',
      description: 'When you catch yourself comparing unfavorably, consciously replace it with a positive affirmation.',
      icon: '💭'
    }
  ]

  const handleReflectionChange = (promptId, value) => {
    setReflections(prev => ({
      ...prev,
      [promptId]: value
    }))
  }

  const nextPrompt = () => {
    if (currentPrompt < reflectionPrompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
    }
  }

  const prevPrompt = () => {
    if (currentPrompt > 0) {
      setCurrentPrompt(currentPrompt - 1)
    }
  }

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length)
  }

  const handleSubmit = async () => {
    // Validate that at least one reflection is completed
    const completedReflections = Object.values(reflections).filter(reflection => reflection.trim().length > 0)

    if (completedReflections.length === 0) {
      alert('Please complete at least one reflection prompt before submitting.')
      return
    }

    setIsSubmitting(true)
    try {
      const confidenceData = {
        reflections,
        anonymousJournal: anonymousJournal.trim(),
        comparisonThoughts: comparisonThoughts.trim(),
        timestamp: new Date()
      }

      console.log('Submitting confidence data:', confidenceData)
      const response = await apiService.post('/student/confidence', confidenceData)

      if (response.predictions) {
        setPredictions(response.predictions)
      }

      alert('Confidence building session saved successfully!')
    } catch (error) {
      console.error('Error submitting confidence data:', error)
      alert(`Failed to save session: ${error.message || 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">👥</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Peer Pressure & Social Comparison Detox
            </h1>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light leading-relaxed">
              Build authentic confidence by focusing on your unique journey and celebrating your individual strengths.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reflection Prompts */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-2xl font-bold text-pink-800 mb-6">Self-Reflection Journey</h2>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-pink-800">
                      Prompt {currentPrompt + 1} of {reflectionPrompts.length}
                    </span>
                    <div className="flex space-x-2">
                      {reflectionPrompts.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index <= currentPrompt ? 'bg-pink-500' : 'bg-pink-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-pink-800 mb-3">
                      {reflectionPrompts[currentPrompt].prompt}
                    </h3>
                    <textarea
                      value={reflections[reflectionPrompts[currentPrompt].id] || ''}
                      onChange={(e) => handleReflectionChange(reflectionPrompts[currentPrompt].id, e.target.value)}
                      placeholder={reflectionPrompts[currentPrompt].placeholder}
                      className="w-full h-32 p-4 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevPrompt}
                      disabled={currentPrompt === 0}
                      className="px-6 py-3 bg-pink-100 text-pink-700 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-200 transition-all duration-300"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextPrompt}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      {currentPrompt === reflectionPrompts.length - 1 ? 'Complete' : 'Next'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Confidence Affirmations */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-2xl font-bold text-pink-800 mb-6">Daily Affirmations</h2>

                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">✨</div>
                  <blockquote className="text-xl font-semibold text-pink-700 italic mb-6">
                    "{affirmations[currentAffirmation]}"
                  </blockquote>
                  <p className="text-pink-600">Repeat this affirmation throughout your day</p>
                </div>

                <div className="text-center">
                  <button
                    onClick={nextAffirmation}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Next Affirmation
                  </button>
                </div>
              </div>
            </div>

            {/* Anonymous Journaling & Comparison Detox */}
            <div className="space-y-8">
              {/* Anonymous Journaling */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-2xl font-bold text-pink-800 mb-6">Anonymous Journaling Space</h2>

                <div className="mb-4">
                  <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <p className="font-semibold text-pink-800">Completely Private & Anonymous</p>
                        <p className="text-pink-600 text-sm">Your thoughts are safe here. Write freely without judgment.</p>
                      </div>
                    </div>
                  </div>

                  <textarea
                    value={anonymousJournal}
                    onChange={(e) => setAnonymousJournal(e.target.value)}
                    placeholder="Write about your fears, insecurities, or anything weighing on your mind. This space is just for you..."
                    className="w-full h-40 p-4 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Comparison Detox */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-2xl font-bold text-pink-800 mb-6">Comparison Detox</h2>

                <div className="mb-6">
                  <label className="block text-lg font-semibold text-pink-800 mb-3">
                    What comparison thoughts are affecting your confidence today?
                  </label>
                  <textarea
                    value={comparisonThoughts}
                    onChange={(e) => setComparisonThoughts(e.target.value)}
                    placeholder="I'm not as smart as..., I wish I had their grades..., Why can't I be more like..."
                    className="w-full h-32 p-4 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detoxTips.map((tip, index) => (
                    <div key={index} className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{tip.icon}</span>
                        <div>
                          <h4 className="font-semibold text-pink-800 mb-1">{tip.title}</h4>
                          <p className="text-pink-600 text-sm">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Sentiment Analysis */}
              {predictions && (
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                  <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">AI Emotional Insights</h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">💭</span>
                        <div>
                          <p className="font-semibold text-pink-800">Emotional State: {predictions.sentiment}</p>
                          <p className="text-pink-600 text-sm">{predictions.feedback}</p>
                        </div>
                      </div>
                    </div>

                    {predictions.affirmations && predictions.affirmations.length > 0 && (
                      <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4">
                        <h4 className="font-semibold text-pink-800 mb-3">Personalized Affirmations:</h4>
                        <ul className="space-y-2">
                          {predictions.affirmations.map((affirmation, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-pink-500 mt-1">•</span>
                              <span className="text-pink-700 text-sm">{affirmation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Confidence Session'}
                </button>
              </div>
            </div>
          </div>

          {/* Real Talk Section */}
          <div className="mt-16 bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
            <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">Real Talk: You Are Enough</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-pink-800 mb-4">Remember This</h3>
                  <ul className="space-y-3 text-pink-700">
                    <li className="flex items-start space-x-3">
                      <span className="text-pink-500 mt-1">💡</span>
                      <span>Your worth isn't measured by GPAs, social media likes, or comparisons</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-pink-500 mt-1">🌟</span>
                      <span>Everyone's journey is unique - yours included</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-pink-500 mt-1">🎓</span>
                      <span>Your effort, resilience, and growth matter more than perfection</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-pink-800 mb-4">Quick Confidence Boosters</h3>
                  <ul className="space-y-3 text-pink-700">
                    <li className="flex items-start space-x-3">
                      <span className="text-pink-500 mt-1">📝</span>
                      <span>List 3 things you did well today</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-pink-500 mt-1">🤝</span>
                      <span>Help someone else - it builds your own confidence</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-pink-500 mt-1">🚫</span>
                      <span>Unfollow accounts that make you feel inadequate</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-pink-800 mb-4">When Comparison Strikes</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-pink-400 pl-4">
                      <p className="text-pink-700 italic mb-2">"They're better at this than me"</p>
                      <p className="text-pink-600 text-sm">Response: "I have my own unique strengths and timeline"</p>
                    </div>
                    <div className="border-l-4 border-pink-400 pl-4">
                      <p className="text-pink-700 italic mb-2">"I should be further along"</p>
                      <p className="text-pink-600 text-sm">Response: "Progress, not perfection, is the goal"</p>
                    </div>
                    <div className="border-l-4 border-pink-400 pl-4">
                      <p className="text-pink-700 italic mb-2">"Everyone else has it together"</p>
                      <p className="text-pink-600 text-sm">Response: "Everyone has their own struggles and growth areas"</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Your Unique Superpower</h3>
                  <p className="mb-4">
                    You bring something to this world that no one else can. Your experiences,
                    perspectives, and heart make you irreplaceable. Trust your journey and
                    celebrate your authentic self.
                  </p>
                  <div className="text-center">
                    <span className="text-4xl">✨</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ConfidencePage
