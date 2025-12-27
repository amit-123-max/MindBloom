const mongoose = require('mongoose')

const DiabetesAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Input parameters
  inputs: {
    pregnancies: { type: Number, required: true, min: 0, max: 20 },
    glucose: { type: Number, required: true, min: 0, max: 300 },
    bloodPressure: { type: Number, required: true, min: 0, max: 150 },
    skinThickness: { type: Number, required: true, min: 0, max: 100 },
    insulin: { type: Number, required: true, min: 0, max: 1000 },
    bmi: { type: Number, required: true, min: 0, max: 70 },
    diabetesPedigreeFunction: { type: Number, required: true, min: 0, max: 3 },
    age: { type: Number, required: true, min: 15, max: 100 },
  },
  // Prediction results
  prediction: {
    type: Number,
    required: true,
    enum: [0, 1], // 0=no diabetes, 1=diabetes
  },
  probability: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  risk: {
    type: String,
    required: true,
    enum: ['Low', 'Moderate', 'High'],
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  recommendations: [{
    type: String,
  }],
  risk_factors: {
    glucose_score: { type: Number, min: 0, max: 1 },
    bmi_score: { type: Number, min: 0, max: 1 },
    age_score: { type: Number, min: 0, max: 1 },
    total_risk_score: { type: Number, min: 0, max: 1 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('DiabetesAssessment', DiabetesAssessmentSchema)
