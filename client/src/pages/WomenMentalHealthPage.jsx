import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

const WomenMentalHealthPage = () => {
  const [moodEntries, setMoodEntries] = useState([])
  const [currentEntry, setCurrentEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 'neutral',
    energy: 5,
    stress: 5,
    triggers: [],
    coping: [],
    notes: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('womenMentalHealth')
    if (saved) {
      setMoodEntries(JSON.parse(saved))
    }
  }, [])

  const saveMoodEntry = () => {
    const newEntry = {
      id: Date.now(),
      ...currentEntry,
      dateLogged: new Date().toISOString()
    }

    const updated = [...moodEntries, newEntry]
    setMoodEntries(updated)
    localStorage.setItem('womenMentalHealth', JSON.stringify(updated))

    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      mood: 'neutral',
      energy: 5,
      stress: 5,
      triggers: [],
      coping: [],
      notes: ''
    })
    setShowForm(false)

    alert('Mental health entry saved!')
  }

  const handleTriggerChange = (trigger) => {
    setCurrentEntry(prev => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter(t => t !== trigger)
        : [...prev.triggers, trigger]
    }))
  }

  const handleCopingChange = (coping) => {
    setCurrentEntry(prev => ({
      ...prev,
      coping: prev.coping.includes(coping)
        ? prev.coping.filter(c => c !== coping)
        : [...prev.coping, coping]
    }))
  }

  const moodOptions = [
    { value: 'excellent', label: 'Excellent', emoji: '😊', color: 'bg-green-100 text-green-800' },
    { value: 'good', label: 'Good', emoji: '🙂', color: 'bg-green-50 text-green-700' },
    { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-yellow-50 text-yellow-700' },
    { value: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-50 text-blue-700' },
    { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'bg-orange-50 text-orange-700' },
    { value: 'angry', label: 'Angry', emoji: '😠', color: 'bg-red-50 text-red-700' }
  ]

  const womenSpecificConcerns = [
    {
      title: "Hormonal Mood Changes",
      description: "Understanding how menstrual cycle phases affect mood and emotions",
      icon: "🌙"
    },
    {
      title: "Body Image & Self-Esteem",
      description: "Navigating societal pressures and building positive self-image",
      icon: "🪞"
    },
    {
      title: "Relationship Dynamics",
      description: "Managing emotional aspects of relationships and social connections",
      icon: "❤️"
    },
    {
      title: "Work-Life Balance",
      description: "Balancing career ambitions with personal well-being and family life",
      icon: "⚖️"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
            Women's Mental Health & Wellness
          </h1>
          <p className="text-lg text-pink-600">
            Understanding and nurturing your emotional well-being as a woman
          </p>
        </div>

        {/* Women-Specific Mental Health Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {womenSpecificConcerns.map((concern, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="text-4xl mb-4">{concern.icon}</div>
              <h3 className="text-xl font-semibold text-pink-800 mb-3">{concern.title}</h3>
              <p className="text-pink-600">{concern.description}</p>
            </div>
          ))}
        </div>

        {/* Daily Check-in Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {showForm ? 'Cancel' : 'Daily Mood Check-in'}
          </button>
        </div>

        {/* Mood Tracking Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 mb-8">
            <h2 className="text-2xl font-bold text-pink-800 mb-6">How Are You Feeling Today?</h2>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-4">Date</label>
              <input
                type="date"
                value={currentEntry.date}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-4">Overall Mood</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setCurrentEntry(prev => ({ ...prev, mood: mood.value }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      currentEntry.mood === mood.value
                        ? 'border-pink-500 bg-pink-50 shadow-md'
                        : 'border-pink-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <div className="text-sm font-medium text-pink-800">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">
                  Energy Level: {currentEntry.energy}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.energy}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-pink-600 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">
                  Stress Level: {currentEntry.stress}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.stress}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, stress: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-pink-600 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">What Triggered These Feelings? (Optional)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Work stress', 'Relationship issues', 'Family concerns', 'Health worries', 'Financial pressure', 'Social situations', 'Hormonal changes', 'Sleep issues', 'Other'].map((trigger) => (
                  <label key={trigger} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={currentEntry.triggers.includes(trigger)}
                      onChange={() => handleTriggerChange(trigger)}
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-pink-700 text-sm">{trigger}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Coping Strategies Used (Optional)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Exercise', 'Meditation', 'Talking to friends', 'Journaling', 'Music', 'Reading', 'Walking', 'Deep breathing', 'Hobbies', 'Professional help', 'Other'].map((coping) => (
                  <label key={coping} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={currentEntry.coping.includes(coping)}
                      onChange={() => handleCopingChange(coping)}
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-pink-700 text-sm">{coping}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Additional Notes</label>
              <textarea
                value={currentEntry.notes}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="Any other thoughts, observations, or things you want to remember about today..."
              />
            </div>

            <div className="text-center">
              <button
                onClick={saveMoodEntry}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Save Mood Entry
              </button>
            </div>
          </div>
        )}

        {/* Mental Health Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Women's Mental Health</h3>
            <p className="text-pink-600 text-sm mb-4">Learn about mental health topics specific to women's experiences and life stages.</p>
            <button className="w-full bg-pink-50 text-pink-700 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
              Read Articles
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Support Groups</h3>
            <p className="text-pink-600 text-sm mb-4">Connect with other women facing similar mental health challenges.</p>
            <button className="w-full bg-pink-50 text-pink-700 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
              Find Groups
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="text-4xl mb-4">📞</div>
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Crisis Support</h3>
            <p className="text-pink-600 text-sm mb-4">24/7 crisis hotlines and immediate mental health support services.</p>
            <button className="w-full bg-pink-50 text-pink-700 py-2 px-4 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium">
              Get Help Now
            </button>
          </div>
        </div>

        {/* Mood History */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Your Mood History</h2>

          {moodEntries.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-pink-600 text-lg">No mood entries yet. Start tracking your mental health to see patterns and progress.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {moodEntries.slice(-7).reverse().map((entry, index) => (
                <div key={entry.id} className="border border-pink-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-pink-800">
                        {new Date(entry.date).toLocaleDateString()}
                      </h3>
                      <p className="text-pink-600 capitalize">{entry.mood} mood</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-pink-600">
                        <div>Energy: {entry.energy}/10</div>
                        <div>Stress: {entry.stress}/10</div>
                      </div>
                    </div>
                  </div>

                  {entry.triggers.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-pink-700 font-medium mb-1">Triggers:</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.triggers.map(trigger => (
                          <span key={trigger} className="bg-pink-50 text-pink-700 px-2 py-1 rounded-full text-xs">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.coping.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-pink-700 font-medium mb-1">Coping Strategies:</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.coping.map(coping => (
                          <span key={coping} className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                            {coping}
                          </span>
                        ))}
                      </div>
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
              <p className="text-pink-200 text-sm">© 2024 Mental Wellness Hub. Your mental health data is secure.</p>
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

export default WomenMentalHealthPage
