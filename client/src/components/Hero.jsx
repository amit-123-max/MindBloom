import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth/AuthContext'

const Hero = () => {
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleStartJourney = () => {
    if (isAuthenticated) {
      navigate('/my-diary') // Redirect to diary if logged in
    } else {
      navigate('/login') // Redirect to login if not logged in
    }
  }

  const handleLearnMore = () => {
    // Scroll to about section
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-8 leading-tight">
            Welcome to Your
            <span className="block bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
              Mental Wellness
            </span>
            Journey
          </h1>
          <p className="text-xl md:text-2xl text-pink-600 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
            Discover peace, strength, and joy within yourself. Your mental wellbeing matters,
            and we're here to support you every step of the way with personalized care and
            gentle guidance.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <button
            onClick={handleStartJourney}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-10 py-5 rounded-full text-lg font-semibold transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            {isAuthenticated ? 'Continue Your Journey' : 'Start Your Journey'}
          </button>
          <button
            onClick={handleLearnMore}
            className="border-2 border-pink-400 text-pink-600 hover:bg-pink-50 hover:border-pink-500 px-10 py-5 rounded-full text-lg font-semibold transition-all duration-500 transform hover:scale-105"
          >
            Learn More
          </button>
        </div>
        <div className="mt-20">
          <div className="flex justify-center space-x-12 text-pink-400">
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl mb-3">🌸</div>
              <div className="text-sm font-medium text-pink-500">Compassionate</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl mb-3">💝</div>
              <div className="text-sm font-medium text-pink-500">Personalized</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-4xl mb-3">🌺</div>
              <div className="text-sm font-medium text-pink-500">Supportive</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
