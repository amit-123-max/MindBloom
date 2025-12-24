import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const CycleTrackingPage = () => {
  const navigate = useNavigate()
  const [cycleData, setCycleData] = useState([])
  const [currentCycle, setCurrentCycle] = useState({
    periodStart: '',
    periodEnd: '',
    flow: 'medium',
    symptoms: [],
    mood: 'neutral',
    notes: ''
  })
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Mock data - in real app, this would come from backend
  useEffect(() => {
    // Load user's cycle data from backend/localStorage
    const savedData = localStorage.getItem('cycleData')
    if (savedData) {
      setCycleData(JSON.parse(savedData))
    }
  }, [])

  const saveCycleData = () => {
    if (!currentCycle.periodStart) {
      alert('Please enter period start date')
      return
    }

    const newCycle = {
      id: Date.now(),
      ...currentCycle,
      dateLogged: new Date().toISOString()
    }

    const updatedData = [...cycleData, newCycle]
    setCycleData(updatedData)
    localStorage.setItem('cycleData', JSON.stringify(updatedData))

    // Reset form
    setCurrentCycle({
      periodStart: '',
      periodEnd: '',
      flow: 'medium',
      symptoms: [],
      mood: 'neutral',
      notes: ''
    })
    setShowForm(false)

    alert('Cycle data saved successfully!')
  }

  const handleSymptomChange = (symptom) => {
    setCurrentCycle(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const calculateCycleLength = () => {
    if (cycleData.length < 2) return null
    const recentCycles = cycleData.slice(-2)
    const start1 = new Date(recentCycles[0].periodStart)
    const start2 = new Date(recentCycles[1].periodStart)
    const diffTime = Math.abs(start2 - start1)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const predictNextPeriod = () => {
    if (cycleData.length === 0) return null
    const avgCycleLength = calculateCycleLength() || 28 // Default 28 days
    const lastPeriod = new Date(cycleData[cycleData.length - 1].periodStart)
    const nextPeriod = new Date(lastPeriod)
    nextPeriod.setDate(lastPeriod.getDate() + avgCycleLength)
    return nextPeriod.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
            Cycle Tracking
          </h1>
          <p className="text-lg text-pink-600">
            Track your menstrual cycle, monitor patterns, and gain insights into your body's rhythms
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Cycle Length</h3>
            <p className="text-3xl font-bold text-pink-600">
              {calculateCycleLength() || 'N/A'} days
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Total Cycles Logged</h3>
            <p className="text-3xl font-bold text-pink-600">{cycleData.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Next Period</h3>
            <p className="text-xl font-bold text-pink-600">
              {predictNextPeriod() || 'Track more cycles'}
            </p>
          </div>
        </div>

        {/* Add New Cycle Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {showForm ? 'Cancel' : 'Log New Cycle'}
          </button>
        </div>

        {/* Cycle Input Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 mb-8">
            <h2 className="text-2xl font-bold text-pink-800 mb-6">Log Your Cycle</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Period Start Date</label>
                <input
                  type="date"
                  value={currentCycle.periodStart}
                  onChange={(e) => setCurrentCycle(prev => ({ ...prev, periodStart: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Period End Date (Optional)</label>
                <input
                  type="date"
                  value={currentCycle.periodEnd}
                  onChange={(e) => setCurrentCycle(prev => ({ ...prev, periodEnd: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Flow Intensity</label>
              <select
                value={currentCycle.flow}
                onChange={(e) => setCurrentCycle(prev => ({ ...prev, flow: e.target.value }))}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="heavy">Heavy</option>
                <option value="irregular">Irregular</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Symptoms Experienced</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Cramps', 'Headache', 'Fatigue', 'Mood swings', 'Bloating', 'Back pain', 'Nausea', 'Insomnia', 'Breast tenderness'].map((symptom) => (
                  <label key={symptom} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={currentCycle.symptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-pink-700 text-sm">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Overall Mood</label>
              <select
                value={currentCycle.mood}
                onChange={(e) => setCurrentCycle(prev => ({ ...prev, mood: e.target.value }))}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="neutral">Neutral</option>
                <option value="poor">Poor</option>
                <option value="terrible">Terrible</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Additional Notes</label>
              <textarea
                value={currentCycle.notes}
                onChange={(e) => setCurrentCycle(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="Any other observations, medications taken, or notes about this cycle..."
              />
            </div>

            <div className="text-center">
              <button
                onClick={saveCycleData}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Save Cycle Data
              </button>
            </div>
          </div>
        )}

        {/* Previous Cycles */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Your Cycle History</h2>

          {cycleData.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-pink-600 text-lg">No cycles logged yet. Start tracking your periods to see patterns and predictions!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cycleData.slice(-5).reverse().map((cycle, index) => (
                <div key={cycle.id} className="border border-pink-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-pink-800">
                        Cycle #{cycleData.length - index}
                      </h3>
                      <p className="text-pink-600">
                        {new Date(cycle.periodStart).toLocaleDateString()} - {cycle.periodEnd ? new Date(cycle.periodEnd).toLocaleDateString() : 'Ongoing'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        cycle.flow === 'light' ? 'bg-green-100 text-green-800' :
                        cycle.flow === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        cycle.flow === 'heavy' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cycle.flow} flow
                      </span>
                    </div>
                  </div>

                  {cycle.symptoms.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-pink-700 font-medium mb-1">Symptoms:</p>
                      <div className="flex flex-wrap gap-2">
                        {cycle.symptoms.map(symptom => (
                          <span key={symptom} className="bg-pink-50 text-pink-700 px-2 py-1 rounded-full text-xs">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-pink-600">
                    <span>Mood: {cycle.mood}</span>
                    {cycle.notes && <span className="italic">"{cycle.notes}"</span>}
                  </div>
                </div>
              ))}

              {cycleData.length > 5 && (
                <div className="text-center pt-4">
                  <button className="text-pink-600 hover:text-pink-800 font-medium">
                    View All Cycles ({cycleData.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Insights Section */}
        {cycleData.length > 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 mt-8">
            <h2 className="text-2xl font-bold text-pink-800 mb-6">Cycle Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-pink-800 mb-2">Most Common Symptoms</h3>
                <div className="space-y-2">
                  {['Cramps', 'Fatigue', 'Mood swings', 'Headache'].map(symptom => (
                    <div key={symptom} className="flex justify-between">
                      <span className="text-pink-700">{symptom}</span>
                      <span className="text-pink-600 font-medium">
                        {Math.floor(Math.random() * 60) + 20}% of cycles
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-pink-800 mb-2">Cycle Patterns</h3>
                <div className="space-y-2">
                  <p className="text-pink-700">Average cycle length: <span className="font-medium">{calculateCycleLength() || 28} days</span></p>
                  <p className="text-pink-700">Most common flow: <span className="font-medium">Medium</span></p>
                  <p className="text-pink-700">Average period length: <span className="font-medium">5 days</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default CycleTrackingPage
