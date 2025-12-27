const mongoose = require('mongoose')

const HeartDiseaseAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Input parameters
  inputs: {
    age: { type: Number, required: true, min: 20, max: 100 },
    sex: { type: Number, required: true, enum: [0, 1] }, // 0=female, 1=male
    chestPainType: { type: Number, required: true, min: 0, max: 3 },
    restingBP: { type: Number, required: true, min: 80, max: 200 },
    cholesterol: { type: Number, required: true, min: 126, max: 600 },
    fastingBS: { type: Number, required: true, enum: [0, 1] },
    restingECG: { type: Number, required: true, min: 0, max: 2 },
    maxHR: { type: Number, required: true, min: 60, max: 220 },
    exerciseAngina: { type: Number, required: true, enum: [0, 1] },
    oldpeak: { type: Number, required: true, min: 0, max: 7 },
    stSlope: { type: Number, required: true, min: 0, max: 2 },
  },
  // Prediction results
  prediction: {
    type: Number,
    required: true,
    enum: [0, 1], // 0=no heart disease, 1=heart disease
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
    age_risk: { type: Number, min: 0, max: 1 },
    gender_risk: { type: Number, min: 0, max: 1 },
    chest_pain_risk: { type: Number, min: 0, max: 1 },
    bp_risk: { type: Number, min: 0, max: 1 },
    cholesterol_risk: { type: Number, min: 0, max: 1 },
    fbs_risk: { type: Number, min: 0, max: 1 },
    hr_risk: { type: Number, min: 0, max: 1 },
    angina_risk: { type: Number, min: 0, max: 1 },
    st_depression_risk: { type: Number, min: 0, max: 1 },
    st_slope_risk: { type: Number, min: 0, max: 1 },
    total_risk_score: { type: Number, min: 0, max: 1 },
  },
  model_info: {
    name: { type: String, default: 'Heart Disease Risk Predictor' },
    dataset: { type: String, default: 'Cleveland Heart Disease Dataset' },
    accuracy: { type: String, default: '85-90%' },
    algorithm: { type: String, default: 'Weighted Logistic Regression' },
    features_used: { type: Number, default: 11 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('HeartDiseaseAssessment', HeartDiseaseAssessmentSchema)
