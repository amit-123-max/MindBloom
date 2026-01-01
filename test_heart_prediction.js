// Test script for heart disease prediction
// Run with: node test_heart_prediction.js

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Test data - sample heart disease patient data
const testData = {
  age: 45,
  sex: 1, // Male
  chestPainType: 2, // Non-anginal pain
  restingBP: 140,
  cholesterol: 250,
  fastingBS: 0, // Not diabetic
  restingECG: 0, // Normal
  maxHR: 150,
  exerciseAngina: 0, // No
  oldpeak: 1.5,
  stSlope: 1 // Flat
}

console.log('Testing Heart Disease Prediction Model')
console.log('========================================')
console.log('Test Data:', testData)
console.log('')

// Call the Python heart disease model
const pythonProcess = spawn('python3', [
  path.join(__dirname, 'backend/heart_disease_model.py'),
  testData.age.toString(),
  testData.sex.toString(),
  testData.chestPainType.toString(),
  testData.restingBP.toString(),
  testData.cholesterol.toString(),
  testData.fastingBS.toString(),
  testData.restingECG.toString(),
  testData.maxHR.toString(),
  testData.exerciseAngina.toString(),
  testData.oldpeak.toString(),
  testData.stSlope.toString()
])

let result = ''
let errorOutput = ''

pythonProcess.stdout.on('data', (data) => {
  result += data.toString()
})

pythonProcess.stderr.on('data', (data) => {
  errorOutput += data.toString()
})

pythonProcess.on('close', (code) => {
  console.log(`Python process exited with code ${code}`)

  if (code !== 0) {
    console.error('Python process error:', errorOutput)
    return
  }

  try {
    const predictionResult = JSON.parse(result.trim())
    console.log('Heart Disease Prediction Result:')
    console.log('================================')
    console.log(`Risk Level: ${predictionResult.risk}`)
    console.log(`Confidence: ${(predictionResult.confidence * 100).toFixed(1)}%`)
    console.log(`Prediction: ${predictionResult.prediction === 1 ? 'High Risk' : 'Low Risk'}`)
    console.log('')
    console.log('Risk Factors Analysis:')
    predictionResult.risk_factors && Object.entries(predictionResult.risk_factors).forEach(([factor, value]) => {
      if (factor !== 'total_risk_score') {
        console.log(`  ${factor}: ${(value * 100).toFixed(1)}%`)
      }
    })
    console.log('')
    console.log('Recommendations:')
    predictionResult.recommendations && predictionResult.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`)
    })

  } catch (parseError) {
    console.error('JSON parse error:', parseError)
    console.error('Raw result:', result)
  }
})

pythonProcess.on('error', (error) => {
  console.error('Failed to start Python process:', error)
})
