import React, { useState } from 'react'
import Navbar from './Navbar'

const ShareExperienceForm = ({ userType, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    experience: '',
    challenges: '',
    goals: '',
    support: '',
    contact: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const renderFormFields = () => {
    switch (userType) {
      case 'women':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Age Group</label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                >
                  <option value="">Select age group</option>
                  <option value="18-25">18-25 years</option>
                  <option value="26-35">26-35 years</option>
                  <option value="36-45">36-45 years</option>
                  <option value="46-55">46-55 years</option>
                  <option value="56+">56+ years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Location (City/State)</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                placeholder="Your location"
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Share Your Journey</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="Tell us about your experiences, achievements, and what matters most to you..."
                required
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Areas Where You Need Support</label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="What challenges do you face? How can we support you better?"
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Your Goals and Aspirations</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="What are your dreams, goals, and what success means to you?"
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">What Support Would Help You Most?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Community connection', 'Professional guidance', 'Health resources', 'Career support', 'Financial advice', 'Emotional support', 'Skill development', 'Mentorship'].map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={`support_${option}`}
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-pink-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )

      case 'students':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Education Level</label>
                <select
                  name="education"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                >
                  <option value="">Select education level</option>
                  <option value="high-school">High School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate Student</option>
                  <option value="phd">PhD/Doctoral</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Field of Study</label>
              <input
                type="text"
                name="field"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                placeholder="Your major/field of study"
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Your Academic Journey</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="Share your academic experiences, achievements, and what studying means to you..."
                required
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Current Challenges</label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="What academic or personal challenges are you facing?"
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Your Goals and Future Plans</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="What are your academic and career aspirations?"
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Areas Where You Need Support</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Study skills', 'Time management', 'Career guidance', 'Mental health', 'Financial aid', 'Social connection', 'Academic tutoring', 'Stress management'].map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={`support_${option}`}
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-pink-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )

      case 'professionals':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Years of Experience</label>
                <select
                  name="experience_years"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                >
                  <option value="">Select experience level</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="15+">15+ years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Industry/Field</label>
              <input
                type="text"
                name="industry"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                placeholder="Your industry or field of work"
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Your Professional Journey</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="Share your career experiences, achievements, and professional growth..."
                required
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Current Professional Challenges</label>
              <textarea
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="What workplace or professional challenges are you facing?"
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Your Career Goals</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="What are your professional aspirations and goals?"
              />
            </div>

            <div>
              <label className="block text-pink-800 font-semibold mb-2">Support Areas You're Interested In</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Leadership development', 'Work-life balance', 'Career transition', 'Stress management', 'Skill enhancement', 'Networking', 'Mentorship', 'Financial planning'].map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={`support_${option}`}
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-pink-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Share Your {userType === 'women' ? 'Story' : userType === 'students' ? 'Journey' : 'Experience'}
            </h1>
            <p className="text-lg text-pink-600">
              Your experiences matter. Help us understand your unique perspective so we can better support you and others like you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderFormFields()}

            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                name="contact"
                checked={formData.contact}
                onChange={handleInputChange}
                className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
              />
              <label className="text-pink-700 text-sm">
                I would like to be contacted for follow-up support or resources
              </label>
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-4 px-12 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
              >
                Share My Experience
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-pink-50 rounded-xl">
            <p className="text-sm text-pink-600 text-center">
              <strong>Privacy Notice:</strong> Your information is kept confidential and used only to improve our support services.
              We never share personal details without your explicit consent.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-pink-900 text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-pink-200 text-sm">© 2024 Mental Wellness Hub. Your story matters.</p>
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

export default ShareExperienceForm
