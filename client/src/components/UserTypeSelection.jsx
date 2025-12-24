import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserTypeSelection = () => {
  const navigate = useNavigate()

  const userTypes = [
    {
      id: 'lgbt',
      title: 'LGBT+ Community',
      description: 'Specialized support for LGBTQ+ individuals navigating unique challenges and celebrating authentic selves.',
      icon: '🏳️‍🌈',
      color: 'from-pink-400 via-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
      route: '/lgbt-community'
    },
    {
      id: 'women',
      title: 'Women',
      description: 'Empowering women with tools for self-care, boundary-setting, and personal growth.',
      icon: '👩',
      color: 'from-pink-300 via-pink-400 to-pink-500',
      bgColor: 'from-pink-25 to-pink-50',
      route: '/women'
    },
    {
      id: 'students',
      title: 'Students',
      description: 'Academic stress, social pressures, and transition support for students at all levels.',
      icon: '🎓',
      color: 'from-pink-200 via-pink-300 to-pink-400',
      bgColor: 'from-white to-pink-25',
      route: '/students'
    },
    {
      id: 'professionals',
      title: 'Professionals',
      description: 'Work-life balance, career stress management, and professional development support.',
      icon: '💼',
      color: 'from-pink-500 via-pink-600 to-pink-700',
      bgColor: 'from-pink-100 to-pink-200',
      route: '/professionals'
    },
    {
      id: 'others',
      title: 'Everyone Else',
      description: 'Inclusive support for all individuals seeking mental wellness and personal growth.',
      icon: '🌟',
      color: 'from-pink-100 via-pink-200 to-pink-300',
      bgColor: 'from-pink-25 to-pink-50',
      route: '/general'
    }
  ]

  const handleCardClick = (userType) => {
    if (userType.route) {
      navigate(userType.route)
    }
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-white via-pink-25 to-pink-50">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-8">
            Choose Your Path
          </h2>
          <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light">
            Select the community that resonates with you most. Each path offers
            tailored resources and support designed for your unique journey.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal scroll container */}
          <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-8 pb-8 px-4">
            {userTypes.map((type) => (
              <div
                key={type.id}
                className="flex-shrink-0 w-full max-w-sm snap-center group cursor-pointer"
                onClick={() => handleCardClick(type)}
              >
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-pink-100/50 overflow-hidden h-full">
                  <div className={`bg-gradient-to-br ${type.color} p-8 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="relative z-10">
                      <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
                      <h3 className="text-2xl font-bold text-white mb-4 leading-tight">{type.title}</h3>
                    </div>
                  </div>
                  <div className={`p-8 bg-gradient-to-br ${type.bgColor}`}>
                    <p className="text-pink-700 leading-relaxed mb-8 text-lg font-light">{type.description}</p>
                    <button
                      className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCardClick(type)
                      }}
                    >
                      Choose This Path
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {userTypes.map((_, index) => (
              <div
                key={index}
                className="w-3 h-3 rounded-full bg-pink-300 hover:bg-pink-400 transition-colors cursor-pointer"
              ></div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  )
}

export default UserTypeSelection
