import React, { createContext, useReducer, useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'

const WellnessContext = createContext()

const initialState = {
  assessmentResult: null,
  assessmentHistory: [],
  loading: false,
  error: null,
}

const wellnessReducer = (state, action) => {
  switch (action.type) {
    case 'ASSESSMENT_LOADING':
      return {
        ...state,
        loading: true,
      }
    case 'GET_ASSESSMENTS_SUCCESS':
      return {
        ...state,
        assessmentHistory: action.payload,
        loading: false,
        error: null,
      }
    case 'ASSESS_WELLNESS_SUCCESS':
      return {
        ...state,
        assessmentResult: action.payload,
        assessmentHistory: [action.payload, ...state.assessmentHistory], // Add new assessment to history
        loading: false,
        error: null,
      }
    case 'WELLNESS_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case 'CLEAR_ASSESSMENT_RESULT':
      return {
        ...state,
        assessmentResult: null,
      }
    default:
      return state
  }
}

const WellnessProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wellnessReducer, initialState)
  const { user } = useContext(AuthContext)

  // Local storage helpers for offline functionality
  const getLocalAssessments = () => {
    try {
      const stored = localStorage.getItem('wellnessAssessments')
      return stored ? JSON.parse(stored) : []
    } catch (err) {
      console.error('Error reading local assessments:', err)
      return []
    }
  }

  const saveLocalAssessment = (assessment) => {
    try {
      const assessments = getLocalAssessments()
      const newAssessment = {
        ...assessment,
        _id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        local: true
      }
      assessments.unshift(newAssessment)
      localStorage.setItem('wellnessAssessments', JSON.stringify(assessments))
      return newAssessment
    } catch (err) {
      console.error('Error saving local assessment:', err)
      return null
    }
  }

  // Local prediction function (fallback when backend is unavailable)
  const performLocalPrediction = async (inputs) => {
    console.log('[WellnessContext.jsx] Performing local wellness prediction')

    let stressScore = 0
    let depressionScore = 0
    const suggestions = []

    // --- Lifestyle Factors ---
    // Sleep hours: less sleep = higher risk
    if (inputs.sleepHours < 6) stressScore += 3
    else if (inputs.sleepHours >= 6 && inputs.sleepHours <= 7) stressScore += 1

    // Exercise frequency: less exercise = higher risk
    if (inputs.exerciseFrequency < 2) {
      stressScore += 2
      depressionScore += 2
      suggestions.push('Incorporate regular physical activity.')
    } else if (inputs.exerciseFrequency >= 2 && inputs.exerciseFrequency <= 4) {
      stressScore += 1
      depressionScore += 1
    }

    // Screen time: more screen time = higher risk
    if (inputs.screenTime > 5) {
      stressScore += 2
      depressionScore += 1
      suggestions.push('Reduce daily screen time, especially before bed.')
    } else if (inputs.screenTime > 3) {
      stressScore += 1
    }

    // --- Emotional State (Likert 0-3) ---
    // Add directly to scores, higher values indicate more risk
    depressionScore += inputs.littleInterest
    depressionScore += inputs.feelingDown
    stressScore += inputs.troubleConcentrating
    stressScore += inputs.feelingTired
    stressScore += inputs.feelingAnxious

    if (inputs.feelingDown > 1 || inputs.littleInterest > 1) {
      suggestions.push('Reach out to a friend or family member for support.')
    }
    if (inputs.feelingAnxious > 1) {
      suggestions.push('Practice mindfulness or deep breathing exercises.')
    }

    // --- Work/Study Stress ---
    // Hours worked/studied: more hours = higher risk
    if (inputs.hoursWorked > 10) stressScore += 3
    else if (inputs.hoursWorked > 8) stressScore += 2

    // Deadline pressure: map to numeric for scoring
    let deadlinePressureScore = 0
    if (inputs.deadlinePressure === 'low') deadlinePressureScore = 1
    else if (inputs.deadlinePressure === 'medium') deadlinePressureScore = 2
    else if (inputs.deadlinePressure === 'high') deadlinePressureScore = 3
    stressScore += deadlinePressureScore * 2 // Weighted more heavily

    if (inputs.deadlinePressure === 'high' || inputs.hoursWorked > 10) {
      suggestions.push('Consider setting boundaries for work/study hours.')
    }

    // --- Determine Levels ---
    let stressLevel = 'Low'
    if (stressScore >= 8) stressLevel = 'High'
    else if (stressScore >= 4) stressLevel = 'Moderate'

    let depressionRisk = 'Low'
    if (depressionScore >= 6) depressionRisk = 'High'
    else if (depressionScore >= 3) depressionRisk = 'Moderate'

    return {
      stressLevel,
      depressionRisk,
      suggestions: [...new Set(suggestions)], // Remove duplicates
    }
  }

  // Test wellness routes
  const testWellnessRoutes = async (retries = 1) => {
    console.log('[WellnessContext.jsx] Testing wellness routes...')
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const res = await fetch('/api/wellness/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        console.log(`[WellnessContext.jsx] Server responded with status: ${res.status}`)
        return false
      }

      // Check if response is JSON
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.log(`[WellnessContext.jsx] Server returned non-JSON response: ${contentType}`)
        return false
      }

      const data = await res.json()
      console.log('[WellnessContext.jsx] Test response:', data)
      return true
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error('[WellnessContext.jsx] Test timed out - server not responding')
      } else {
        console.error('[WellnessContext.jsx] Test failed:', err.message)
      }
      return false
    }
  }

  // Get all past wellness assessments for the current user
  const getAssessmentHistory = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      // Load from localStorage if no token (user not logged in)
      const localAssessments = getLocalAssessments()
      dispatch({ type: 'GET_ASSESSMENTS_SUCCESS', payload: localAssessments })
      return
    }

    dispatch({ type: 'ASSESSMENT_LOADING' })

    // First test if wellness routes are accessible
    const routesWorking = await testWellnessRoutes()
    if (!routesWorking) {
      // Load from localStorage as fallback
      console.log('[WellnessContext.jsx] Backend unavailable, loading from localStorage')
      const localAssessments = getLocalAssessments()
      dispatch({ type: 'GET_ASSESSMENTS_SUCCESS', payload: localAssessments })
      return
    }

    try {
      const res = await fetch('/api/wellness/history', {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      })

      // Check if response is JSON
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }

      const data = await res.json()

      if (res.ok) {
        // Merge server data with local data (server data takes precedence)
        const localAssessments = getLocalAssessments()
        const mergedData = [...data]

        // Add local assessments that aren't already in server data
        localAssessments.forEach(local => {
          const exists = mergedData.some(server => server._id === local._id)
          if (!exists) {
            mergedData.push(local)
          }
        })

        // Sort by createdAt descending
        mergedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        dispatch({ type: 'GET_ASSESSMENTS_SUCCESS', payload: mergedData })
      } else {
        // Handle specific error cases - fall back to local data
        if (res.status === 503) {
          console.log('[WellnessContext.jsx] Database unavailable, using local data')
          const localAssessments = getLocalAssessments()
          dispatch({ type: 'GET_ASSESSMENTS_SUCCESS', payload: localAssessments })
        } else {
          // Other server errors - still try to show local data
          console.log('[WellnessContext.jsx] Server error, falling back to local data')
          const localAssessments = getLocalAssessments()
          dispatch({ type: 'GET_ASSESSMENTS_SUCCESS', payload: localAssessments })
        }
      }
    } catch (err) {
      console.error('[WellnessContext.jsx] Error fetching assessment history:', err.message)
      // Network error - fall back to local data
      console.log('[WellnessContext.jsx] Network error, using local data')
      const localAssessments = getLocalAssessments()
      dispatch({ type: 'GET_ASSESSMENTS_SUCCESS', payload: localAssessments })
    }
  }

  // Create a new wellness assessment and get prediction
  const assessWellness = async (inputs) => {
    // Validate inputs before proceeding
    if (!inputs || typeof inputs !== 'object') {
      dispatch({ type: 'WELLNESS_ERROR', payload: 'Invalid assessment data provided.' })
      return
    }

    // Check if this looks like meaningful user input (not default values)
    const hasMeaningfulData = inputs.sleepHours > 0 ||
                             inputs.exerciseFrequency > 0 ||
                             inputs.screenTime > 0 ||
                             inputs.littleInterest > 0 ||
                             inputs.feelingDown > 0 ||
                             inputs.troubleConcentrating > 0 ||
                             inputs.feelingTired > 0 ||
                             inputs.feelingAnxious > 0 ||
                             inputs.hoursWorked > 0 ||
                             inputs.deadlinePressure !== 'low';

    if (!hasMeaningfulData) {
      dispatch({ type: 'WELLNESS_ERROR', payload: 'Please provide meaningful wellness information before submitting.' })
      return
    }

    dispatch({ type: 'ASSESSMENT_LOADING' })

    const token = localStorage.getItem('token')
    if (!token) {
      dispatch({ type: 'WELLNESS_ERROR', payload: 'Please log in to use the wellness assessment feature.' })
      return
    }

    // First test if wellness routes are accessible
    const routesWorking = await testWellnessRoutes()
    if (!routesWorking) {
      // Perform local prediction and save locally if backend is unavailable
      console.log('[WellnessContext.jsx] Backend unavailable, performing local prediction and saving locally')
      const localPrediction = await performLocalPrediction(inputs)
      const localAssessment = saveLocalAssessment({
        ...localPrediction,
        disclaimer: 'This assessment is not a medical diagnosis. It is intended for awareness and self-reflection only.',
        saved: false,
        note: 'Assessment stored locally - backend not available'
      })
      dispatch({ type: 'ASSESS_WELLNESS_SUCCESS', payload: localAssessment })
      return
    }

    try {
      const res = await fetch('/api/wellness/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(inputs),
      })

      // Check if response is JSON
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }

      const data = await res.json()

      if (res.ok) {
        // Save locally as backup even when backend save succeeds
        if (data.saved) {
          console.log('[WellnessContext.jsx] Assessment saved to database, also saving locally as backup')
          saveLocalAssessment(data)
        }
        dispatch({ type: 'ASSESS_WELLNESS_SUCCESS', payload: data })
      } else {
        // Backend responded but with error - save locally as fallback
        console.log('[WellnessContext.jsx] Backend error, saving locally as fallback')
        const localPrediction = await performLocalPrediction(inputs)
        const localAssessment = saveLocalAssessment({
          ...localPrediction,
          disclaimer: 'This assessment is not a medical diagnosis. It is intended for awareness and self-reflection only.',
          saved: false,
          note: `Server error (${res.status}): ${data.msg || 'Unknown error'}`
        })
        dispatch({ type: 'ASSESS_WELLNESS_SUCCESS', payload: localAssessment })
      }
    } catch (err) {
      console.error('[WellnessContext.jsx] Error performing wellness assessment:', err.message)
      // Network error or server not responding - save locally
      console.log('[WellnessContext.jsx] Network error, saving locally as fallback')
      const localPrediction = await performLocalPrediction(inputs)
      const localAssessment = saveLocalAssessment({
        ...localPrediction,
        disclaimer: 'This assessment is not a medical diagnosis. It is intended for awareness and self-reflection only.',
        saved: false,
        note: 'Network error - assessment stored locally'
      })
      dispatch({ type: 'ASSESS_WELLNESS_SUCCESS', payload: localAssessment })
    }
  }

  // Clear current assessment result
  const clearAssessmentResult = () => {
    dispatch({ type: 'CLEAR_ASSESSMENT_RESULT' })
  }

  return (
    <WellnessContext.Provider
      value={{
        ...state,
        getAssessmentHistory,
        assessWellness,
        clearAssessmentResult,
      }}
    >
      {children}
    </WellnessContext.Provider>
  )
}

export { WellnessContext, WellnessProvider }
