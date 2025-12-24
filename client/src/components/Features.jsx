import React from 'react'
import { useNavigate } from 'react-router-dom'

const Features = () => {
  const navigate = useNavigate()

  const features = [
    {
      id: 'diary',
      title: 'My Diary',
      subtitle: 'Daily Journal Writing',
      description: 'Express your thoughts, track your emotions, and reflect on your journey with guided journaling prompts.',
      icon: '📓',
      benefits: ['Guided prompts', 'Mood tracking', 'Private & secure', 'Progress insights'],
      gradient: 'from-pink-100 via-pink-50 to-white',
      route: '/my-diary'
    },
    {
      id: 'peace',
      title: 'Peace',
      subtitle: 'Yoga & Meditation',
      description: 'Find inner calm with personalized yoga flows and meditation sessions designed for mental wellbeing.',
      icon: '🧘‍♀️',
      benefits: ['Guided meditations', 'Yoga sequences', 'Breathing exercises', 'Sleep stories'],
      gradient: 'from-pink-50 via-white to-pink-25'
    },
    {
      id: 'album',
      title: 'My Album',
      subtitle: 'Photos & Videos',
      description: 'Create meaningful memories with your personal collection of photos and videos that bring you joy.',
      icon: '📸',
      benefits: ['Photo journaling', 'Memory collections', 'Gratitude galleries', 'Progress timelines'],
      gradient: 'from-white via-pink-25 to-pink-50',
      route: '/my-album'
    },
    {
      id: 'healthcare',
      title: 'Health Care',
      subtitle: 'Health Prediction Hub',
      description: 'Access our comprehensive health prediction tools including stress assessment, diabetes prediction, and heart health monitoring.',
      icon: '🏥',
      benefits: ['Multiple assessments', 'AI predictions', 'Health insights', 'Risk evaluation'],
      gradient: 'from-pink-50 via-pink-100 to-pink-50',
      route: '/health-predictions'
    }
  ]

  const handleCardClick = (feature) => {
    if (feature.route) {
      navigate(feature.route)
    }
  }

  return (
    <section id="features" className="py-24 px-4 bg-gradient-to-br from-pink-25 via-white to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-8">
            Your Wellness Toolkit
          </h2>
          <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light">
            Discover tools and resources designed to support your mental wellbeing
            journey with compassion and care.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-pink-100/50 overflow-hidden group"
              onClick={() => handleCardClick(feature)}
            >
              <div className={`p-10 bg-gradient-to-br ${feature.gradient}`}>
                <div className="flex items-start space-x-6 mb-8">
                  <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-2">{feature.title}</h3>
                    <p className="text-pink-500 font-medium text-lg">{feature.subtitle}</p>
                  </div>
                </div>
                <p className="text-pink-700 text-lg leading-relaxed mb-8 font-light">{feature.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {feature.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3 group/item">
                      <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                      <span className="text-sm text-pink-600 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent the card's onClick from firing
                    handleCardClick(feature)
                  }}
                >
                  Explore {feature.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
