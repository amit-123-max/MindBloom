import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const WomenPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      {/* Welcoming Message Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-6">
            Welcome to Your Empowerment Journey
          </h1>
          <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light leading-relaxed">
            You're not just surviving, you're thriving. This space is designed exclusively for you -
            to celebrate your strength, address your unique needs, and empower your journey forward.
          </p>
        </div>
      </section>

      {/* Tell Me More About Yourself Card */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
            <div className="text-center">
              <div className="text-6xl mb-6">💕</div>
              <h3 className="text-3xl font-bold text-pink-800 mb-4">
                Tell Me More About Yourself
              </h3>
              <p className="text-lg text-pink-600 mb-8 leading-relaxed">
                Help us understand your journey better so we can provide personalized support,
                resources, and guidance tailored just for you.
              </p>
              <button
                onClick={() => navigate('/women/share')}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Share Your Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Menstrual Health Information Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Menstrual Health & Wellness
            </h2>
            <p className="text-xl text-pink-600 font-light">
              Understanding and managing your menstrual cycle for optimal health and well-being
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cycle Tracking Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">📅</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Cycle Tracking</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Monitor your menstrual cycle patterns, predict periods, and understand your body's natural rhythms.
              </p>
              <button
                onClick={() => navigate('/women/cycle-tracking')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Start Tracking
              </button>
            </div>

            {/* Period Health Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🌸</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Period Health</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Learn about healthy period practices, managing symptoms, and when to seek medical attention.
              </p>
              <button
                onClick={() => navigate('/women/period-health')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Learn More
              </button>
            </div>

            {/* Nutrition & Exercise Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🥗</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Nutrition & Exercise</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Discover foods and exercises that support hormonal balance and menstrual health throughout your cycle.
              </p>
              <button
                onClick={() => navigate('/women/nutrition-exercise')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Get Tips
              </button>
            </div>

            {/* Mental Health Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🧠</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Mental Health</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Address the emotional aspects of menstruation, including mood changes, anxiety, and self-care strategies.
              </p>
              <button
                onClick={() => navigate('/women/mental-health')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Find Support
              </button>
            </div>

            {/* PCOS & Hormonal Health Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🔬</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">PCOS & Hormonal Health</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Information and resources for managing PCOS, hormonal imbalances, and endocrine health concerns.
              </p>
              <button
                onClick={() => navigate('/women/pcos')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Learn About PCOS
              </button>
            </div>

            {/* Reproductive Health Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🏥</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Reproductive Health</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Comprehensive information about fertility, contraception, and maintaining reproductive wellness.
              </p>
              <button
                onClick={() => navigate('/women/reproductive-health')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Explore Options
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Chatbot Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Your Personal Wellness Companion
            </h2>
            <p className="text-xl text-pink-600 font-light">
              A safe space to discuss household matters, personal challenges, and receive supportive guidance
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
            <div className="text-center">
              <div className="text-6xl mb-6">💬</div>
              <h3 className="text-3xl font-bold text-pink-800 mb-4">
                Women's Wellness Chatbot
              </h3>
              <p className="text-lg text-pink-600 mb-8 leading-relaxed">
                Whether it's managing household responsibilities, navigating personal relationships,
                or addressing health concerns - I'm here to listen and provide personalized support.
              </p>
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl">🤝</span>
                  <span className="text-lg font-semibold text-pink-800">Confidential & Supportive</span>
                </div>
                <p className="text-pink-600">
                  Your conversations are private and designed to empower you with knowledge, coping strategies,
                  and resources tailored to women's unique experiences.
                </p>
              </div>
              <button
                onClick={() => navigate('/women/chat')}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
              >
                Start a Conversation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Government Policies & Empowerment Schemes */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Government Initiatives & Empowerment Programs
            </h2>
            <p className="text-xl text-pink-600 font-light">
              Discover schemes and policies designed to support women's health, education, and economic empowerment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Beti Bachao Beti Padhao */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">👧</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Beti Bachao Beti Padhao</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Promoting gender equality and ensuring education and health for girls. Access scholarships and family planning support.
              </p>
              <a
                href="https://betibachao.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center"
              >
                Learn More
              </a>
            </div>

            {/* Mahila Shakti Kendra */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">💪</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Mahila Shakti Kendra</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                One-stop center for women's empowerment, providing counseling, legal aid, and skill development opportunities.
              </p>
              <a
                href="https://mskmyscheme.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center"
              >
                Find Your Center
              </a>
            </div>

            {/* Working Women Hostels */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🏠</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Working Women Hostels</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Safe and affordable accommodation for working women. Access subsidized housing and support services.
              </p>
              <a
                href="https://www.wcd.nic.in/working-women-hostels"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center"
              >
                Check Availability
              </a>
            </div>

            {/* Women Helpline */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">📞</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Women Helpline (181)</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                24/7 emergency helpline for women facing violence, harassment, or needing immediate assistance and counseling.
              </p>
              <a
                href="https://www.womenhelpline.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center"
              >
                Get Help Now
              </a>
            </div>

            {/* Maternity Benefits */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🤰</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Maternity Benefits</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Paid maternity leave, childcare support, and workplace protections for working mothers and expectant parents.
              </p>
              <a
                href="https://labour.gov.in/maternity-benefit-act"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center"
              >
                Know Your Rights
              </a>
            </div>

            {/* Skill Development */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🎓</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Skill Development Programs</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Free training programs in digital literacy, entrepreneurship, and vocational skills to empower economic independence.
              </p>
              <a
                href="https://www.skillindia.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-center"
              >
                Start Learning
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final Message and Beautiful Header */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              You Are Powerful Beyond Measure
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto font-light leading-relaxed">
              Every challenge you've overcome, every boundary you've set, every dream you've pursued -
              these are the threads that weave the extraordinary tapestry of your strength.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-6xl mb-6">✨</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Your Journey Continues
            </h3>
            <p className="text-lg text-pink-100 mb-8 leading-relaxed">
              Remember, empowerment is not a destination - it's a lifelong journey of self-discovery,
              growth, and unapologetic authenticity. You have everything you need within you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-pink-700 hover:bg-pink-50 py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Continue Your Journey
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-pink-700 py-4 px-8 rounded-2xl font-semibold transition-all duration-300">
                Share Your Story
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WomenPage
