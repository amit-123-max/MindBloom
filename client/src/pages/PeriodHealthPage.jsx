import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

const PeriodHealthPage = () => {
  const [healthConcerns, setHealthConcerns] = useState([])
  const [currentConcern, setCurrentConcern] = useState({
    date: '',
    concern: '',
    severity: 'mild',
    symptoms: [],
    notes: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('periodHealthConcerns')
    if (saved) {
      setHealthConcerns(JSON.parse(saved))
    }
  }, [])

  const saveHealthConcern = () => {
    if (!currentConcern.date || !currentConcern.concern) {
      alert('Please fill in the date and concern')
      return
    }

    const newConcern = {
      id: Date.now(),
      ...currentConcern,
      dateLogged: new Date().toISOString()
    }

    const updated = [...healthConcerns, newConcern]
    setHealthConcerns(updated)
    localStorage.setItem('periodHealthConcerns', JSON.stringify(updated))

    setCurrentConcern({
      date: '',
      concern: '',
      severity: 'mild',
      symptoms: [],
      notes: ''
    })
    setShowForm(false)

    alert('Health concern logged successfully!')
  }

  const handleSymptomChange = (symptom) => {
    setCurrentConcern(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const healthTips = [
    {
      title: "Heavy Bleeding",
      description: "If you soak through a pad or tampon every hour, experience bleeding for more than 7 days, or pass large blood clots.",
      action: "Consult a healthcare provider"
    },
    {
      title: "Irregular Periods",
      description: "Cycles shorter than 21 days or longer than 35 days, or missed periods for 3+ months (if not pregnant).",
      action: "Track your cycles and discuss with a doctor"
    },
    {
      title: "Severe Pain",
      description: "Pain that interferes with daily activities, doesn't improve with pain relievers, or is accompanied by fever.",
      action: "Seek medical attention"
    },
    {
      title: "Unusual Discharge",
      description: "Foul-smelling discharge, unusual color, or accompanied by itching, burning, or irritation.",
      action: "Consult a healthcare provider"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
            Period Health & Wellness
          </h1>
          <p className="text-lg text-pink-600">
            Understanding and maintaining healthy menstrual cycles for overall well-being
          </p>
        </div>

        {/* Health Tips Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {healthTips.map((tip, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <h3 className="text-xl font-semibold text-pink-800 mb-3">{tip.title}</h3>
              <p className="text-pink-600 mb-4">{tip.description}</p>
              <div className="bg-pink-50 p-3 rounded-lg">
                <p className="text-pink-700 font-medium text-sm">{tip.action}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Log Health Concern Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {showForm ? 'Cancel' : 'Log Health Concern'}
          </button>
        </div>

        {/* Health Concern Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 mb-8">
            <h2 className="text-2xl font-bold text-pink-800 mb-6">Log Period Health Concern</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Date of Concern</label>
                <input
                  type="date"
                  value={currentConcern.date}
                  onChange={(e) => setCurrentConcern(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Severity Level</label>
                <select
                  value={currentConcern.severity}
                  onChange={(e) => setCurrentConcern(prev => ({ ...prev, severity: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Health Concern</label>
              <select
                value={currentConcern.concern}
                onChange={(e) => setCurrentConcern(prev => ({ ...prev, concern: e.target.value }))}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                required
              >
                <option value="">Select a concern</option>
                <option value="heavy-bleeding">Heavy or Prolonged Bleeding</option>
                <option value="irregular-periods">Irregular Periods</option>
                <option value="severe-pain">Severe Period Pain</option>
                <option value="unusual-discharge">Unusual Discharge</option>
                <option value="missed-periods">Missed Periods</option>
                <option value="spotting">Spotting Between Periods</option>
                <option value="pms-severe">Severe PMS Symptoms</option>
                <option value="other">Other Concern</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Associated Symptoms</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Severe cramps', 'Heavy bleeding', 'Irregular flow', 'Foul odor', 'Itching', 'Burning', 'Fever', 'Fatigue', 'Headache', 'Nausea', 'Dizziness'].map((symptom) => (
                  <label key={symptom} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={currentConcern.symptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-pink-700 text-sm">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Additional Notes</label>
              <textarea
                value={currentConcern.notes}
                onChange={(e) => setCurrentConcern(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="Describe what you're experiencing, when it started, any treatments tried, etc..."
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-600 text-lg">⚠️</span>
                <div>
                  <p className="text-yellow-800 font-medium">When to Seek Immediate Medical Attention:</p>
                  <ul className="text-yellow-700 text-sm mt-1 list-disc list-inside">
                    <li>Heavy bleeding soaking a pad every hour</li>
                    <li>Severe pain not relieved by medication</li>
                    <li>Fever over 101°F (38.3°C)</li>
                    <li>Signs of infection (foul odor, discharge, fever)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={saveHealthConcern}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Save Health Concern
              </button>
            </div>
          </div>
        )}

        {/* Health Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Find a Gynecologist</h3>
            <p className="text-pink-600 text-sm mb-4">Locate healthcare providers specializing in women's health in your area.</p>
            <button className="w-full bg-pink-50 text-pink-700 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
              Search Providers
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Period Tracking Apps</h3>
            <p className="text-pink-600 text-sm mb-4">Recommended apps for comprehensive cycle and health tracking.</p>
            <button className="w-full bg-pink-50 text-pink-700 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
              View Recommendations
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-4xl mb-4 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Health Education</h3>
              <p className="text-pink-600 text-sm mb-4">Learn more about menstrual health, hormonal changes, and self-care.</p>
              <button className="w-full bg-pink-50 text-pink-700 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
                Read Articles
              </button>
            </div>
          </div>
        </div>

        {/* Previous Health Concerns */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Your Health History</h2>

          {healthConcerns.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-pink-600 text-lg">No health concerns logged yet. Track your period health to monitor patterns and seek timely care.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {healthConcerns.slice(-5).reverse().map((concern, index) => (
                <div key={concern.id} className="border border-pink-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-pink-800 capitalize">
                        {concern.concern.replace('-', ' ')}
                      </h3>
                      <p className="text-pink-600">
                        {new Date(concern.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        concern.severity === 'mild' ? 'bg-green-100 text-green-800' :
                        concern.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        concern.severity === 'severe' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {concern.severity}
                      </span>
                    </div>
                  </div>

                  {concern.symptoms.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-pink-700 font-medium mb-1">Symptoms:</p>
                      <div className="flex flex-wrap gap-2">
                        {concern.symptoms.map(symptom => (
                          <span key={symptom} className="bg-pink-50 text-pink-700 px-2 py-1 rounded-full text-xs">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {concern.notes && (
                    <div className="text-sm text-pink-600 italic">
                      "{concern.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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

export default PeriodHealthPage
