import React from 'react'

const About = () => {
  return (
    <section id="about" className="py-24 px-4 bg-gradient-to-br from-pink-50/70 to-white/80">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-8">
            What is Mental Wellbeing?
          </h2>
          <p className="text-xl text-pink-600 max-w-4xl mx-auto leading-relaxed font-light">
            Mental wellbeing encompasses our emotional, psychological, and social wellbeing.
            It affects how we think, feel, and behave, and helps determine how we handle stress,
            relate to others, and make choices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-8">
              How We Help You Thrive
            </h3>
            <div className="space-y-8">
              <div className="flex items-start space-x-5 group">
                <div className="bg-gradient-to-br from-pink-200 to-pink-300 p-4 rounded-2xl shadow-soft group-hover:shadow-lg transition-all duration-300">
                  <span className="text-3xl">🧠</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-pink-800 mb-3 group-hover:text-pink-700 transition-colors">Personalized Support</h4>
                  <p className="text-pink-600 leading-relaxed">Tailored guidance based on your unique needs, background, and goals.</p>
                </div>
              </div>
              <div className="flex items-start space-x-5 group">
                <div className="bg-gradient-to-br from-pink-200 to-pink-300 p-4 rounded-2xl shadow-soft group-hover:shadow-lg transition-all duration-300">
                  <span className="text-3xl">🌱</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-pink-800 mb-3 group-hover:text-pink-700 transition-colors">Holistic Approach</h4>
                  <p className="text-pink-600 leading-relaxed">Combining mindfulness, therapy, journaling, and wellness practices.</p>
                </div>
              </div>
              <div className="flex items-start space-x-5 group">
                <div className="bg-gradient-to-br from-pink-200 to-pink-300 p-4 rounded-2xl shadow-soft group-hover:shadow-lg transition-all duration-300">
                  <span className="text-3xl">🤝</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-pink-800 mb-3 group-hover:text-pink-700 transition-colors">Safe Community</h4>
                  <p className="text-pink-600 leading-relaxed">Connect with others who understand and support your journey.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 p-10 rounded-3xl shadow-xl border border-pink-200/50">
            <div className="text-center">
              <div className="text-7xl mb-6 animate-pulse">💖</div>
              <h4 className="text-2xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-6">
                Your Wellbeing Matters
              </h4>
              <p className="text-pink-700 leading-relaxed font-light">
                Every person deserves to feel supported, understood, and empowered.
                We're committed to providing compassionate care that honors your unique
                experiences and helps you build resilience and joy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
