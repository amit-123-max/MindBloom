import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const GeneralPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      {/* Welcoming Message Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-6">
            Welcome to a Space for Everyone
          </h1>
          <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light leading-relaxed">
            Life's experiences are as unique as each person living them. Whether you're navigating
            familiar paths or charting your own course, this space exists to offer gentle support,
            understanding, and resources for your mental well-being journey.
          </p>
        </div>
      </section>

      {/* Informational Card Section */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
            <div className="text-center">
              <div className="text-6xl mb-6">🤝</div>
              <h3 className="text-3xl font-bold text-pink-800 mb-4">
                A Space Without Assumptions
              </h3>
              <p className="text-lg text-pink-600 mb-8 leading-relaxed">
                Here, you'll find support, clarity, and resources designed to meet you where you are -
                without labels, expectations, or the need to share your personal story. This space is
                simply here to offer gentle guidance and understanding for whatever you're experiencing.
              </p>
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6">
                <p className="text-pink-600 italic">
                  "Your well-being matters, and you're welcome here just as you are."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Broad Mental Health Theme Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Finding Your Way Through Life's Moments
            </h2>
            <p className="text-xl text-pink-600 font-light">
              Gentle guidance for common experiences that many people navigate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feeling Overwhelmed or Emotionally Drained */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🌊</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Feeling Overwhelmed</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                When life's demands feel like too much, remember that it's okay to pause and breathe.
                Small moments of stillness can help restore your sense of calm and clarity.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Find Calm
              </button>
            </div>

            {/* Managing Loneliness or Lack of Connection */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🌙</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Moments of Loneliness</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Connection is important, yet sometimes we all experience feelings of isolation.
                Consider reaching out in small ways, and remember that these feelings can be temporary.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Connect Gently
              </button>
            </div>

            {/* Navigating Life Transitions and Uncertainty */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🌅</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Life Transitions</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Change, whether expected or unexpected, can bring uncertainty. Allow yourself time to
                adjust, and know that it's normal to feel unsettled during times of transition.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Navigate Change
              </button>
            </div>

            {/* Finding Balance Between Responsibilities */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">⚖️</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Daily Balance</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Balancing responsibilities with self-care can feel challenging. Consider what truly matters
                to you and explore gentle ways to create space for both obligations and rest.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Create Balance
              </button>
            </div>

            {/* Building Emotional Resilience */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🌱</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Building Resilience</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Life brings both challenges and growth. Emotional resilience develops over time through
                self-compassion and the recognition that difficulties don't define your worth.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Grow Stronger
              </button>
            </div>

            {/* Developing Self-Awareness */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🪷</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Self-Awareness</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Understanding yourself better is a gentle journey, not a requirement. When you're ready,
                exploring your thoughts and feelings can bring valuable insights and peace.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Explore Within
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Supportive AI Chatbot Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              A Gentle Space for Conversation
            </h2>
            <p className="text-xl text-pink-600 font-light">
              An open, pressure-free space to share what's on your mind or simply be heard
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
            <div className="text-center">
              <div className="text-6xl mb-6">💭</div>
              <h3 className="text-3xl font-bold text-pink-800 mb-4">
                Supportive Conversation Partner
              </h3>
              <p className="text-lg text-pink-600 mb-8 leading-relaxed">
                This space is here for you whenever you need it - whether you want to talk about your day,
                explore your thoughts, or simply have someone listen. There's no pressure to share anything
                specific, and no expectations about where our conversation might go.
              </p>
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl">🌸</span>
                  <span className="text-lg font-semibold text-pink-800">Gentle & Accepting</span>
                </div>
                <p className="text-pink-600">
                  Here, you'll find grounding exercises, reflective prompts, and emotional support for
                  whatever you're experiencing. Your feelings are valid, and you're worthy of care and understanding.
                </p>
              </div>
              <button
                onClick={() => navigate('/general/chat')}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
              >
                Start a Gentle Conversation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Cards */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Available Support Resources
            </h2>
            <p className="text-xl text-pink-600 font-light">
              Helpful services and initiatives for emotional well-being
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mental Health Helplines */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">📞</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Mental Health Helplines</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                24/7 confidential support services for emotional well-being, crisis intervention, and mental health guidance.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Get Support
              </button>
            </div>

            {/* Public Support Services */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🏛️</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Public Support Services</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Community-based counseling, support groups, and wellness programs available through public health services.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Find Services
              </button>
            </div>

            {/* Emotional Well-being Initiatives */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🌟</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Wellness Awareness</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Public health campaigns, educational resources, and community initiatives focused on mental health awareness and prevention.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Message and Minimal Footer */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            You're Not Alone in This Journey
          </h3>
          <p className="text-lg text-pink-100 mb-8 leading-relaxed">
            Life brings many experiences, and it's okay to seek support, take breaks, and care for your emotional well-being.
            You are worthy of compassion, understanding, and the space to navigate your path at your own pace.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <p className="text-pink-100 italic text-lg">
              "In the gentle space between acceptance and action lies the possibility of healing."
            </p>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-pink-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-pink-200 text-sm">© 2024 Mental Wellness Hub. Supporting your journey.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-pink-200 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-pink-200 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-pink-200 hover:text-white text-sm transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GeneralPage
