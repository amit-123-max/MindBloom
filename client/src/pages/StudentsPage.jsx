import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const StudentsPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      {/* Welcoming Message Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-6">
            Your Journey Starts Here
          </h1>
          <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light leading-relaxed">
            Hey there, future leader! Whether you're navigating your first semester or preparing for graduation,
            remember that every challenge you face is shaping you into the remarkable person you're becoming.
            You're not just studying - you're growing, learning, and building the foundation for an incredible future.
          </p>
        </div>
      </section>

      {/* Tell Us More About Your Academic Life Card */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
            <div className="text-center">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-3xl font-bold text-pink-800 mb-4">
                Tell Us More About Your Academic Life & Well-being
              </h3>
              <p className="text-lg text-pink-600 mb-8 leading-relaxed">
                Help us understand your daily routine, stress levels, and goals so we can provide
                personalized support, study strategies, and resources tailored specifically for you.
              </p>
              <button
                onClick={() => navigate('/students/share')}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Share Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Student Mental Health Information Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Student Mental Health & Wellness
            </h2>
            <p className="text-xl text-pink-600 font-light">
              Understanding and managing the unique challenges of student life for optimal well-being
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Academic Stress & Exam Anxiety */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Academic Stress & Exam Anxiety</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Learn healthy ways to manage pre-exam jitters, study smarter not harder, and build confidence in your academic abilities.
              </p>
              <button
                onClick={() => navigate('/student/manage-stress')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Manage Stress
              </button>
            </div>

            {/* Time Management & Procrastination */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">⏰</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Time Management & Procrastination</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Break the cycle of last-minute cramming with effective study schedules, productivity techniques, and habit-building strategies.
              </p>
              <button
                onClick={() => navigate('/student/procrastination')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Beat Procrastination
              </button>
            </div>

            {/* Sleep Deprivation & Burnout */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">😴</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Sleep Deprivation & Burnout</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Prioritize rest and recovery while maintaining academic excellence. Discover the connection between sleep and learning performance.
              </p>
              <button
                onClick={() => navigate('/student/sleep')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Improve Sleep
              </button>
            </div>

            {/* Peer Pressure & Social Comparison */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">👥</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Peer Pressure & Social Comparison</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Navigate social dynamics and comparison traps while staying true to your values and celebrating your unique academic journey.
              </p>
              <button
                onClick={() => navigate('/student/confidence')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Build Confidence
              </button>
            </div>

            {/* Career Uncertainty & Future Planning */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Career Uncertainty & Future Planning</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Turn "what should I do with my life?" into an exciting exploration. Discover tools for career exploration and future planning.
              </p>
              <button
                onClick={() => navigate('/student/future')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Plan Your Future
              </button>
            </div>

            {/* Mental Health Awareness */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🧠</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Mental Health Awareness</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Understand common mental health challenges among students and learn when and how to seek support for yourself or friends.
              </p>
              <button
                onClick={() => navigate('/student/mental-awareness')}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Student Chatbot Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Your Study Buddy & Mental Health Companion
            </h2>
            <p className="text-xl text-pink-600 font-light">
              A friendly AI companion designed specifically for students, ready to listen and support you
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
            <div className="text-center">
              <div className="text-6xl mb-6">🤖</div>
              <h3 className="text-3xl font-bold text-pink-800 mb-4">
                Student Wellness Chatbot
              </h3>
              <p className="text-lg text-pink-600 mb-8 leading-relaxed">
                Whether it's exam stress, motivation blocks, relationship advice, or just needing someone to talk to -
                I'm here for you. No judgment, just genuine support from someone who gets the student life.
              </p>
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl">🎓</span>
                  <span className="text-lg font-semibold text-pink-800">Student-Centric Support</span>
                </div>
                <p className="text-pink-600">
                  Get personalized advice on study techniques, stress management, time management,
                  motivation, and emotional support. Your academic success and mental well-being matter to me.
                </p>
              </div>
              <button
                onClick={() => navigate('/students/chat')}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
              >
                Start Chatting
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Student Support Resources */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Student Support Resources & Programs
            </h2>
            <p className="text-xl text-pink-600 font-light">
              Discover scholarships, government schemes, and support services designed to help you succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Scholarships & Financial Aid */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">💰</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Scholarships & Financial Aid</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Merit-based and need-based scholarships, education loans, and financial assistance programs to support your academic journey.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Find Scholarships
              </button>
            </div>

            {/* Government Education Schemes */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🏛️</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Government Education Schemes</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Central and state government initiatives for education, including fee waivers, textbook assistance, and digital learning programs.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Explore Schemes
              </button>
            </div>

            {/* Student Mental Health Helplines */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">📞</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Mental Health Helplines</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                24/7 confidential support lines for students facing mental health challenges, academic stress, or personal difficulties.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Get Support Now
              </button>
            </div>

            {/* Free Counseling Services */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🗣️</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Free Counseling Services</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                University counseling centers, NGO services, and subsidized professional counseling for academic and personal guidance.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Find Counselors
              </button>
            </div>

            {/* Career Guidance & Placement */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Career Guidance & Placement</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Career counseling, internship opportunities, resume building workshops, and placement assistance services.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Plan Your Career
              </button>
            </div>

            {/* Skill Development Programs */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4">Skill Development Programs</h3>
              <p className="text-pink-600 leading-relaxed mb-6">
                Free and subsidized training in digital skills, entrepreneurship, communication, and industry-specific competencies.
              </p>
              <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                Build Skills
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
              You Are Capable of Amazing Things
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto font-light leading-relaxed">
              Every late-night study session, every challenging exam, every moment of self-doubt -
              these are the experiences that are forging you into someone extraordinary. Your potential
              is limitless, and your journey matters more than you know.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-6xl mb-6">🌟</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Your Success Story Continues
            </h3>
            <p className="text-lg text-pink-100 mb-8 leading-relaxed">
              Education is not just about grades and degrees - it's about discovering who you are,
              what you love, and how you want to impact the world. Believe in yourself, stay curious,
              and remember that every expert was once a beginner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-pink-700 hover:bg-pink-50 py-4 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Continue Learning
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-pink-700 py-4 px-8 rounded-2xl font-semibold transition-all duration-300">
                Share Your Progress
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StudentsPage
