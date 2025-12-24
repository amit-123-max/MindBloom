import React from 'react'
import Navbar from '../components/Navbar'

const ReproductiveHealthPage = () => {
  const topics = [
    {
      title: "Understanding Fertility",
      content: "Learn about your fertility window, ovulation tracking, and factors that affect fertility. Knowledge empowers you to make informed decisions about family planning.",
      icon: "🌱",
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Contraception Options",
      content: "Explore various birth control methods, their effectiveness, benefits, and considerations. Choose what works best for your lifestyle and health needs.",
      icon: "🛡️",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Sexual Health",
      content: "Information about maintaining sexual health, regular screenings, STI prevention, and healthy intimate relationships.",
      icon: "💝",
      color: "bg-pink-50 border-pink-200"
    },
    {
      title: "Pregnancy Planning",
      content: "Preconception health, nutrition, lifestyle factors, and preparation for pregnancy when you're ready to start a family.",
      icon: "🤰",
      color: "bg-purple-50 border-purple-200"
    },
    {
      title: "Menopause Transition",
      content: "Understanding perimenopause and menopause symptoms, hormone therapy options, and maintaining health during life transitions.",
      icon: "🦋",
      color: "bg-orange-50 border-orange-200"
    },
    {
      title: "Regular Health Screenings",
      content: "Important reproductive health screenings, when to get them, and why they're crucial for preventive care.",
      icon: "🔍",
      color: "bg-teal-50 border-teal-200"
    }
  ]

  const resources = [
    {
      title: "Find a Gynecologist",
      description: "Locate healthcare providers specializing in women's reproductive health",
      icon: "👩‍⚕️",
      action: "Search Providers"
    },
    {
      title: "Contraception Counseling",
      description: "Get personalized advice about birth control options",
      icon: "💬",
      action: "Learn More"
    },
    {
      title: "Fertility Resources",
      description: "Educational materials and support for fertility awareness",
      icon: "📚",
      action: "Explore Resources"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
            Reproductive Health & Wellness
          </h1>
          <p className="text-lg text-pink-600">
            Comprehensive information and resources for maintaining reproductive health at every stage of life
          </p>
        </div>

        {/* Main Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {topics.map((topic, index) => (
            <div key={index} className={`rounded-2xl p-6 border shadow-lg ${topic.color}`}>
              <div className="text-4xl mb-4">{topic.icon}</div>
              <h3 className="text-xl font-semibold text-pink-800 mb-3">{topic.title}</h3>
              <p className="text-pink-600">{topic.content}</p>
            </div>
          ))}
        </div>

        {/* Health Check Reminder */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 mb-8">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Regular Health Maintenance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-pink-800 mb-3">Annual Check-ups Include:</h3>
              <ul className="space-y-2 text-pink-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                  Pelvic exam and Pap smear
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                  Breast examination
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                  Blood pressure and weight check
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                  Discussion of reproductive goals
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-pink-800 mb-3">Age-Appropriate Screenings:</h3>
              <ul className="space-y-2 text-pink-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                  STD testing as needed
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                  Mammograms (starting at age 40)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                  Bone density testing (as needed)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                  Hormone level testing (if indicated)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="text-4xl mb-4">{resource.icon}</div>
              <h3 className="text-lg font-semibold text-pink-800 mb-2">{resource.title}</h3>
              <p className="text-pink-600 text-sm mb-4">{resource.description}</p>
              <button className="w-full bg-pink-50 text-pink-700 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
                {resource.action}
              </button>
            </div>
          ))}
        </div>

        {/* Emergency Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-8">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-800 mb-3">When to Seek Immediate Care</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-700">
                <ul className="space-y-2">
                  <li>• Severe pelvic pain</li>
                  <li>• Heavy bleeding not stopping</li>
                  <li>• Signs of ectopic pregnancy</li>
                  <li>• Severe menstrual pain</li>
                </ul>
                <ul className="space-y-2">
                  <li>• Unusual discharge with fever</li>
                  <li>• Severe nausea/vomiting</li>
                  <li>• Signs of miscarriage</li>
                  <li>• Severe mood changes</li>
                </ul>
              </div>
              <p className="text-yellow-800 font-medium mt-4">
                Contact emergency services or go to the nearest emergency room if experiencing any of these symptoms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-pink-900 text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-pink-200 text-sm">© 2024 Mental Wellness Hub. Your health data is secure.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-pink-200 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-pink-200 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-pink-200 hover:text-white text-sm transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ReproductiveHealthPage
