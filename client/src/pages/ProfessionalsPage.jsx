import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const ProfessionalsPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      {/* Welcoming Message Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-6">
            Your Professional Journey Matters
          </h1>
          <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light leading-relaxed">
            In the midst of deadlines, meetings, and career ambitions, remember that your well-being
            is the foundation of your success. You're not just a professional - you're a whole person
            deserving of balance, respect, and care. Take a moment to breathe and prioritize yourself.
          </p>
        </div>
      </section>

      {/* Tell Us More About Your Work Life Card */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
            <div className="text-center">
              <div className="text-6xl mb-6">💼</div>
              <h3 className="text-3xl font-bold text-pink-800 mb-4">
                Tell Us More About Your Work Life & Well-being
              </h3>
              <p className="text-lg text-pink-600 mb-8 leading-relaxed">
                Help us understand your professional routine, current challenges, and aspirations
                so we can provide tailored support to help you thrive both at work and in life.
              </p>
              <button
                onClick={() => navigate('/professionals/share')}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Share Your Experience
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Mental Health Information Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Professional Mental Health & Wellness
            </h2>
            <p className="text-xl text-pink-600 font-light">
              Understanding and managing the unique challenges of professional life for sustainable success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Workplace Stress & Burnout */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🔥</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Workplace Stress & Burnout</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Recognize the signs of burnout and learn sustainable strategies to manage workplace stress while maintaining productivity and health.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Prevent Burnout
              </button>
            </div>

            {/* Work-Life Balance & Time Boundaries */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">⚖️</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Work-Life Balance & Time Boundaries</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Set healthy boundaries between work and personal life. Discover techniques to disconnect, recharge, and maintain meaningful relationships.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Set Boundaries
              </button>
            </div>

            {/* Career Stagnation & Imposter Syndrome */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🎭</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Career Stagnation & Imposter Syndrome</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Overcome feelings of being a "fraud" and navigate career plateaus. Build genuine confidence and explore new professional growth opportunities.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Build Confidence
              </button>
            </div>

            {/* Job Insecurity & Performance Anxiety */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">💭</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Job Insecurity & Performance Anxiety</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Cope with uncertainty in the workplace and manage performance-related anxiety. Focus on what you can control and build resilience.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Manage Anxiety
              </button>
            </div>

            {/* Emotional Exhaustion & Lack of Motivation */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">😔</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Emotional Exhaustion & Lack of Motivation</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Reconnect with your inner drive and address emotional fatigue. Discover ways to reignite passion for your work and personal life.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Rekindle Motivation
              </button>
            </div>

            {/* Leadership Stress & Team Dynamics */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">👔</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Leadership Stress & Team Dynamics</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Navigate the challenges of leadership roles and team management. Build healthy workplace relationships and lead with empathy.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Lead with Care
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Professional Chatbot Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Your Professional Wellness Advisor
            </h2>
            <p className="text-xl text-pink-600 font-light">
              A confidential space to discuss workplace challenges and receive professional, supportive guidance
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
            <div className="text-center">
              <div className="text-6xl mb-6">🤝</div>
              <h3 className="text-3xl font-bold text-pink-800 mb-4">
                Professional Support Chatbot
              </h3>
              <p className="text-lg text-pink-600 mb-8 leading-relaxed">
                Whether it's career decisions, workplace conflicts, stress management, or work-life balance -
                I'm here to listen and provide thoughtful guidance. Your professional success and personal
                well-being both matter, and finding harmony between them is achievable.
              </p>
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl">🔒</span>
                  <span className="text-lg font-semibold text-pink-800">Confidential & Professional</span>
                </div>
                <p className="text-pink-600">
                  Our conversations are completely private. Get personalized advice on career development,
                  stress management, productivity techniques, and maintaining work-life harmony.
                </p>
              </div>
              <button
                onClick={() => navigate('/professionals/chat')}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
              >
                Start Professional Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Support Resources */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Professional Support Resources & Programs
            </h2>
            <p className="text-xl text-pink-600 font-light">
              Discover resources designed to support your professional growth and mental well-being
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Employee Assistance Programs */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🏢</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Employee Assistance Programs (EAP)</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Confidential counseling, financial advice, legal support, and work-life resources provided by employers for employee well-being.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Access EAP
              </button>
            </div>

            {/* Mental Health Benefits & Insurance */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🛡️</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Mental Health Benefits & Insurance</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Coverage for therapy, counseling, and mental health treatment through employer-sponsored health insurance plans.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Check Coverage
              </button>
            </div>

            {/* Government Labor Welfare Schemes */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🏛️</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Government Labor Welfare Schemes</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Maternity leave, workmen's compensation, skill development programs, and other labor welfare initiatives for working professionals.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Explore Benefits
              </button>
            </div>

            {/* Skill Upskilling & Career Transition */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">📈</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Skill Upskilling & Career Transition</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Professional development programs, online courses, career counseling, and support for changing career paths or industries.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Advance Your Career
              </button>
            </div>

            {/* Burnout Recovery & Wellness Initiatives */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🌿</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Burnout Recovery & Wellness Initiatives</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Mindfulness programs, wellness workshops, stress management training, and recovery support for professional burnout.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Recover & Thrive
              </button>
            </div>

            {/* Workplace Diversity & Inclusion */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🤝</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Workplace Diversity & Inclusion</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Resources for creating inclusive workplaces, bias training, mentorship programs, and support for underrepresented professionals.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Foster Inclusion
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final Message and Beautiful Header */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Success Without Sacrifice
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto font-light leading-relaxed">
              Your professional achievements don't have to come at the cost of your health, relationships,
              or happiness. True success is sustainable - it includes balance, fulfillment, and the freedom
              to be your authentic self both at work and beyond.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-6xl mb-6">⚖️</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Your Balanced Future Awaits
            </h3>
            <p className="text-lg text-pink-100 mb-8 leading-relaxed">
              Every boundary you set, every moment of self-care you prioritize, every "no" you say to protect
              your well-being - these are the foundations of genuine professional fulfillment. You deserve
              a career that supports your growth while honoring who you are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-pink-700 hover:bg-pink-50 py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Achieve Balance
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-pink-700 py-4 px-8 rounded-2xl font-semibold transition-all duration-300">
                Share Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfessionalsPage
