import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiService from '../services/api'

const SleepPage = () => {
  const [sleepData, setSleepData] = useState({
    hoursSlept: 7,
    sleepQuality: 5,
    bedtime: '',
    wakeTime: '',
    caffeineIntake: 0,
    screenTime: 0,
    stressLevel: 5
  })
  const [weeklyData, setWeeklyData] = useState([])
  const [burnoutRisk, setBurnoutRisk] = useState(0)
  const [hygieneChecklist, setHygieneChecklist] = useState({
    consistentSchedule: false,
    coolDarkRoom: false,
    noScreens: false,
    noCaffeine: false,
    relaxationRoutine: false,
    comfortableBed: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [predictions, setPredictions] = useState(null)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    calculateBurnoutRisk()
  }, [sleepData, hygieneChecklist])

  const calculateBurnoutRisk = () => {
    // Simple burnout risk calculation based on sleep and lifestyle factors
    let risk = 0

    // Sleep hours factor
    if (sleepData.hoursSlept < 6) risk += 30
    else if (sleepData.hoursSlept < 7) risk += 15

    // Sleep quality factor
    risk += (10 - sleepData.sleepQuality) * 5

    // Caffeine factor
    risk += sleepData.caffeineIntake * 2

    // Screen time factor
    risk += sleepData.screenTime * 3

    // Stress factor
    risk += sleepData.stressLevel * 4

    // Hygiene checklist factor
    const hygieneScore = Object.values(hygieneChecklist).filter(Boolean).length
    risk -= hygieneScore * 8

    setBurnoutRisk(Math.max(0, Math.min(100, risk)))
  }

  const handleSleepDataChange = (field, value) => {
    setSleepData(prev => ({
      ...prev,
      [field]: field === 'hoursSlept' || field === 'caffeineIntake' || field === 'screenTime' || field === 'stressLevel' || field === 'sleepQuality'
        ? parseInt(value) || 0
        : value
    }))
  }

  const handleHygieneChange = (item, checked) => {
    setHygieneChecklist(prev => ({
      ...prev,
      [item]: checked
    }))
  }

  const addToWeeklyData = () => {
    const today = new Date().toISOString().split('T')[0]
    const newEntry = {
      date: today,
      ...sleepData,
      hygieneScore: Object.values(hygieneChecklist).filter(Boolean).length,
      burnoutRisk
    }

    setWeeklyData(prev => {
      const filtered = prev.filter(entry => entry.date !== today)
      return [...filtered, newEntry].slice(-7) // Keep last 7 days
    })
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!sleepData.bedtime || !sleepData.wakeTime) {
      alert('Please set your bedtime and wake time.')
      return
    }

    if (sleepData.hoursSlept < 0 || sleepData.hoursSlept > 24) {
      alert('Please enter valid sleep hours (0-24).')
      return
    }

    setIsSubmitting(true)
    try {
      addToWeeklyData()

      const submissionData = {
        ...sleepData,
        hygieneChecklist,
        burnoutRisk,
        timestamp: new Date()
      }

      console.log('Submitting sleep data:', submissionData)
      const response = await apiService.post('/student/sleep', submissionData)

      if (response.predictions) {
        setPredictions(response.predictions)
      }

      setShowSummary(true)
      alert('Sleep data saved successfully!')
    } catch (error) {
      console.error('Error submitting sleep data:', error)
      alert(`Failed to save sleep data: ${error.message || 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getBurnoutRiskColor = (risk) => {
    if (risk < 30) return 'text-green-600'
    if (risk < 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBurnoutRiskLabel = (risk) => {
    if (risk < 30) return 'Low Risk'
    if (risk < 60) return 'Moderate Risk'
    return 'High Risk'
  }

  const getSleepQualityEmoji = (quality) => {
    if (quality >= 8) return '😴'
    if (quality >= 6) return '😊'
    if (quality >= 4) return '😐'
    return '😞'
  }

  const hygieneItems = [
    { key: 'consistentSchedule', label: 'Maintain consistent sleep schedule', description: 'Go to bed and wake up at the same time every day' },
    { key: 'coolDarkRoom', label: 'Keep room cool and dark', description: 'Optimal temperature: 60-67°F (15-19°C)' },
    { key: 'noScreens', label: 'No screens 1 hour before bed', description: 'Blue light interferes with melatonin production' },
    { key: 'noCaffeine', label: 'Avoid caffeine after 2 PM', description: 'Caffeine can stay in your system for 6-8 hours' },
    { key: 'relaxationRoutine', label: 'Relaxation routine before bed', description: 'Reading, meditation, or light stretching' },
    { key: 'comfortableBed', label: 'Comfortable mattress and pillows', description: 'Your bed should support healthy sleep posture' }
  ]

  const averageSleepHours = weeklyData.length > 0
    ? (weeklyData.reduce((sum, entry) => sum + entry.hoursSlept, 0) / weeklyData.length).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">😴</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Sleep Deprivation & Burnout Prevention
            </h1>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light leading-relaxed">
              Prioritize rest and recovery to maintain academic excellence and prevent burnout.
            </p>
          </div>

          {!showSummary ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sleep Tracking */}
              <div className="space-y-8">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                  <h2 className="text-2xl font-bold text-pink-800 mb-6">Today's Sleep Log</h2>

                  <div className="space-y-6">
                    {/* Hours Slept */}
                    <div>
                      <label className="block text-lg font-semibold text-pink-800 mb-3">
                        Hours of Sleep Last Night
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="0"
                          max="12"
                          step="0.5"
                          value={sleepData.hoursSlept}
                          onChange={(e) => handleSleepDataChange('hoursSlept', e.target.value)}
                          className="flex-1 h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-2xl font-bold text-pink-700 min-w-[60px]">{sleepData.hoursSlept}h</span>
                      </div>
                      <div className="flex justify-between text-xs text-pink-500 mt-2">
                        <span>0h</span>
                        <span>6h</span>
                        <span>12h</span>
                      </div>
                    </div>

                    {/* Sleep Quality */}
                    <div>
                      <label className="block text-lg font-semibold text-pink-800 mb-3">
                        Sleep Quality (1-10) {getSleepQualityEmoji(sleepData.sleepQuality)}
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={sleepData.sleepQuality}
                          onChange={(e) => handleSleepDataChange('sleepQuality', e.target.value)}
                          className="flex-1 h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-2xl font-bold text-pink-700 min-w-[60px]">{sleepData.sleepQuality}/10</span>
                      </div>
                    </div>

                    {/* Bedtime and Wake Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-pink-700 mb-2">Bedtime</label>
                        <input
                          type="time"
                          value={sleepData.bedtime}
                          onChange={(e) => handleSleepDataChange('bedtime', e.target.value)}
                          className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-pink-700 mb-2">Wake Time</label>
                        <input
                          type="time"
                          value={sleepData.wakeTime}
                          onChange={(e) => handleSleepDataChange('wakeTime', e.target.value)}
                          className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Lifestyle Factors */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-pink-700 mb-2">
                          Caffeine Intake Today (cups)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={sleepData.caffeineIntake}
                          onChange={(e) => handleSleepDataChange('caffeineIntake', e.target.value)}
                          className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-pink-700 mb-2">
                          Screen Time Before Bed (hours)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="8"
                          step="0.5"
                          value={sleepData.screenTime}
                          onChange={(e) => handleSleepDataChange('screenTime', e.target.value)}
                          className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-pink-700 mb-2">
                          Current Stress Level (1-10)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={sleepData.stressLevel}
                          onChange={(e) => handleSleepDataChange('stressLevel', e.target.value)}
                          className="w-full h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="text-center mt-2">
                          <span className="text-lg font-bold text-pink-700">{sleepData.stressLevel}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Burnout Risk Gauge */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                  <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">Burnout Risk Assessment</h2>

                  <div className="text-center mb-6">
                    <div className="relative w-48 h-48 mx-auto mb-4">
                      <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#f3f4f6"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#ec4899"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - burnoutRisk / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-pink-700">{burnoutRisk}%</div>
                          <div className={`text-lg font-semibold ${getBurnoutRiskColor(burnoutRisk)}`}>
                            {getBurnoutRiskLabel(burnoutRisk)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {burnoutRisk > 50 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                          <p className="font-semibold text-red-800">High Burnout Risk Detected</p>
                          <p className="text-red-600 text-sm">Consider implementing better sleep hygiene and stress management techniques.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sleep Hygiene Checklist */}
              <div className="space-y-8">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                  <h2 className="text-2xl font-bold text-pink-800 mb-6">Sleep Hygiene Checklist</h2>

                  <div className="space-y-4">
                    {hygieneItems.map((item) => (
                      <div key={item.key} className="flex items-start space-x-3 p-4 border border-pink-100 rounded-xl hover:bg-pink-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={hygieneChecklist[item.key]}
                          onChange={(e) => handleHygieneChange(item.key, e.target.checked)}
                          className="mt-1 w-4 h-4 text-pink-600 bg-pink-100 border-pink-300 rounded focus:ring-pink-500 focus:ring-2"
                        />
                        <div className="flex-1">
                          <label className="font-semibold text-pink-800 cursor-pointer">
                            {item.label}
                          </label>
                          <p className="text-sm text-pink-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-pink-800">Hygiene Score:</span>
                      <span className="text-2xl font-bold text-pink-700">
                        {Object.values(hygieneChecklist).filter(Boolean).length}/{hygieneItems.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Predictions */}
                {predictions && (
                  <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                    <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">AI Sleep Insights</h2>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">🧠</span>
                          <div>
                            <p className="font-semibold text-pink-800">Burnout Risk: {predictions.riskLevel}</p>
                            <p className="text-pink-600 text-sm">{predictions.recommendations}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Sleep Data'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-3xl font-bold text-pink-800 mb-8 text-center">Your Sleep Summary</h2>

                {/* Weekly Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                    <div className="text-3xl mb-2">🌙</div>
                    <div className="text-2xl font-bold text-pink-700">{averageSleepHours}h</div>
                    <div className="text-pink-600">Avg Sleep Hours</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                    <div className="text-3xl mb-2">🔥</div>
                    <div className={`text-2xl font-bold ${getBurnoutRiskColor(burnoutRisk)}`}>{burnoutRisk}%</div>
                    <div className="text-pink-600">Burnout Risk</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-2xl font-bold text-pink-700">
                      {Object.values(hygieneChecklist).filter(Boolean).length}/{hygieneItems.length}
                    </div>
                    <div className="text-pink-600">Hygiene Score</div>
                  </div>
                </div>

                {/* Weekly Chart */}
                {weeklyData.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-pink-800 mb-4">Last 7 Days Sleep Pattern</h3>
                    <div className="space-y-2">
                      {weeklyData.slice(-7).map((entry, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-20 text-sm text-pink-600">
                            {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="flex-1 bg-pink-100 rounded-full h-6">
                            <div
                              className="bg-gradient-to-r from-pink-500 to-pink-600 h-6 rounded-full flex items-center justify-end pr-2"
                              style={{ width: `${(entry.hoursSlept / 12) * 100}%` }}
                            >
                              <span className="text-xs text-white font-bold">{entry.hoursSlept}h</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-pink-800 mb-4">Personalized Recommendations</h3>
                  <div className="space-y-3">
                    {averageSleepHours < 7 && (
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">💡</span>
                        <p className="text-pink-700">Aim for 7-9 hours of sleep per night. Consider adjusting your schedule to allow more rest time.</p>
                      </div>
                    )}
                    {burnoutRisk > 50 && (
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">⚠️</span>
                        <p className="text-pink-700">Your burnout risk is elevated. Focus on stress reduction techniques and better sleep hygiene.</p>
                      </div>
                    )}
                    {Object.values(hygieneChecklist).filter(Boolean).length < 4 && (
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">🎯</span>
                        <p className="text-pink-700">Improve your sleep hygiene by implementing more of the recommended practices above.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowSummary(false)}
                    className="px-6 py-3 bg-pink-100 text-pink-700 rounded-xl font-semibold hover:bg-pink-200 transition-all duration-300 mr-4"
                  >
                    Log More Sleep
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SleepPage
