import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

const NutritionExercisePage = () => {
  const [activeTab, setActiveTab] = useState('nutrition')
  const [nutritionData, setNutritionData] = useState([])
  const [exerciseData, setExerciseData] = useState([])
  const [currentNutrition, setCurrentNutrition] = useState({
    date: new Date().toISOString().split('T')[0],
    meal: '',
    foods: [],
    water: 0,
    supplements: [],
    notes: ''
  })
  const [currentExercise, setCurrentExercise] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration: 0,
    intensity: 'moderate',
    notes: ''
  })
  const [showNutritionForm, setShowNutritionForm] = useState(false)
  const [showExerciseForm, setShowExerciseForm] = useState(false)

  useEffect(() => {
    const savedNutrition = localStorage.getItem('nutritionData')
    const savedExercise = localStorage.getItem('exerciseData')
    if (savedNutrition) setNutritionData(JSON.parse(savedNutrition))
    if (savedExercise) setExerciseData(JSON.parse(savedExercise))
  }, [])

  const saveNutritionData = () => {
    if (!currentNutrition.meal) {
      alert('Please select a meal type')
      return
    }

    const newEntry = {
      id: Date.now(),
      ...currentNutrition,
      dateLogged: new Date().toISOString()
    }

    const updated = [...nutritionData, newEntry]
    setNutritionData(updated)
    localStorage.setItem('nutritionData', JSON.stringify(updated))

    setCurrentNutrition({
      date: new Date().toISOString().split('T')[0],
      meal: '',
      foods: [],
      water: 0,
      supplements: [],
      notes: ''
    })
    setShowNutritionForm(false)

    alert('Nutrition data saved!')
  }

  const saveExerciseData = () => {
    if (!currentExercise.type || !currentExercise.duration) {
      alert('Please fill in exercise type and duration')
      return
    }

    const newEntry = {
      id: Date.now(),
      ...currentExercise,
      dateLogged: new Date().toISOString()
    }

    const updated = [...exerciseData, newEntry]
    setExerciseData(updated)
    localStorage.setItem('exerciseData', JSON.stringify(updated))

    setCurrentExercise({
      date: new Date().toISOString().split('T')[0],
      type: '',
      duration: 0,
      intensity: 'moderate',
      notes: ''
    })
    setShowExerciseForm(false)

    alert('Exercise data saved!')
  }

  const cyclePhaseNutrition = {
    menstrual: {
      title: "Menstrual Phase (Days 1-5)",
      foods: ["Iron-rich foods (spinach, lentils)", "Vitamin C foods (citrus, bell peppers)", "Hydrating foods (cucumber, watermelon)", "Anti-inflammatory foods (ginger, turmeric)"],
      tips: "Focus on replenishing iron stores and staying hydrated. Rest is important during this phase."
    },
    follicular: {
      title: "Follicular Phase (Days 6-14)",
      foods: ["Protein-rich foods (eggs, chicken, tofu)", "Healthy fats (avocados, nuts, seeds)", "Colorful vegetables", "Whole grains"],
      tips: "Energy levels are rising. Focus on nutrient-dense foods to support hormone production."
    },
    luteal: {
      title: "Luteal Phase (Days 15-28)",
      foods: ["Complex carbs (sweet potatoes, quinoa)", "Magnesium-rich foods (dark chocolate, pumpkin seeds)", "Calcium-rich foods (yogurt, kale)", "B-vitamin foods (leafy greens, bananas)"],
      tips: "Support progesterone production and manage PMS symptoms with balanced nutrition."
    }
  }

  const cyclePhaseExercise = {
    menstrual: {
      title: "Menstrual Phase (Days 1-5)",
      recommendations: ["Gentle walking or yoga", "Light stretching", "Rest days as needed", "Low-impact activities"],
      tips: "Listen to your body. Focus on restorative movement rather than intense workouts."
    },
    follicular: {
      title: "Follicular Phase (Days 6-14)",
      recommendations: ["High-intensity workouts", "Strength training", "Cardio activities", "New exercise challenges"],
      tips: "Energy levels are high. This is a great time for challenging workouts and building strength."
    },
    luteal: {
      title: "Luteal Phase (Days 15-28)",
      recommendations: ["Moderate cardio", "Yoga and Pilates", "Light strength training", "Mindful movement"],
      tips: "Energy may fluctuate. Focus on consistent, moderate exercise and stress-reducing activities."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
            Nutrition & Exercise Tracker
          </h1>
          <p className="text-lg text-pink-600">
            Optimize your health by aligning nutrition and exercise with your menstrual cycle phases
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-1 shadow-lg border border-pink-100">
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'nutrition'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'text-pink-700 hover:bg-pink-50'
              }`}
            >
              🍎 Nutrition
            </button>
            <button
              onClick={() => setActiveTab('exercise')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'exercise'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'text-pink-700 hover:bg-pink-50'
              }`}
            >
              💪 Exercise
            </button>
          </div>
        </div>

        {/* Cycle Phase Recommendations */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 mb-8">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">
            Cycle Phase Recommendations
          </h2>

          {activeTab === 'nutrition' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(cyclePhaseNutrition).map(([phase, data]) => (
                <div key={phase} className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
                  <h3 className="text-lg font-semibold text-pink-800 mb-3">{data.title}</h3>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-pink-700 mb-2">Recommended Foods:</p>
                    <ul className="text-sm text-pink-600 space-y-1">
                      {data.foods.map((food, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2"></span>
                          {food}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-pink-700 italic">{data.tips}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(cyclePhaseExercise).map(([phase, data]) => (
                <div key={phase} className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
                  <h3 className="text-lg font-semibold text-pink-800 mb-3">{data.title}</h3>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-pink-700 mb-2">Recommended Activities:</p>
                    <ul className="text-sm text-pink-600 space-y-1">
                      {data.recommendations.map((activity, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2"></span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-pink-700 italic">{data.tips}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Log Data Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => activeTab === 'nutrition' ? setShowNutritionForm(!showNutritionForm) : setShowExerciseForm(!showExerciseForm)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {activeTab === 'nutrition' ? (showNutritionForm ? 'Cancel' : 'Log Nutrition') : (showExerciseForm ? 'Cancel' : 'Log Exercise')}
          </button>
        </div>

        {/* Nutrition Form */}
        {showNutritionForm && activeTab === 'nutrition' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 mb-8">
            <h2 className="text-2xl font-bold text-pink-800 mb-6">Log Nutrition</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Date</label>
                <input
                  type="date"
                  value={currentNutrition.date}
                  onChange={(e) => setCurrentNutrition(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Meal Type</label>
                <select
                  value={currentNutrition.meal}
                  onChange={(e) => setCurrentNutrition(prev => ({ ...prev, meal: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                >
                  <option value="">Select meal</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snacks">Snacks</option>
                  <option value="supplements">Supplements Only</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Foods Consumed</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Fruits', 'Vegetables', 'Proteins', 'Grains', 'Dairy', 'Healthy Fats', 'Sugars', 'Processed Foods'].map((food) => (
                  <label key={food} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-pink-700 text-sm">{food}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Water Intake (glasses)</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={currentNutrition.water}
                  onChange={(e) => setCurrentNutrition(prev => ({ ...prev, water: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Supplements Taken</label>
                <div className="space-y-2">
                  {['Iron', 'Calcium', 'Vitamin D', 'Omega-3', 'Magnesium', 'B Vitamins'].map((supplement) => (
                    <label key={supplement} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-pink-600 border-pink-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-pink-700 text-sm">{supplement}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Additional Notes</label>
              <textarea
                value={currentNutrition.notes}
                onChange={(e) => setCurrentNutrition(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="How did you feel after eating? Any cravings or aversions?"
              />
            </div>

            <div className="text-center">
              <button
                onClick={saveNutritionData}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Save Nutrition Data
              </button>
            </div>
          </div>
        )}

        {/* Exercise Form */}
        {showExerciseForm && activeTab === 'exercise' && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100 mb-8">
            <h2 className="text-2xl font-bold text-pink-800 mb-6">Log Exercise</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Date</label>
                <input
                  type="date"
                  value={currentExercise.date}
                  onChange={(e) => setCurrentExercise(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Exercise Type</label>
                <select
                  value={currentExercise.type}
                  onChange={(e) => setCurrentExercise(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                >
                  <option value="">Select exercise type</option>
                  <option value="walking">Walking</option>
                  <option value="running">Running/Jogging</option>
                  <option value="cycling">Cycling</option>
                  <option value="yoga">Yoga</option>
                  <option value="strength">Strength Training</option>
                  <option value="cardio">Cardio</option>
                  <option value="pilates">Pilates</option>
                  <option value="swimming">Swimming</option>
                  <option value="dance">Dance</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={currentExercise.duration}
                  onChange={(e) => setCurrentExercise(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-pink-800 font-semibold mb-2">Intensity Level</label>
                <select
                  value={currentExercise.intensity}
                  onChange={(e) => setCurrentExercise(prev => ({ ...prev, intensity: e.target.value }))}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="vigorous">Vigorous</option>
                  <option value="very-intense">Very Intense</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-pink-800 font-semibold mb-2">Notes</label>
              <textarea
                value={currentExercise.notes}
                onChange={(e) => setCurrentExercise(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-vertical"
                placeholder="How did you feel during/after exercise? Any observations?"
              />
            </div>

            <div className="text-center">
              <button
                onClick={saveExerciseData}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Save Exercise Data
              </button>
            </div>
          </div>
        )}

        {/* History Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">
            Your {activeTab === 'nutrition' ? 'Nutrition' : 'Exercise'} History
          </h2>

          {activeTab === 'nutrition' && nutritionData.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🍎</div>
              <p className="text-pink-600 text-lg">No nutrition data logged yet. Start tracking your meals to see patterns!</p>
            </div>
          )}

          {activeTab === 'exercise' && exerciseData.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💪</div>
              <p className="text-pink-600 text-lg">No exercise data logged yet. Start tracking your workouts!</p>
            </div>
          )}

          <div className="space-y-4">
            {(activeTab === 'nutrition' ? nutritionData : exerciseData).slice(-5).reverse().map((entry, index) => (
              <div key={entry.id} className="border border-pink-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-pink-800 capitalize">
                      {activeTab === 'nutrition' ? entry.meal : entry.type}
                    </h3>
                    <p className="text-pink-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  {activeTab === 'exercise' && (
                    <div className="text-right">
                      <span className="text-lg font-semibold text-pink-600">{entry.duration} min</span>
                      <p className="text-sm text-pink-500 capitalize">{entry.intensity}</p>
                    </div>
                  )}
                </div>

                {activeTab === 'nutrition' && entry.water > 0 && (
                  <p className="text-sm text-pink-700 mb-2">
                    💧 Water: {entry.water} glasses
                  </p>
                )}

                {entry.notes && (
                  <div className="text-sm text-pink-600 italic">
                    "{entry.notes}"
                  </div>
                )}
              </div>
            ))}
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

export default NutritionExercisePage
