import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiService from '../services/api'

const MentalAwarenessPage = () => {
  const [resources, setResources] = useState([])
  const [currentMyth, setCurrentMyth] = useState(0)
  const [expandedCard, setExpandedCard] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const mythsVsFacts = [
    {
      myth: 'Mental health issues only affect "weak" people',
      fact: 'Mental health challenges can affect anyone, regardless of strength, intelligence, or background. They\'re medical conditions influenced by genetics, environment, and life experiences.',
      icon: '💪'
    },
    {
      myth: 'Students with mental health issues can\'t succeed academically',
      fact: 'Many successful professionals, leaders, and academics have managed mental health conditions while achieving their goals. With proper support, you can thrive.',
      icon: '🎓'
    },
    {
      myth: 'Therapy is only for people with "serious" problems',
      fact: 'Everyone can benefit from therapy! It\'s a tool for personal growth, stress management, and improving relationships - not just crisis intervention.',
      icon: '🗣️'
    },
    {
      myth: 'Mental health problems will ruin your career prospects',
      fact: 'Most employers value emotional intelligence and resilience. Many successful companies actively support employee mental health and offer accommodations.',
      icon: '🚀'
    },
    {
      myth: 'If you take medication for mental health, you\'ll be dependent forever',
      fact: 'Many people take medication temporarily while building coping skills. Others benefit from long-term medication management, just like with physical health conditions.',
      icon: '💊'
    }
  ]

  const educationalCards = [
    {
      title: 'Understanding Anxiety',
      content: 'Anxiety is your body\'s natural response to stress, but when it becomes overwhelming, it can interfere with daily life. Common signs include excessive worry, restlessness, and physical symptoms like rapid heartbeat.',
      tips: [
        'Practice deep breathing exercises',
        'Challenge negative thought patterns',
        'Maintain a consistent sleep schedule',
        'Limit caffeine and sugar intake'
      ],
      icon: '😰',
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Recognizing Depression',
      content: 'Depression affects how you feel, think, and handle daily activities. It\'s more than just feeling sad - it can impact sleep, appetite, energy levels, and concentration.',
      tips: [
        'Establish a daily routine',
        'Exercise regularly (even 10 minutes helps)',
        'Connect with supportive friends/family',
        'Consider professional help if symptoms persist'
      ],
      icon: '😢',
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Managing Stress',
      content: 'Stress is normal, but chronic stress can affect your physical and mental health. Academic pressure, social expectations, and life changes are common triggers for students.',
      tips: [
        'Break large tasks into smaller steps',
        'Practice time management techniques',
        'Take regular breaks during study sessions',
        'Engage in hobbies and relaxation activities'
      ],
      icon: '😅',
      color: 'from-orange-400 to-orange-600'
    },
    {
      title: 'Building Resilience',
      content: 'Resilience is your ability to bounce back from challenges. It\'s a skill that can be developed through practice and doesn\'t mean you won\'t experience difficulties.',
      tips: [
        'Focus on what you can control',
        'Practice self-compassion',
        'Build a support network',
        'Learn from past experiences'
      ],
      icon: '🌱',
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'Sleep & Mental Health',
      content: 'Poor sleep and mental health issues often go hand-in-hand. Sleep deprivation can worsen anxiety and depression, while mental health challenges can disrupt sleep patterns.',
      tips: [
        'Aim for 7-9 hours of sleep per night',
        'Maintain a consistent sleep schedule',
        'Create a relaxing bedtime routine',
        'Limit screen time before bed'
      ],
      icon: '😴',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      title: 'Seeking Help',
      content: 'Asking for help is a sign of strength, not weakness. There are many types of support available, from friends and family to professional counseling services.',
      tips: [
        'Talk to trusted friends or family',
        'Contact your university counseling center',
        'Consider speaking with a healthcare provider',
        'Use campus mental health resources'
      ],
      icon: '🤝',
      color: 'from-teal-400 to-teal-600'
    }
  ]

  const emergencyResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      contact: '988',
      description: '24/7 free and confidential emotional support',
      icon: '📞'
    },
    {
      name: 'Crisis Text Line',
      contact: 'Text HOME to 741741',
      description: 'Free 24/7 support via text message',
      icon: '💬'
    },
    {
      name: 'International Association for Suicide Prevention',
      contact: 'Find local resources at iasp.info',
      description: 'Global network of suicide prevention organizations',
      icon: '🌍'
    }
  ]

  const campusResources = [
    {
      type: 'Counseling Center',
      description: 'Professional counseling services for students',
      availability: 'Usually Monday-Friday, 9AM-5PM',
      icon: '🏥'
    },
    {
      type: 'Peer Support Groups',
      description: 'Student-led support groups for various mental health concerns',
      availability: 'Weekly meetings, check student services',
      icon: '👥'
    },
    {
      type: 'Academic Support',
      description: 'Tutoring, study skills workshops, and academic accommodations',
      availability: 'Various hours throughout the week',
      icon: '📚'
    },
    {
      type: 'Wellness Programs',
      description: 'Yoga, meditation, stress management workshops',
      availability: 'Regular classes and events',
      icon: '🧘'
    }
  ]

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await apiService.get('/student/resources')
      setResources(response.resources || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
      // Use default resources if API fails
    } finally {
      setIsLoading(false)
    }
  }

  const nextMyth = () => {
    setCurrentMyth((prev) => (prev + 1) % mythsVsFacts.length)
  }

  const prevMyth = () => {
    setCurrentMyth((prev) => (prev - 1 + mythsVsFacts.length) % mythsVsFacts.length)
  }

  const toggleCardExpansion = (cardIndex) => {
    setExpandedCard(expandedCard === cardIndex ? null : cardIndex)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">🧠</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Mental Health Awareness & Education
            </h1>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light leading-relaxed">
              Knowledge is power. Understanding mental health helps you recognize when you or others need support.
            </p>
          </div>

          {/* Myths vs Facts */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-pink-100/50">
            <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">Myths vs Facts</h2>

            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{mythsVsFacts[currentMyth].icon}</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-red-800 mb-3">Myth</h3>
                    <p className="text-red-700">{mythsVsFacts[currentMyth].myth}</p>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-3">Fact</h3>
                    <p className="text-green-700">{mythsVsFacts[currentMyth].fact}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={prevMyth}
                  className="px-6 py-3 bg-pink-100 text-pink-700 rounded-xl font-semibold hover:bg-pink-200 transition-all duration-300"
                >
                  Previous Myth
                </button>
                <button
                  onClick={nextMyth}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Next Myth
                </button>
              </div>
            </div>
          </div>

          {/* Educational Cards */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">Understanding Mental Health</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educationalCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-xl border border-pink-100/50 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => toggleCardExpansion(index)}
                >
                  <div className={`bg-gradient-to-r ${card.color} p-6 text-white`}>
                    <div className="text-4xl mb-3">{card.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  </div>

                  <div className="p-6">
                    <p className="text-pink-700 mb-4">{card.content}</p>

                    {expandedCard === index && (
                      <div className="border-t border-pink-100 pt-4">
                        <h4 className="font-semibold text-pink-800 mb-3">Helpful Tips:</h4>
                        <ul className="space-y-2">
                          {card.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start space-x-2">
                              <span className="text-pink-500 mt-1">•</span>
                              <span className="text-pink-600 text-sm">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-center mt-4">
                      <button className="text-pink-500 hover:text-pink-700 font-semibold text-sm">
                        {expandedCard === index ? 'Show Less' : 'Learn More'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* When to Seek Help */}
          <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-3xl p-8 mb-12 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">When to Seek Help</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">🚨 Warning Signs</h3>
                  <ul className="space-y-3">
                    <li>• Persistent sadness or hopelessness</li>
                    <li>• Loss of interest in activities you once enjoyed</li>
                    <li>• Significant changes in sleep or appetite</li>
                    <li>• Difficulty concentrating or making decisions</li>
                    <li>• Thoughts of self-harm or suicide</li>
                    <li>• Extreme mood swings</li>
                  </ul>
                </div>

                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">💪 It's Time to Seek Help If</h3>
                  <ul className="space-y-3">
                    <li>• Symptoms interfere with daily functioning</li>
                    <li>• You're experiencing significant distress</li>
                    <li>• Your mental health affects your physical health</li>
                    <li>• You're having trouble managing alone</li>
                    <li>• You're concerned about harming yourself or others</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">🏥 Types of Professional Help</h3>
                  <ul className="space-y-3">
                    <li><strong>Therapy/Counseling:</strong> Talk therapy with licensed professionals</li>
                    <li><strong>Psychiatry:</strong> Medical doctors who can prescribe medication</li>
                    <li><strong>Support Groups:</strong> Peer-led groups for shared experiences</li>
                    <li><strong>Hotlines:</strong> Immediate support for crisis situations</li>
                    <li><strong>Campus Resources:</strong> University-specific mental health services</li>
                  </ul>
                </div>

                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">✨ Remember</h3>
                  <p className="mb-4">
                    Seeking help is a sign of strength, not weakness. Most mental health conditions
                    are highly treatable, and early intervention leads to better outcomes.
                  </p>
                  <p className="text-yellow-200 font-semibold">
                    You're not alone, and help is available.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Resources */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-pink-100/50">
            <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">Emergency Resources</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {emergencyResources.map((resource, index) => (
                <div key={index} className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">{resource.icon}</div>
                  <h3 className="text-lg font-bold text-red-800 mb-2">{resource.name}</h3>
                  <p className="font-semibold text-red-700 mb-2">{resource.contact}</p>
                  <p className="text-red-600 text-sm">{resource.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Resources */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-pink-100/50">
            <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">Campus Mental Health Resources</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campusResources.map((resource, index) => (
                <div key={index} className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{resource.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-pink-800 mb-2">{resource.type}</h3>
                      <p className="text-pink-700 mb-2">{resource.description}</p>
                      <p className="text-sm text-pink-600">
                        <span className="font-semibold">Available:</span> {resource.availability}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Help Resources */}
          <div className="bg-gradient-to-r from-pink-100 to-pink-200 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">Self-Help Resources & Apps</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-lg font-bold text-pink-800 mb-2">Mental Health Apps</h3>
                <ul className="text-sm text-pink-600 space-y-1">
                  <li>• Calm - Meditation & mindfulness</li>
                  <li>• Headspace - Guided meditation</li>
                  <li>• Insight Timer - Free meditation</li>
                  <li>• Moodpath - Mood tracking</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-lg font-bold text-pink-800 mb-2">Helpful Books</h3>
                <ul className="text-sm text-pink-600 space-y-1">
                  <li>• "The Anxiety & Phobia Workbook"</li>
                  <li>• "Feeling Good" by David Burns</li>
                  <li>• "The Happiness Trap"</li>
                  <li>• "Man's Search for Meaning"</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl mb-3">🎵</div>
                <h3 className="text-lg font-bold text-pink-800 mb-2">Music & Podcasts</h3>
                <ul className="text-sm text-pink-600 space-y-1">
                  <li>• "The Mental Illness Happy Hour"</li>
                  <li>• "Where Should We Begin?"</li>
                  <li>• "Hard Fork" (Tech & mental health)</li>
                  <li>• Calming music playlists</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default MentalAwarenessPage
