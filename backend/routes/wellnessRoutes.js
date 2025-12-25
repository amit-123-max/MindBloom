const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const WellnessAssessment = require('../models/WellnessAssessment')

// Test route without auth
router.get('/test', (req, res) => {
  console.log('[wellnessRoutes.js] Test route called')
  res.json({ message: 'Wellness routes are working!', timestamp: new Date().toISOString() })
})


// Helper function for rule-based prediction
const getWellnessPrediction = (inputs) => {
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

// @route   POST /api/wellness/assess
// @desc    Create a new wellness assessment and get prediction
// @access  Private
router.post('/assess', auth, async (req, res) => {
  console.log('[wellnessRoutes.js] POST /assess called for user:', req.user.id)
  try {
    const inputs = req.body
    console.log('[wellnessRoutes.js] Assessment inputs:', inputs)

    // Validate inputs against schema (basic check, Mongoose will do full validation on save)
    const requiredNumeric = ['sleepHours', 'exerciseFrequency', 'screenTime', 'littleInterest', 'feelingDown', 'troubleConcentrating', 'feelingTired', 'feelingAnxious', 'hoursWorked']
    for (const field of requiredNumeric) {
      if (typeof inputs[field] !== 'number' || inputs[field] < 0) {
        return res.status(400).json({ msg: `Invalid or missing input for ${field}` })
      }
    }
    if (!['low', 'medium', 'high'].includes(inputs.deadlinePressure)) {
        return res.status(400).json({ msg: 'Invalid value for deadlinePressure' })
    }

    const { stressLevel, depressionRisk, suggestions } = getWellnessPrediction(inputs)

    // Check if MongoDB is connected
    const isDbConnected = require('mongoose').connection.readyState === 1

    if (isDbConnected) {
      console.log('[wellnessRoutes.js] MongoDB connected, saving assessment...')
      // Save to database if connected
      const newAssessment = new WellnessAssessment({
        user: req.user.id,
        inputs,
        stressLevel,
        depressionRisk,
        suggestions,
      })

      const assessment = await newAssessment.save()
      console.log('[wellnessRoutes.js] Assessment saved with ID:', assessment._id)
      res.json({
        _id: assessment._id,
        user: assessment.user,
        inputs: assessment.inputs,
        stressLevel: assessment.stressLevel,
        depressionRisk: assessment.depressionRisk,
        suggestions: assessment.suggestions,
        createdAt: assessment.createdAt,
        disclaimer: 'This assessment is not a medical diagnosis. It is intended for awareness and self-reflection only.',
        saved: true
      })
    } else {
      // Return prediction without saving if DB not connected
      console.log('[wellnessRoutes.js] MongoDB not connected, returning prediction without saving')
      res.json({
        stressLevel,
        depressionRisk,
        suggestions,
        disclaimer: 'This assessment is not a medical diagnosis. It is intended for awareness and self-reflection only.',
        saved: false,
        note: 'Assessment not saved - database not available'
      })
    }
  } catch (err) {
    console.error('[wellnessRoutes.js] Assessment creation error:', err.message)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Validation Error', errors: err.errors })
    }
    res.status(500).json({ msg: 'Server error', error: err.message })
  }
})

// @route   GET /api/wellness/history
// @desc    Get all past wellness assessments for the authenticated user
// @access  Private
router.get('/history', auth, async (req, res) => {
  console.log('[wellnessRoutes.js] GET /history called for user:', req.user.id)
  try {
    // Check if MongoDB is connected
    if (require('mongoose').connection.readyState !== 1) {
      console.log('[wellnessRoutes.js] MongoDB not connected, returning empty history for development')
      // For development, return empty array instead of error
      return res.json([])
    }

    const assessments = await WellnessAssessment.find({ user: req.user.id }).sort({ createdAt: -1 })
    console.log(`[wellnessRoutes.js] Found ${assessments.length} assessments for user ${req.user.id}`)
    res.json(assessments)
  } catch (err) {
    console.error('[wellnessRoutes.js] Get history error:', err.message)
    res.status(500).json({ msg: 'Server error', error: err.message })
  }
})

// @route   POST /api/wellness/predict
// @desc    Get a wellness prediction without saving to DB
// @access  Private
router.post('/predict', auth, async (req, res) => {
  try {
    const inputs = req.body

    // Basic validation (more comprehensive validation is done by Mongoose if saving)
    const requiredNumeric = ['sleepHours', 'exerciseFrequency', 'screenTime', 'littleInterest', 'feelingDown', 'troubleConcentrating', 'feelingTired', 'feelingAnxious', 'hoursWorked']
    for (const field of requiredNumeric) {
      if (typeof inputs[field] !== 'number' || inputs[field] < 0) {
        return res.status(400).json({ msg: `Invalid or missing input for ${field}` })
      }
    }
    if (!['low', 'medium', 'high'].includes(inputs.deadlinePressure)) {
        return res.status(400).json({ msg: 'Invalid value for deadlinePressure' })
    }

    const { stressLevel, depressionRisk, suggestions } = getWellnessPrediction(inputs)

    res.json({
      stressLevel,
      depressionRisk,
      suggestions,
      disclaimer: 'This assessment is not a medical diagnosis. It is intended for awareness and self-reflection only.'
    })
  } catch (err) {
    console.error('[wellnessRoutes.js] Prediction error:', err.message)
    res.status(500).json({ msg: 'Server error', error: err.message })
  }
})

module.exports = router
