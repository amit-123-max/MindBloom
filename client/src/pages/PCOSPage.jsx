import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

const PCOSPage = () => {
  const [symptoms, setSymptoms] = useState([])
  const [currentEntry, setCurrentEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    symptoms: [],
    severity: 'mild',
    weight: '',
    bloodSugar: '',
    notes: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('pcosData')
    if (saved) {
      setSymptoms(JSON.parse(saved))
    }
  }, [])

  const savePCOSEntry = () => {
    const newEntry = {
      id: Date.now(),
      ...currentEntry,
      dateLogged: new Date().toISOString()
    }

    const updated = [...symptoms, newEntry]
    setSymptoms(updated)
    localStorage.setItem('pcosData', JSON.stringify(updated))

    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      symptoms: [],
      severity: 'mild',
      weight: '',
      bloodSugar: '',
      notes: ''
    })
    setShowForm(false)

    alert('PCOS data saved successfully!')
  }

  const handleSymptomChange = (symptom) => {
    setCurrentEntry(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const pcosInfo = [
    {
      title: "Understanding PCOS",
      content: "Polycystic Ovary Syndrome (PCOS) is a hormonal disorder affecting 1 in 10 women. It can cause irregular periods, excess androgen, and polycystic ovaries.",
      icon: "🩺"
    },
    {
      title: "Common Symptoms",
      content: "Irregular periods, excess hair growth, weight gain, acne, hair loss, and difficulty getting pregnant.",
      icon: "📋"
    },
    {
      title: "Management Strategies",
      content: "Lifestyle changes, hormonal treatments, diabetes management, and fertility support when needed.",
      icon: "🎯"
    }
  ]

  const managementTips = [
    "Maintain a healthy weight through balanced diet and exercise",
    "Monitor blood sugar levels regularly",
    "Take prescribed medications consistently",
    "Track ovulation and menstrual cycles",
    "Manage stress through meditation and relaxation",
    "Get adequate sleep (7-9 hours per night)",
    "Limit processed foods and refined sugars",
    "Stay hydrated and eat fiber-rich foods"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
            PCOS Management & Support
          </h1>
          <p className="text-lg text-pink-600">
            Tools and information to help you manage Polycystic Ovary Syndrome effectively
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {pcosInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="text-4xl mb-4">{info.icon}</div>
              <h3 className="text-xl font-semibold text-pink-800 mb-3">{info.title}</h3>
              <p className="text-pink-600">{info.content}</p>
            </div>
          ))}
        </div>

        {/* Management Tips */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 mb-8">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Daily Management Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managementTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-pink-600 text-sm font-bold">✓</span>
                </div>
                <p className="text-pink-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Log Symptoms Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {showForm ? 'Cancel' : 'Log PCOS Symptoms'}
          </button>
        </div>

        {/* Symptom Logging Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 mb-8">
            <h2 className="text-2xl font-bold text-pink-800 mb-6">Track Your PCOS Symptoms</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Date</label>
                <input
                  type="date"
                  value={currentEntry.date}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Overall Symptom Severity</label>
                <select
                  value={currentEntry.severity}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, severity: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="very-severe">Very Severe</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Current Symptoms</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Irregular periods', 'Excess hair growth', 'Acne', 'Weight gain', 'Hair thinning', 'Fatigue', 'Mood swings', 'Headaches', 'Pelvic pain', 'Sleep issues', 'Food cravings'].map((symptom) => (
                  <label key={symptom} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={currentEntry.symptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-pink-700 text-sm">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Weight (kg) - Optional</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentEntry.weight}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="Track weight changes"
                />
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Blood Sugar (mg/dL) - Optional</label>
                <input
                  type="number"
                  value={currentEntry.bloodSugar}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, bloodSugar: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  placeholder="Fasting blood sugar"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Additional Notes</label>
              <textarea
                value={currentEntry.notes}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="How are you feeling today? Any concerns or observations?"
              />
            </div>

            <div className="text-center">
              <button
                onClick={savePCOSEntry}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Save PCOS Data
              </button>
            </div>
          </div>
        )}

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-4xl mb-4">👩‍⚕️</div>
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Find an Endocrinologist</h3>
            <p className="text-pink-600 text-sm mb-4">Specialists who can help manage PCOS and hormonal health.</p>
            <button className="w-full bg-pink-50 text-pink-700 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
              Search Specialists
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-pink-800 mb-2">PCOS Education</h3>
            <p className="text-pink-600 text-sm mb-4">Learn more about PCOS causes, treatments, and lifestyle management.</p>
            <button className="w-full bg-pink-50 text-pink-700 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
              Read Articles
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-4xl mb-4">💊</div>
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Medication Tracking</h3>
            <p className="text-pink-600 text-sm mb-4">Keep track of your PCOS medications and treatment progress.</p>
            <button className="w-full bg-pink-50 text-pink-700 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
              Track Medications
            </button>
          </div>
        </div>

        {/* Symptom History */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Your PCOS Symptom History</h2>

          {symptoms.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-pink-600 text-lg">No symptom data logged yet. Start tracking to monitor your PCOS management progress.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {symptoms.slice(-5).reverse().map((entry, index) => (
                <div key={entry.id} className="border border-pink-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-pink-800">
                        Entry #{symptoms.length - index}
                      </h3>
                      <p className="text-pink-600">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        entry.severity === 'mild' ? 'bg-green-100 text-green-800' :
                        entry.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        entry.severity === 'severe' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {entry.severity}
                      </span>
                    </div>
                  </div>

                  {entry.symptoms.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-pink-700 font-medium mb-1">Symptoms:</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.symptoms.map(symptom => (
                          <span key={symptom} className="bg-pink-50 text-pink-700 px-2 py-1 rounded-full text-xs">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(entry.weight || entry.bloodSugar) && (
                    <div className="mb-3 text-sm text-pink-700">
                      {entry.weight && <span>Weight: {entry.weight}kg </span>}
                      {entry.bloodSugar && <span>• Blood Sugar: {entry.bloodSugar} mg/dL</span>}
                    </div>
                  )}

                  {entry.notes && (
                    <div className="text-sm text-pink-600 italic">
                      "{entry.notes}"
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

export default PCOSPage
