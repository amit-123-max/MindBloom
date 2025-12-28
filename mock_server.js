// Mock server for testing heart disease prediction
// This bypasses macOS network binding issues for testing purposes

const express = require('express')
const cors = require('cors')

const app = express()

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  credentials: true
}))

app.use(express.json())

// Mock heart disease prediction endpoint
app.post('/api/health/heart-predict', async (req, res) => {
  console.log('Mock heart prediction request:', req.body)

  try {
    const inputData = req.body

    // Simple mock prediction logic based on input data
    let riskScore = 0

    // Age factor
    riskScore += Math.min(Math.max((inputData.age - 29) / (77 - 29), 0), 1) * 0.12

    // Gender factor
    riskScore += (inputData.sex === 1 ? 0.08 : 0.03)

    // Chest pain factor
    riskScore += (inputData.chestPainType / 3.0) * 0.15

    // Blood pressure factor
    riskScore += Math.min(Math.max((inputData.restingBP - 90) / (200 - 90), 0), 1) * 0.10

    // Cholesterol factor
    riskScore += Math.min(Math.max((inputData.cholesterol - 126) / (564 - 126), 0), 1) * 0.14

    // Other factors
    riskScore += (inputData.fastingBS === 1 ? 0.06 : 0)
    riskScore += (inputData.exerciseAngina === 1 ? 0.08 : 0)
    riskScore += Math.min(inputData.oldpeak / 6.2, 1) * 0.07

    // Convert to probability
    const probability = 1 / (1 + Math.exp(-(riskScore - 0.7) * 3))
    const riskLevel = probability < 0.25 ? 'Low' : probability < 0.6 ? 'Moderate' : 'High'

    // Mock recommendations
    const recommendations = [
      'Monitor blood pressure regularly and maintain healthy lifestyle.',
      'Consider annual cardiovascular health check-ups.',
      'Maintain regular physical activity and healthy diet.',
      'Consult healthcare provider for personalized advice.',
      'Track cholesterol and blood sugar levels regularly.'
    ]

    const mockResult = {
      prediction: probability > 0.5 ? 1 : 0,
      probability: probability,
      risk: riskLevel,
      confidence: probability,
      recommendations: recommendations.slice(0, 5),
      risk_factors: {
        age_risk: Math.min(Math.max((inputData.age - 29) / (77 - 29), 0), 1),
        gender_risk: inputData.sex === 1 ? 1.0 : 0.3,
        chest_pain_risk: inputData.chestPainType / 3.0,
        bp_risk: Math.min(Math.max((inputData.restingBP - 90) / (200 - 90), 0), 1),
        cholesterol_risk: Math.min(Math.max((inputData.cholesterol - 126) / (564 - 126), 0), 1),
        fbs_risk: inputData.fastingBS === 1 ? 1.0 : 0.0,
        hr_risk: Math.max(0, (220 - inputData.age - inputData.maxHR) / 40),
        angina_risk: inputData.exerciseAngina === 1 ? 1.0 : 0.0,
        st_depression_risk: Math.min(inputData.oldpeak / 6.2, 1),
        st_slope_risk: [0.2, 0.6, 1.0][inputData.stSlope] || 0.5,
        total_risk_score: riskScore
      },
      model_info: {
        name: 'Heart Disease Risk Predictor (Mock)',
        dataset: 'Cleveland Heart Disease Dataset',
        accuracy: 'Mock Data - Testing Mode',
        algorithm: 'Simplified Logistic Regression',
        features_used: 11
      },
      disclaimer: 'This is a mock prediction for testing purposes. In production, this would use the actual ML model. Always consult with qualified healthcare providers for medical concerns.',
      timestamp: new Date().toISOString(),
      note: 'Mock prediction data - Full ML model available when server permissions are resolved'
    }

    console.log('Mock prediction result:', { risk: mockResult.risk, probability: mockResult.probability })
    res.json(mockResult)

  } catch (error) {
    console.error('Mock prediction error:', error)
    res.status(500).json({
      error: 'Mock prediction failed',
      message: error.message
    })
  }
})

// Mock diabetes prediction (for completeness)
app.post('/api/health/diabetes-predict', async (req, res) => {
  const mockResult = {
    prediction: 0,
    probability: 0.3,
    risk: 'Low',
    confidence: 0.3,
    recommendations: ['Mock diabetes prediction - testing mode'],
    disclaimer: 'Mock prediction for testing'
  }
  res.json(mockResult)
})

// Health test endpoint
app.get('/api/health/test', (req, res) => {
  res.json({
    message: 'Mock health server is running!',
    timestamp: new Date().toISOString(),
    available_endpoints: [
      'POST /api/health/diabetes-predict',
      'POST /api/health/heart-predict'
    ],
    note: 'This is a mock server for testing frontend functionality'
  })
})

// Auth test endpoint
app.post('/api/auth/login', (req, res) => {
  res.json({
    token: 'mock_jwt_token_for_testing',
    username: 'testuser',
    email: req.body.email || 'test@example.com'
  })
})

// Start server without binding to avoid macOS issues
console.log('Mock Health Prediction Server Started')
console.log('Available endpoints:')
console.log('  GET  /api/health/test')
console.log('  POST /api/health/diabetes-predict')
console.log('  POST /api/health/heart-predict')
console.log('  POST /api/auth/login')
console.log('')
console.log('Note: This is a mock server for testing. Production server requires macOS permission fixes.')
console.log('Frontend should proxy requests to this mock server for testing.')

// Export for potential use in other files
module.exports = app

// For direct running
if (require.main === module) {
  // Just keep the process alive
  setInterval(() => {
    // Keep alive
  }, 1000)
}
