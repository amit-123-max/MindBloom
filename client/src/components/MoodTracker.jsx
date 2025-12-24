import React, { useMemo, useState, useEffect } from 'react'
import { moodPredictionService } from '../services/moodPrediction'

const MoodTracker = ({ journals }) => {
  const [viewMode, setViewMode] = useState('chart') // 'chart' or 'timeline'
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months') // '3months', '6months', '1year'
  const [isAnimated, setIsAnimated] = useState(false)
  const [previousDataLength, setPreviousDataLength] = useState(0)

  // Trigger animation when data changes
  useEffect(() => {
    const currentDataLength = journals?.length || 0
    if (currentDataLength !== previousDataLength) {
      setIsAnimated(false)
      // Longer delay to ensure smooth transition
      setTimeout(() => setIsAnimated(true), 200)
      setPreviousDataLength(currentDataLength)
    }
  }, [journals, selectedTimeframe, previousDataLength])

  // Process journal data for mood tracking with enhanced analytics
  const moodAnalytics = useMemo(() => {
    if (!journals || journals.length === 0) return {
      data: [],
      trends: { improving: 0, declining: 0, stable: 0 },
      insights: [],
      averages: {}
    }

    // Sort journals by date
    const sortedJournals = [...journals].sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    )

    // Filter by timeframe
    const now = new Date()
    const timeframeDays = {
      '3months': 90,
      '6months': 180,
      '1year': 365
    }
    const cutoffDate = new Date(now.getTime() - (timeframeDays[selectedTimeframe] * 24 * 60 * 60 * 1000))

    const filteredJournals = sortedJournals.filter(journal =>
      new Date(journal.date) >= cutoffDate
    )

    // Process individual journal entries for more granular mood tracking
    const entryData = filteredJournals.map(journal => {
      // Use mood prediction data if available, fallback to sentiment
      const mood = journal.moodPrediction?.mood || journal.sentiment || 'neutral'

      // Enhanced mood hierarchy with better happiness mapping
      const moodHierarchy = {
        'happy': 5, 'excited': 4, 'hopeful': 4, 'grateful': 4,
        'calm': 3, 'neutral': 2,
        'confused': 1, 'tired': 1,
        'anxious': 0, 'sad': -2, 'angry': -3
      }

      const happinessScore = moodHierarchy[mood] || 2

      return {
        id: journal._id,
        date: new Date(journal.date),
        mood: mood,
        happinessScore: happinessScore,
        title: journal.title,
        content: journal.content,
        entryNumber: 0 // Will be set after sorting
      }
    })

    // Sort by date (oldest first for chronological graph)
    entryData.sort((a, b) => a.date - b.date)

    // Add entry numbers for x-axis
    entryData.forEach((entry, index) => {
      entry.entryNumber = index + 1
    })

    // Group by weeks for summary statistics (keep this for metrics)
    const weeklyData = {}
    filteredJournals.forEach(journal => {
      const date = new Date(journal.date)
      const weekKey = `${date.getFullYear()}-W${Math.ceil((date.getDate() - date.getDay() + 1) / 7)}`
      const weekLabel = `Week ${Math.ceil((date.getDate() - date.getDay() + 1) / 7)}`

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          week: weekLabel,
          startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay()),
          entries: [],
          moodScores: {},
          avgMoodScore: 0
        }
      }

      weeklyData[weekKey].entries.push(journal)

      const mood = journal.moodPrediction?.mood || journal.sentiment || 'neutral'
      if (!weeklyData[weekKey].moodScores[mood]) {
        weeklyData[weekKey].moodScores[mood] = 0
      }
      weeklyData[weekKey].moodScores[mood]++
    })

    // Calculate weekly mood scores with the same enhanced hierarchy
    const moodHierarchy = {
      'happy': 5, 'excited': 4, 'hopeful': 4, 'grateful': 4,
      'calm': 3, 'neutral': 2,
      'confused': 1, 'tired': 1,
      'anxious': 0, 'sad': -2, 'angry': -3
    }

    const weeklyArray = Object.values(weeklyData).sort((a, b) => a.startDate - b.startDate)

    weeklyArray.forEach(week => {
      const totalEntries = week.entries.length
      if (totalEntries > 0) {
        let totalScore = 0
        Object.entries(week.moodScores).forEach(([mood, count]) => {
          totalScore += (moodHierarchy[mood] || 0) * count
        })
        week.avgMoodScore = totalScore / totalEntries
      }
    })

    // Calculate trends
    const trends = { improving: 0, declining: 0, stable: 0 }
    for (let i = 1; i < weeklyArray.length; i++) {
      const current = weeklyArray[i].avgMoodScore
      const previous = weeklyArray[i-1].avgMoodScore
      const diff = current - previous

      if (diff > 0.5) trends.improving++
      else if (diff < -0.5) trends.declining++
      else trends.stable++
    }

    // Generate insights
    const insights = []
    if (trends.improving > trends.declining) {
      insights.push("Your mood has been trending positively over this period!")
    }
    if (weeklyArray.length > 0) {
      const latestWeek = weeklyArray[weeklyArray.length - 1]
      const dominantMood = Object.entries(latestWeek.moodScores)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral'
      insights.push(`Your most common mood this week: ${moodPredictionService.getMoodName(dominantMood)}`)
    }

    return {
      data: weeklyArray, // Keep weekly data for summary metrics
      entryData: entryData, // New: individual entry data for detailed graph
      trends,
      insights,
      averages: {
        totalEntries: filteredJournals.length,
        avgMoodScore: weeklyArray.length > 0 ? weeklyArray.reduce((sum, week) => sum + week.avgMoodScore, 0) / weeklyArray.length : 0,
        avgHappinessScore: entryData.length > 0 ? entryData.reduce((sum, entry) => sum + entry.happinessScore, 0) / entryData.length : 0
      }
    }
  }, [journals, selectedTimeframe])

  // Generate SVG chart path with smooth curves for individual entries
  const generateChartPath = (data) => {
    if (!data || data.length < 2) return ''

    const width = 440 // Use more of the available SVG width
    const height = 200
    const padding = 30 // Reduce padding for more chart area

    // Use individual entry data for more detailed graph
    const entries = data.entryData || data
    if (entries.length < 2) return ''

    // Calculate scale based on happiness scores
    const scores = entries.map(d => d.happinessScore || d.avgMoodScore || 0)
    const minScore = Math.min(...scores, -3)
    const maxScore = Math.max(...scores, 5)
    const scoreRange = Math.max(maxScore - minScore, 4) // Ensure minimum range for visibility

    const xScale = (entryNum) => padding + ((entryNum - 1) / Math.max(entries.length - 1, 1)) * (width - 2 * padding)
    const yScale = (score) => height - padding - ((score - minScore) / scoreRange) * (height - 2 * padding)

    // Start path
    let path = `M ${xScale(entries[0].entryNumber || 1)} ${yScale(scores[0])}`

    // Create smooth curved lines using Catmull-Rom spline approximation
    for (let i = 1; i < entries.length; i++) {
      const prevScore = scores[i-1]
      const currentScore = scores[i]
      const nextScore = i < entries.length - 1 ? scores[i+1] : currentScore

      // Calculate control points for smooth curves
      const cp1x = xScale(entries[i-1].entryNumber || i) + (xScale(entries[i].entryNumber || (i+1)) - xScale(entries[i-1].entryNumber || i)) * 0.5
      const cp1y = yScale(prevScore + (currentScore - prevScore) * 0.3)
      const cp2x = xScale(entries[i].entryNumber || (i+1)) - (xScale(entries[i].entryNumber || (i+1)) - xScale(entries[i-1].entryNumber || i)) * 0.5
      const cp2y = yScale(currentScore - (nextScore - prevScore) * 0.3)

      path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${xScale(entries[i].entryNumber || (i+1))} ${yScale(currentScore)}`
    }

    return path
  }

  const getMoodDisplay = (mood) => ({
    emoji: moodPredictionService.getMoodEmoji(mood),
    color: moodPredictionService.getMoodColor(mood),
    name: moodPredictionService.getMoodName(mood)
  })

  if (moodAnalytics.data.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
        <h2 className="text-2xl font-bold text-pink-800 mb-6">Mood Analytics Dashboard</h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-pink-600 text-lg mb-4">Start writing journal entries to see your mood patterns and insights!</p>
          <p className="text-sm text-pink-500">Track your emotional journey with AI-powered mood analysis</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-pink-800">Mood Analytics Dashboard</h2>
        <div className="flex gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-pink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'chart' ? 'bg-white shadow-sm text-pink-700' : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              📈 Chart
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'timeline' ? 'bg-white shadow-sm text-pink-700' : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              📅 Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-blue-800">{moodAnalytics.entryData?.length || 0}</div>
          <div className="text-sm text-blue-600">Journal Entries</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-green-800">{moodAnalytics.averages.avgHappinessScore.toFixed(1)}</div>
          <div className="text-sm text-green-600">Avg Happiness</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-purple-800">
            {moodAnalytics.entryData?.filter(e => e.happinessScore >= 3).length || 0}
          </div>
          <div className="text-sm text-purple-600">Positive Days</div>
        </div>
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-xl">
          <div className="text-2xl font-bold text-pink-800">
            {moodAnalytics.entryData?.[moodAnalytics.entryData.length - 1]?.happinessScore.toFixed(1) || 'N/A'}
          </div>
          <div className="text-sm text-pink-600">Latest Entry</div>
        </div>
      </div>

      {/* Insights */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-pink-800 mb-3">AI Insights</h3>
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🤖</span>
            <div>
              {moodAnalytics.insights.map((insight, index) => (
                <p key={index} className="text-pink-800 mb-2">{insight}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart/Timeline View */}
      {viewMode === 'chart' ? (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center gap-2">
            📊 Happiness Journey Chart
            <span className="text-sm font-normal text-pink-600">({selectedTimeframe.replace('months', ' months').replace('year', ' year')} • {moodAnalytics.entryData?.length || 0} entries)</span>
          </h3>
          <div className="bg-gradient-to-br from-white via-pink-50/30 to-purple-50/20 rounded-3xl p-8 shadow-2xl border border-pink-100/50 backdrop-blur-sm">
            <div className="relative">
              <svg width="500" height="280" className="w-full h-auto">
                {/* Enhanced multi-layer background */}
                <defs>
                  <radialGradient id="chartBg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fdf2f8" />
                    <stop offset="70%" stopColor="#fce7f3" />
                    <stop offset="100%" stopColor="#faf5ff" />
                  </radialGradient>
                  <pattern id="grid" width="50" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 25" fill="none" stroke="#fecdd3" strokeWidth="0.3" opacity="0.5"/>
                  </pattern>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="20%" stopColor="#f97316" />
                    <stop offset="40%" stopColor="#eab308" />
                    <stop offset="60%" stopColor="#22c55e" />
                    <stop offset="80%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#f97316" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ec4899" floodOpacity="0.3"/>
                  </filter>
                </defs>

                {/* Background layers */}
                <rect width="100%" height="100%" fill="url(#chartBg)" rx="16" />
                <rect width="100%" height="100%" fill="url(#grid)" rx="16" />

                {/* Enhanced Y-axis with happiness scale */}
                <g className="y-axis-labels">
                  <g className="happiness-scale">
                    <circle cx="20" cy="35" r="4" fill="#22c55e" className="animate-pulse" />
                    <text x="35" y="40" className="text-xs fill-gray-700 font-semibold">Very Happy (5)</text>
                    <circle cx="20" cy="85" r="4" fill="#84cc16" />
                    <text x="35" y="90" className="text-xs fill-gray-700 font-semibold">Happy (4)</text>
                    <circle cx="20" cy="135" r="4" fill="#eab308" />
                    <text x="35" y="140" className="text-xs fill-gray-700 font-semibold">Neutral/Calm (2-3)</text>
                    <circle cx="20" cy="185" r="4" fill="#f97316" />
                    <text x="35" y="190" className="text-xs fill-gray-700 font-semibold">Anxious/Tired (0-1)</text>
                    <circle cx="20" cy="235" r="4" fill="#ef4444" className="animate-pulse" />
                    <text x="35" y="240" className="text-xs fill-gray-700 font-semibold">Sad/Angry (-3 to -1)</text>
                  </g>
                </g>

                {/* Area fill under the line */}
                {moodAnalytics.entryData && moodAnalytics.entryData.length > 1 && (
                  <g className={`transition-all duration-1500 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
                    <path
                      d={`${generateChartPath(moodAnalytics)} L ${470} ${230} L ${30} ${230} Z`}
                      fill="url(#areaGradient)"
                      className="animate-pulse"
                      style={{ animationDuration: '3s' }}
                    />
                  </g>
                )}

                {/* Enhanced chart line with multiple effects */}
                {moodAnalytics.entryData && moodAnalytics.entryData.length > 1 && (
                  <g className={`transition-all duration-2000 ease-out ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Shadow line */}
                    <path
                      d={generateChartPath(moodAnalytics)}
                      stroke="#ec4899"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.2"
                      transform="translate(1,1)"
                    />
                    {/* Main line with smooth animation */}
                    <path
                      d={generateChartPath(moodAnalytics)}
                      stroke="url(#lineGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#glow)"
                      className="drop-shadow-xl"
                      key={`chart-path-${moodAnalytics.entryData.length}`}
                      style={{
                        strokeDasharray: isAnimated ? 'none' : '1000',
                        strokeDashoffset: isAnimated ? '0' : '1000',
                        transition: 'stroke-dashoffset 2s ease-out'
                      }}
                    />
                    {/* Highlight line */}
                    <path
                      d={generateChartPath(moodAnalytics)}
                      stroke="white"
                      strokeWidth="1"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.9"
                    />
                  </g>
                )}

                {/* Advanced interactive data points for individual entries */}
                {moodAnalytics.entryData && moodAnalytics.entryData.map((entry, index) => {
                  const scores = moodAnalytics.entryData.map(d => d.happinessScore)
                  const minScore = Math.min(...scores, -3)
                  const maxScore = Math.max(...scores, 5)
                  const scoreRange = Math.max(maxScore - minScore, 4)

                  const x = 30 + ((entry.entryNumber - 1) / Math.max(moodAnalytics.entryData.length - 1, 1)) * 410
                  const y = 260 - ((entry.happinessScore - minScore) / scoreRange) * 200

                  // Enhanced color mapping based on happiness score
                  const moodColor = entry.happinessScore >= 4 ? '#22c55e' : // Very happy
                                   entry.happinessScore >= 3 ? '#84cc16' : // Happy
                                   entry.happinessScore >= 2 ? '#eab308' : // Neutral/Calm
                                   entry.happinessScore >= 0 ? '#f97316' : // Anxious/Tired
                                   entry.happinessScore >= -1 ? '#fb923c' : // Mildly sad
                                   '#ef4444' // Very sad/angry

                  return (
                    <g key={`point-${entry.id}-${entry.happinessScore}`} className={`transition-all duration-1000 ease-out ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} style={{ transitionDelay: `${index * 50}ms` }}>
                      {/* Outer glow ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill={moodColor}
                        fillOpacity="0.2"
                        className="animate-ping"
                        style={{ animationDuration: '2s', animationDelay: `${index * 0.05}s` }}
                      />
                      {/* Main data point */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill={moodColor}
                        stroke="white"
                        strokeWidth="3"
                        className="hover:r-12 transition-all duration-300 cursor-pointer drop-shadow-lg hover:drop-shadow-2xl"
                        title={`${entry.title}: ${entry.mood} (${entry.happinessScore} happiness score)`}
                      />
                      {/* Inner highlight */}
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="white"
                        className="animate-pulse"
                        style={{ animationDuration: '1.5s', animationDelay: `${index * 0.1}s` }}
                      />
                      {/* Mood emoji indicator */}
                      <text
                        x={x + 12}
                        y={y - 8}
                        className="text-sm font-bold animate-bounce"
                        style={{ animationDuration: '2s', animationDelay: `${index * 0.15}s` }}
                      >
                        {moodPredictionService.getMoodEmoji(entry.mood)}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Enhanced X-axis showing only entry numbers */}
              <div className="flex justify-between mt-6 px-12">
                {moodAnalytics.entryData && moodAnalytics.entryData
                  .filter((_, index) => index % Math.ceil(moodAnalytics.entryData.length / 8) === 0 || index === moodAnalytics.entryData.length - 1)
                  .map((entry, displayIndex) => {
                    const trend = entry.entryNumber > 1 ?
                      (entry.happinessScore > moodAnalytics.entryData[entry.entryNumber - 2]?.happinessScore ? 'up' :
                       entry.happinessScore < moodAnalytics.entryData[entry.entryNumber - 2]?.happinessScore ? 'down' : 'stable') : 'start'

                    return (
                      <div key={entry.id} className="text-center group">
                        <div className="text-sm font-bold text-pink-700 mb-2">Entry {entry.entryNumber}</div>
                        <div className={`text-lg transition-transform group-hover:scale-125 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-blue-500'}`}>
                          {trend === 'up' ? '📈' : trend === 'down' ? '📉' : trend === 'start' ? '🎯' : '➡️'}
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Trend summary overlay */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-pink-200/50">
                <div className="text-xs font-semibold text-pink-800 mb-2">Mood Journey</div>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg ${moodAnalytics.averages.avgHappinessScore > 2 ? 'text-green-500' : moodAnalytics.averages.avgHappinessScore > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {moodAnalytics.averages.avgHappinessScore > 2 ? '😊' : moodAnalytics.averages.avgHappinessScore > 0 ? '😐' : '😢'}
                  </span>
                  <span className="text-xs text-gray-600">
                    Avg: {moodAnalytics.averages.avgHappinessScore.toFixed(1)} happiness
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {moodAnalytics.entryData?.length || 0} entries tracked
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center gap-2">
            📅 Interactive Mood Timeline
            <span className="text-sm font-normal text-pink-600">({selectedTimeframe.replace('months', ' months').replace('year', ' year')})</span>
          </h3>
          <div className="relative">
            {/* Timeline connecting line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300 rounded-full opacity-60"></div>

            <div className="space-y-6">
              {moodAnalytics.data.map((week, index) => {
                const dominantMood = Object.entries(week.moodScores)
                  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral'
                const moodDisplay = getMoodDisplay(dominantMood)
                const moodScore = week.avgMoodScore
                const progressWidth = Math.abs(moodScore) * 30 // Enhanced scale for better visualization
                const intensity = Math.min(Math.abs(moodScore) * 50 + 20, 100) // Intensity for visual effects

                // Calculate trend with more nuance
                const trend = index > 0 ? (
                  moodScore > moodAnalytics.data[index - 1]?.avgMoodScore + 0.3 ? 'strong_up' :
                  moodScore > moodAnalytics.data[index - 1]?.avgMoodScore ? 'up' :
                  moodScore < moodAnalytics.data[index - 1]?.avgMoodScore - 0.3 ? 'strong_down' :
                  moodScore < moodAnalytics.data[index - 1]?.avgMoodScore ? 'down' : 'stable'
                ) : 'start'

                return (
                  <div key={index} className={`relative transition-all duration-700 ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                    {/* Timeline node */}
                    <div className="absolute left-6 top-8 w-4 h-4 bg-white border-4 border-pink-400 rounded-full shadow-lg z-10 animate-pulse"
                         style={{ borderColor: moodDisplay.color.split(' ')[1] || '#ec4899' }}></div>

                    {/* Main card with enhanced styling */}
                    <div className={`relative ml-16 overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
                         style={{
                           background: `linear-gradient(135deg, ${moodDisplay.color.split(' ')[0] || 'rgba(255,255,255,0.9)'} ${intensity}%, rgba(255,255,255,0.95) 100%)`,
                           boxShadow: `0 10px 30px -5px ${moodDisplay.color.split(' ')[1] || '#ec4899'}20`
                         }}>

                      {/* Animated background particles */}
                      <div className="absolute inset-0 overflow-hidden rounded-3xl">
                        <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
                        <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
                        <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      </div>

                      <div className="relative p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-5">
                            {/* Enhanced mood indicator */}
                            <div className="relative">
                              <div className="text-4xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                {moodDisplay.emoji}
                              </div>
                              {/* Mood intensity rings */}
                              <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" style={{ animationDuration: '2s' }}></div>
                              <div className="absolute inset-0 rounded-full border border-white/30 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-pink-800 text-xl group-hover:text-pink-900 transition-colors">
                                  {week.week}
                                </h4>
                                {/* Trend badge */}
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                                  trend === 'strong_up' ? 'bg-green-100 text-green-800 border border-green-300' :
                                  trend === 'up' ? 'bg-green-50 text-green-700 border border-green-200' :
                                  trend === 'strong_down' ? 'bg-red-100 text-red-800 border border-red-300' :
                                  trend === 'down' ? 'bg-red-50 text-red-700 border border-red-200' :
                                  'bg-blue-50 text-blue-700 border border-blue-200'
                                } transition-all duration-300 hover:scale-105`}>
                                  {trend === 'strong_up' ? '🚀' :
                                   trend === 'up' ? '📈' :
                                   trend === 'strong_down' ? '📉' :
                                   trend === 'down' ? '⬇️' :
                                   trend === 'start' ? '🎯' : '➡️'}
                                  {trend === 'strong_up' ? 'Strong Up' :
                                   trend === 'up' ? 'Improving' :
                                   trend === 'strong_down' ? 'Strong Down' :
                                   trend === 'down' ? 'Declining' :
                                   trend === 'start' ? 'Baseline' : 'Stable'}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-sm">
                                <span className="font-semibold text-pink-700">{moodDisplay.name}</span>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-pink-700 font-medium border border-pink-200/50">
                                  <span className="text-blue-500">📝</span>
                                  {week.entries.length} {week.entries.length === 1 ? 'entry' : 'entries'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            {/* Enhanced mood score visualization */}
                            <div className="text-right">
                              <div className="text-2xl font-bold text-pink-800 mb-1 group-hover:scale-110 transition-transform">
                                {moodScore.toFixed(1)}
                              </div>
                              <div className="text-xs text-pink-600 font-medium">mood score</div>
                            </div>

                            {/* Dynamic progress bar with gradient */}
                            <div className="relative w-32 h-4 bg-gray-200/50 rounded-full overflow-hidden shadow-inner">
                              <div
                                className={`h-full rounded-full transition-all duration-1500 ease-out shadow-lg ${
                                  moodScore > 0.5 ? 'bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400' :
                                  moodScore > 0 ? 'bg-gradient-to-r from-lime-400 to-green-400' :
                                  moodScore > -0.5 ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400' :
                                  moodScore > -1 ? 'bg-gradient-to-r from-orange-400 to-red-400' :
                                  'bg-gradient-to-r from-red-400 via-rose-400 to-pink-400'
                                }`}
                                style={{
                                  width: `${progressWidth}%`,
                                  transformOrigin: 'left',
                                  transform: moodScore < 0 ? 'scaleX(-1)' : 'scaleX(1)',
                                  boxShadow: `0 0 ${intensity/10}px ${moodDisplay.color.split(' ')[1] || '#ec4899'}60`
                                }}
                              >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
                                     style={{ animationDuration: '2s' }}></div>
                              </div>

                              {/* Score markers */}
                              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-pink-400 rounded-full opacity-60"></div>
                            </div>

                            {/* Intensity indicator */}
                            <div className="text-center">
                              <div className="text-lg font-bold text-pink-700">
                                {Math.abs(moodScore) > 1.5 ? '🔥' : Math.abs(moodScore) > 1 ? '⚡' : Math.abs(moodScore) > 0.5 ? '💫' : '😌'}
                              </div>
                              <div className="text-xs text-pink-500">
                                {Math.abs(moodScore) > 1.5 ? 'Intense' : Math.abs(moodScore) > 1 ? 'Strong' : Math.abs(moodScore) > 0.5 ? 'Moderate' : 'Mild'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mood distribution mini-chart */}
                        {week.entries.length > 1 && (
                          <div className="mt-4 pt-4 border-t border-white/30">
                            <div className="flex items-center justify-between text-xs text-pink-600 mb-2">
                              <span className="font-medium">Mood Distribution</span>
                              <span>Most frequent: <strong>{moodDisplay.name}</strong></span>
                            </div>
                            <div className="flex space-x-1">
                              {Object.entries(week.moodScores).map(([mood, count]) => {
                                const percentage = (count / week.entries.length) * 100
                                const miniMoodDisplay = getMoodDisplay(mood)
                                return (
                                  <div key={mood} className="flex-1 text-center">
                                    <div className="text-lg mb-1">{miniMoodDisplay.emoji}</div>
                                    <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                          width: `${percentage}%`,
                                          backgroundColor: miniMoodDisplay.color.split(' ')[1] || '#ec4899',
                                          boxShadow: `0 0 4px ${miniMoodDisplay.color.split(' ')[1] || '#ec4899'}40`
                                        }}
                                      ></div>
                                    </div>
                                    <div className="text-xs text-pink-500 mt-1">{percentage.toFixed(0)}%</div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mood Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center gap-2">
          🎭 Mood Distribution
          <span className="text-sm font-normal text-pink-600">({moodAnalytics.averages.totalEntries} total entries)</span>
        </h3>
        <div className="bg-gradient-to-br from-white to-pink-50/50 rounded-2xl p-6 border border-pink-100/50">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(
              moodAnalytics.data.reduce((acc, week) => {
                Object.entries(week.moodScores).forEach(([mood, count]) => {
                  acc[mood] = (acc[mood] || 0) + count
                })
                return acc
              }, {})
            ).sort(([,a], [,b]) => b - a).slice(0, 6).map(([mood, count], index) => {
              const moodDisplay = getMoodDisplay(mood)
              const percentage = ((count / moodAnalytics.averages.totalEntries) * 100).toFixed(1)
              const maxCount = Math.max(...Object.values(
                moodAnalytics.data.reduce((acc, week) => {
                  Object.entries(week.moodScores).forEach(([mood, count]) => {
                    acc[mood] = (acc[mood] || 0) + count
                  })
                  return acc
                }, {})
              ))
              const barHeight = Math.max(40, (count / maxCount) * 120)

              return (
                <div key={mood} className={`text-center transition-all duration-500 ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${index * 150}ms` }}>
                  <div className="relative mb-3">
                    <div
                      className={`w-full rounded-2xl mx-auto ${moodDisplay.color.split(' ')[0]} shadow-lg relative overflow-hidden transition-all duration-1000 hover:scale-105`}
                      style={{ height: `${barHeight}px` }}
                    >
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="text-2xl drop-shadow-lg">{moodDisplay.emoji}</div>
                      </div>
                      {/* Floating particles effect */}
                      <div className="absolute top-1 right-1 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
                      <div className="absolute top-3 right-2 w-0.5 h-0.5 bg-white/40 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-pink-800">{count}</div>
                    <div className="text-xs font-medium text-pink-700">{moodDisplay.name}</div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-700 font-medium">
                      {percentage}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary stats */}
          <div className="mt-6 pt-4 border-t border-pink-200/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/60 rounded-lg p-3">
                <div className="text-lg font-bold text-pink-800">{moodAnalytics.data.length}</div>
                <div className="text-xs text-pink-600">Active Weeks</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="text-lg font-bold text-green-600">{moodAnalytics.trends.improving}</div>
                <div className="text-xs text-green-600">Improving</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-600">{moodAnalytics.trends.stable}</div>
                <div className="text-xs text-blue-600">Stable</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <div className="text-lg font-bold text-red-600">{moodAnalytics.trends.declining}</div>
                <div className="text-xs text-red-600">Declining</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodTracker
