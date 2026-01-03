const express = require('express')
const router = express.Router()
const { spawn } = require('child_process')
const path = require('path')
const auth = require('../middleware/authMiddleware')
const multer = require('multer')
const MentalHealthAssessment = require('../models/MentalHealthAssessment')
const HeartDiseaseAssessment = require('../models/HeartDiseaseAssessment')
const DiabetesAssessment = require('../models/DiabetesAssessment')

const upload = multer({ storage: multer.memoryStorage() })

// @route   POST /api/health/diabetes-predict
// @desc    Predict diabetes risk using ML model
// @access  Private
router.post('/diabetes-predict', (req, res, next) => {
  // Check if this is a FormData request (multipart) or JSON request
  const contentType = req.headers['content-type'] || ''

  if (contentType.includes('multipart/form-data')) {
    // Use multer for FormData requests
    upload.single('profileImage')(req, res, next)
  } else {
    // Skip multer for JSON requests
    next()
  }
}, auth, async (req, res) => {
  console.log('[healthRoutes.js] Diabetes prediction request for user:', req.user.id)
  console.log('[healthRoutes.js] Request Body:', req.body);

  try {
    const {
      pregnancies,
      glucose,
      bloodPressure,
      skinThickness,
      insulin,
      bmi,
      diabetesPedigreeFunction,
      age
    } = req.body

    // Validate required fields
    const requiredFields = [
      'pregnancies', 'glucose', 'bloodPressure', 'skinThickness',
      'insulin', 'bmi', 'diabetesPedigreeFunction', 'age'
    ]

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ msg: `Missing required field: ${field}` })
      }
      if (typeof req.body[field] !== 'number' || req.body[field] < 0) {
        return res.status(400).json({ msg: `Invalid value for ${field}: must be a non-negative number` })
      }
    }

    console.log('[healthRoutes.js] Input validation passed, calling Python model...')

    // Call Python diabetes prediction model
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../diabetes_model.py'),
      pregnancies.toString(),
      glucose.toString(),
      bloodPressure.toString(),
      skinThickness.toString(),
      insulin.toString(),
      bmi.toString(),
      diabetesPedigreeFunction.toString(),
      age.toString()
    ])

    let result = ''
    let errorOutput = ''

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on('close', async (code) => {
      console.log(`[healthRoutes.js] Python process exited with code ${code}`)

      if (code !== 0) {
        console.error('[healthRoutes.js] Python process error:', errorOutput)
        return res.status(500).json({
          msg: 'Prediction model error',
          error: errorOutput || 'Unknown error occurred'
        })
      }

      try {
        const predictionResult = JSON.parse(result.trim())
        console.log('[healthRoutes.js] Prediction successful:', predictionResult)
        console.log('[healthRoutes.js] Parsed Prediction Result from Python:', predictionResult);

        // Calculate riskScore and confidence as percentages
        const riskScorePercentage = (predictionResult.probability * 100).toFixed(1);
        const confidencePercentage = (predictionResult.confidence * 100).toFixed(1);

        // Add disclaimer and format response
        const response = {
          ...predictionResult,
          riskScore: parseFloat(riskScorePercentage), // Add riskScore as a percentage
          confidence: parseFloat(confidencePercentage), // Ensure confidence is a percentage
          disclaimer: 'This assessment is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for medical concerns and proper diagnosis.',
          timestamp: new Date().toISOString(),
          saved_to_history: false // Mark as not saved initially
        }

        res.json(response)

      } catch (parseError) {
        console.error('[healthRoutes.js] JSON parse error:', parseError)
        console.error('[healthRoutes.js] Raw result:', result)
        res.status(500).json({
          msg: 'Error parsing prediction result',
          error: parseError.message
        })
      }
    })

    pythonProcess.on('error', (error) => {
      console.error('[healthRoutes.js] Failed to start Python process:', error)
      res.status(500).json({
        msg: 'Failed to execute prediction model',
        error: error.message
      })
    })

  } catch (err) {
    console.error('[healthRoutes.js] Diabetes prediction error:', err.message)
    res.status(500).json({
      msg: 'Server error during diabetes prediction',
      error: err.message
    })
  }
})

// @route   POST /api/health/diabetes-save
// @desc    Save a diabetes assessment to the database
// @access  Private
router.post('/diabetes-save', auth, async (req, res) => {
  console.log('[healthRoutes.js] Diabetes assessment save request for user:', req.user.id)
  try {
    const {
      pregnancies, glucose, bloodPressure, skinThickness,
      insulin, bmi, diabetesPedigreeFunction, age,
      prediction, riskScore, confidence
    } = req.body

    // Validate required prediction result fields
    if (!prediction || riskScore === undefined || confidence === undefined) {
      return res.status(400).json({ msg: 'Missing prediction results for saving' })
    }

    const assessment = new DiabetesAssessment({
      user: req.user.id,
      inputs: {
        pregnancies, glucose, bloodPressure, skinThickness,
        insulin, bmi, diabetesPedigreeFunction, age
      },
      prediction: prediction,
      risk: prediction, // Assuming prediction string is also the risk level
      probability: confidence / 100, // Convert confidence percentage to probability for storage
      confidence: confidence,
      riskScore: riskScore,
      recommendations: [], // Recommendations will be generated on the frontend or can be added here if model returns them
    })

    await assessment.save()
    console.log('[healthRoutes.js] Diabetes assessment explicitly saved to database', assessment._id)

    res.json({ msg: 'Diabetes assessment saved successfully', assessmentId: assessment._id })

  } catch (err) {
    console.error('[healthRoutes.js] Diabetes save error:', err.message)
    res.status(500).json({
      msg: 'Server error during diabetes assessment save',
      error: err.message
    })
  }
})

// @route   GET /api/health/test
// @desc    Test health routes
// @access  Public
router.get('/test', (req, res) => {
  console.log('[healthRoutes.js] Health routes test called')
  res.json({
    message: 'Health prediction routes are working!',
    timestamp: new Date().toISOString(),
    available_endpoints: [
      'POST /api/health/diabetes-predict',
      'POST /api/health/heart-predict',
      'POST /api/health/mental-health-predict',
      'GET /api/health/diabetes-history',
      'GET /api/health/heart-disease-history',
      'GET /api/health/mental-health-history'
    ]
  })
})

// @route   POST /api/health/heart-predict
// @desc    Predict heart disease risk using ML model
// @access  Private
router.post('/heart-predict', auth, async (req, res) => {
  console.log('[healthRoutes.js] Heart disease prediction request for user:', req.user ? req.user.id : 'unauthenticated')

  try {
    const {
      age,
      sex,
      chestPainType,
      restingBP,
      cholesterol,
      fastingBS,
      restingECG,
      maxHR,
      exerciseAngina,
      oldpeak,
      stSlope
    } = req.body

    // Validate required fields
    const requiredFields = [
      'age', 'sex', 'chestPainType', 'restingBP', 'cholesterol',
      'fastingBS', 'restingECG', 'maxHR', 'exerciseAngina', 'oldpeak', 'stSlope'
    ]

    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({ msg: `Missing required field: ${field}` })
      }
      if (typeof req.body[field] !== 'number' && typeof req.body[field] !== 'string') {
        return res.status(400).json({ msg: `Invalid type for ${field}: must be a number or string` })
      }
    }

    console.log('[healthRoutes.js] Input validation passed, calling Python heart disease model...')

    // Call Python heart disease prediction model
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../heart_disease_model.py'),
      age.toString(),
      sex.toString(),
      chestPainType.toString(),
      restingBP.toString(),
      cholesterol.toString(),
      fastingBS.toString(),
      restingECG.toString(),
      maxHR.toString(),
      exerciseAngina.toString(),
      oldpeak.toString(),
      stSlope.toString()
    ])

    let result = ''
    let errorOutput = ''

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on('close', async (code) => {
      console.log(`[healthRoutes.js] Python heart disease process exited with code ${code}`)

      if (code !== 0) {
        console.error('[healthRoutes.js] Python process error:', errorOutput)
        return res.status(500).json({
          msg: 'Heart disease prediction model error',
          error: errorOutput || 'Unknown error occurred'
        })
      }

      try {
        const predictionResult = JSON.parse(result.trim())
        console.log('[healthRoutes.js] Heart disease prediction successful:', predictionResult)

        // Add disclaimer and format response
        const response = {
          ...predictionResult,
          disclaimer: 'This assessment is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers, particularly cardiologists, for cardiovascular concerns.',
          timestamp: new Date().toISOString(),
          saved_to_history: false // Mark as not saved initially
        }

        res.json(response)

      } catch (parseError) {
        console.error('[healthRoutes.js] JSON parse error:', parseError)
        console.error('[healthRoutes.js] Raw result:', result)
        res.status(500).json({
          msg: 'Error parsing heart disease prediction result',
          error: parseError.message
        })
      }
    })

    pythonProcess.on('error', (error) => {
      console.error('[healthRoutes.js] Failed to start Python heart disease process:', error)
      // Fallback: Return mock prediction data for testing
      console.log('[healthRoutes.js] Using fallback mock prediction data')
      const mockResult = {
        prediction: 0,
        probability: 0.35,
        risk: 'Moderate',
        confidence: 0.35,
        recommendations: [
          'This is a mock prediction for testing purposes.',
          'Please consult a healthcare professional for actual medical advice.',
          'Server ML model temporarily unavailable due to system constraints.'
        ],
        risk_factors: {
          age_risk: 0.3,
          gender_risk: 0.5,
          chest_pain_risk: 0.4,
          bp_risk: 0.3,
          cholesterol_risk: 0.6,
          fbs_risk: 0.0,
          hr_risk: 0.4,
          angina_risk: 0.0,
          st_depression_risk: 0.2,
          st_slope_risk: 0.3,
          total_risk_score: 0.35
        },
        model_info: {
          name: 'Heart Disease Risk Predictor (Mock)',
          dataset: 'Cleveland Heart Disease Dataset',
          accuracy: 'Mock Data - 85-90%',
          algorithm: 'Fallback Mode',
          features_used: 11
        },
        disclaimer: 'This assessment is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for cardiovascular concerns.',
        timestamp: new Date().toISOString(),
        note: 'Mock prediction data - ML model temporarily unavailable'
      }
      res.json(mockResult)
    })

  } catch (err) {
    console.error('[healthRoutes.js] Heart disease prediction error:', err.message)
    res.status(500).json({
      msg: 'Server error during heart disease prediction',
      error: err.message
    })
  }
})

// @route   POST /api/health/heart-disease-save
// @desc    Save a heart disease assessment to the database
// @access  Private
router.post('/heart-disease-save', auth, async (req, res) => {
  console.log('[healthRoutes.js] Heart disease assessment save request for user:', req.user.id)
  try {
    const {
      age, sex, chestPainType, restingBP, cholesterol,
      fastingBS, restingECG, maxHR, exerciseAngina, oldpeak, stSlope,
      prediction, riskScore, confidence
    } = req.body

    // Validate required prediction result fields
    if (!prediction || riskScore === undefined || confidence === undefined) {
      return res.status(400).json({ msg: 'Missing prediction results for saving' })
    }

    const assessment = new HeartDiseaseAssessment({
      user: req.user.id,
      inputs: {
        age, sex, chestPainType, restingBP, cholesterol,
        fastingBS, restingECG, maxHR, exerciseAngina, oldpeak, stSlope
      },
      prediction: prediction,
      risk: prediction, // Assuming prediction string is also the risk level
      probability: confidence / 100, // Convert confidence percentage to probability
      confidence: confidence,
      riskScore: riskScore,
      recommendations: [], // Recommendations will be generated on the frontend or can be added here if model returns them
    })

    await assessment.save()
    console.log('[healthRoutes.js] Heart disease assessment explicitly saved to database', assessment._id)

    res.json({ msg: 'Heart disease assessment saved successfully', assessmentId: assessment._id })

  } catch (err) {
    console.error('[healthRoutes.js] Heart disease save error:', err.message)
    res.status(500).json({
      msg: 'Server error during heart disease assessment save',
      error: err.message
    })
  }
})

// @route   POST /api/health/mental-health-predict
// @desc    Predict mental health status using standardized assessments
// @access  Private
router.post('/mental-health-predict', auth, async (req, res) => {
  console.log('[healthRoutes.js] Mental health prediction request for user:', req.user ? req.user.id : 'unauthenticated')

  try {
    const {
      phq9_answers,
      gad7_answers,
      pss_answers,
      who5_answers
    } = req.body

    // Validate required fields and array lengths
    const requiredFields = ['phq9_answers', 'gad7_answers', 'pss_answers', 'who5_answers']

    for (const field of requiredFields) {
      if (!req.body[field] || !Array.isArray(req.body[field])) {
        return res.status(400).json({ msg: `Missing or invalid required field: ${field}` })
      }
    }

    // Validate array lengths
    if (phq9_answers.length !== 9) {
      return res.status(400).json({ msg: 'PHQ-9 must have exactly 9 answers' })
    }
    if (gad7_answers.length !== 7) {
      return res.status(400).json({ msg: 'GAD-7 must have exactly 7 answers' })
    }
    if (pss_answers.length !== 10) {
      return res.status(400).json({ msg: 'PSS-10 must have exactly 10 answers' })
    }
    if (who5_answers.length !== 5) {
      return res.status(400).json({ msg: 'WHO-5 must have exactly 5 answers' })
    }

    // Validate answer ranges
    const validateRange = (answers, fieldName, min, max) => {
      for (let i = 0; i < answers.length; i++) {
        if (typeof answers[i] !== 'number' || answers[i] < min || answers[i] > max) {
          return res.status(400).json({
            msg: `Invalid ${fieldName} answer at position ${i+1}: must be a number between ${min} and ${max}`
          })
        }
      }
      return null
    }

    let validationError = validateRange(phq9_answers, 'PHQ-9', 0, 3)
    if (validationError) return validationError

    validationError = validateRange(gad7_answers, 'GAD-7', 0, 3)
    if (validationError) return validationError

    validationError = validateRange(pss_answers, 'PSS-10', 0, 4)
    if (validationError) return validationError

    validationError = validateRange(who5_answers, 'WHO-5', 0, 5)
    if (validationError) return validationError

    console.log('[healthRoutes.js] Input validation passed, calling Python mental health model...')

    // Call Python mental health prediction model
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../mental_health_model.py'),
      ...phq9_answers.map(String),
      ...gad7_answers.map(String),
      ...pss_answers.map(String),
      ...who5_answers.map(String)
    ])

    let result = ''
    let errorOutput = ''

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on('close', async (code) => {
      console.log(`[healthRoutes.js] Python mental health process exited with code ${code}`)

      if (code !== 0) {
        console.error('[healthRoutes.js] Python process error:', errorOutput)
        return res.status(500).json({
          msg: 'Mental health prediction model error',
          error: errorOutput || 'Unknown error occurred'
        })
      }

      try {
        const predictionResult = JSON.parse(result.trim())
        console.log('[healthRoutes.js] Mental health prediction successful')

        // Add disclaimer and format response (no automatic saving)
        const response = {
          ...predictionResult,
          disclaimer: 'This assessment is for informational and educational purposes only and should NOT replace professional mental health diagnosis, treatment, or counseling. Always consult with qualified mental health professionals, psychiatrists, or therapists for proper evaluation and care. If you are experiencing severe symptoms or having thoughts of self-harm, please seek immediate professional help.',
          timestamp: new Date().toISOString()
        }

        res.json(response)

      } catch (parseError) {
        console.error('[healthRoutes.js] JSON parse error:', parseError)
        console.error('[healthRoutes.js] Raw result:', result)
        res.status(500).json({
          msg: 'Error parsing mental health prediction result',
          error: parseError.message
        })
      }
    })

    pythonProcess.on('error', (error) => {
      console.error('[healthRoutes.js] Failed to start Python mental health process:', error)
      res.status(500).json({
        msg: 'Failed to execute mental health prediction model',
        error: error.message
      })
    })

  } catch (err) {
    console.error('[healthRoutes.js] Mental health prediction error:', err.message)
    res.status(500).json({
      msg: 'Server error during mental health prediction',
      error: err.message
    })
  }
})

// @route   GET /api/health/mental-health-history
// @desc    Get user's mental health assessment history
// @access  Private
router.get('/mental-health-history', auth, async (req, res) => {
  try {
    console.log('[healthRoutes.js] GET /mental-health-history called for user:', req.user.id)

    const assessments = await MentalHealthAssessment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)

    console.log(`[healthRoutes.js] Found ${assessments.length} mental health assessments for user ${req.user.id}`)

    res.json({
      assessments: assessments.map(assessment => ({
        id: assessment._id,
        createdAt: assessment.createdAt,
        overall_status: assessment.overall_status,
        severity_levels: assessment.severity_levels,
        scores: assessment.scores
      })),
      total: assessments.length
    })

  } catch (err) {
    console.error('[healthRoutes.js] Mental health history error:', err.message)
    res.status(500).json({
      msg: 'Server error retrieving mental health history',
      error: err.message
    })
  }
})

// @route   GET /api/health/heart-disease-history
// @desc    Get user's heart disease assessment history
// @access  Private
router.get('/heart-disease-history', auth, async (req, res) => {
  try {
    console.log('[healthRoutes.js] GET /heart-disease-history called for user:', req.user.id)

    const assessments = await HeartDiseaseAssessment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)

    console.log(`[healthRoutes.js] Found ${assessments.length} heart disease assessments for user ${req.user.id}`)

    res.json({
      assessments: assessments.map(assessment => ({
        id: assessment._id,
        createdAt: assessment.createdAt,
        risk: assessment.risk,
        prediction: assessment.prediction,
        probability: assessment.probability,
        inputs: assessment.inputs
      })),
      total: assessments.length
    })

  } catch (err) {
    console.error('[healthRoutes.js] Heart disease history error:', err.message)
    res.status(500).json({
      msg: 'Server error retrieving heart disease history',
      error: err.message
    })
  }
})

// @route   GET /api/health/diabetes-history
// @desc    Get user's diabetes assessment history
// @access  Private
router.get('/diabetes-history', auth, async (req, res) => {
  try {
    console.log('[healthRoutes.js] GET /diabetes-history called for user:', req.user.id)

    const assessments = await DiabetesAssessment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)

    console.log(`[healthRoutes.js] Found ${assessments.length} diabetes assessments for user ${req.user.id}`)

    res.json({
      assessments: assessments.map(assessment => ({
        id: assessment._id,
        createdAt: assessment.createdAt,
        risk: assessment.risk,
        prediction: assessment.prediction,
        probability: assessment.probability,
        inputs: assessment.inputs
      })),
      total: assessments.length
    })

  } catch (err) {
    console.error('[healthRoutes.js] Diabetes history error:', err.message)
    res.status(500).json({
      msg: 'Server error retrieving diabetes history',
      error: err.message
    })
  }
})

module.exports = router
