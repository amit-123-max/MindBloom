const mongoose = require('mongoose')

const MentalHealthAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // PHQ-9 Assessment (Depression)
  phq9_answers: [{
    type: Number,
    required: true,
    min: 0,
    max: 3,
  }],
  // GAD-7 Assessment (Anxiety)
  gad7_answers: [{
    type: Number,
    required: true,
    min: 0,
    max: 3,
  }],
  // PSS-10 Assessment (Stress)
  pss_answers: [{
    type: Number,
    required: true,
    min: 0,
    max: 4,
  }],
  // WHO-5 Assessment (Well-being)
  who5_answers: [{
    type: Number,
    required: true,
    min: 0,
    max: 5,
  }],
  // Calculated scores
  scores: {
    phq9_total: { type: Number, required: true, min: 0, max: 27 },
    gad7_total: { type: Number, required: true, min: 0, max: 21 },
    pss_total: { type: Number, required: true, min: 0, max: 40 },
    who5_total: { type: Number, required: true, min: 0, max: 25 },
  },
  // Severity levels
  severity_levels: {
    depression: {
      type: String,
      enum: ['Minimal Depression', 'Mild Depression', 'Moderate Depression', 'Moderately Severe Depression', 'Severe Depression'],
      required: true,
    },
    anxiety: {
      type: String,
      enum: ['Minimal Anxiety', 'Mild Anxiety', 'Moderate Anxiety', 'Severe Anxiety'],
      required: true,
    },
    stress: {
      type: String,
      enum: ['Low Stress', 'Moderate Stress', 'High Stress'],
      required: true,
    },
    wellbeing: {
      type: String,
      enum: ['Poor Well-being', 'Fair Well-being', 'Good Well-being', 'Very Good Well-being', 'Excellent Well-being'],
      required: true,
    },
  },
  overall_status: {
    type: String,
    enum: ['Excellent Mental Health', 'Good Mental Health', 'Fair Mental Health', 'Poor Mental Health', 'Critical Mental Health'],
    required: true,
  },
  recommendations: [{
    type: String,
  }],
  risk_factors: {
    depression_symptoms: {
      anhedonia: { type: Number, min: 0, max: 6 },
      mood_disturbance: { type: Number, min: 0, max: 6 },
      somatic_symptoms: { type: Number, min: 0, max: 9 },
      cognitive_symptoms: { type: Number, min: 0, max: 6 },
    },
    anxiety_symptoms: {
      general_anxiety: { type: Number, min: 0, max: 6 },
      worry_excess: { type: Number, min: 0, max: 6 },
      physical_symptoms: { type: Number, min: 0, max: 9 },
    },
    stress_factors: {
      uncontrollable_stress: { type: Number, min: 0, max: 16 },
      overload_stress: { type: Number, min: 0, max: 16 },
      coping_difficulty: { type: Number, min: 0, max: 8 },
    },
    wellbeing_factors: {
      positive_mood: { type: Number, min: 0, max: 10 },
      energy_vitality: { type: Number, min: 0, max: 10 },
      interest_engagement: { type: Number, min: 0, max: 5 },
    },
  },
  model_info: {
    name: { type: String, default: 'Comprehensive Mental Health Assessment' },
    questionnaires: [{ type: String }],
    assessments: [{ type: String }],
    accuracy: { type: String, default: 'Clinically Validated' },
    algorithm: { type: String, default: 'Standardized Scoring System' },
    features_used: { type: Number, default: 31 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('MentalHealthAssessment', MentalHealthAssessmentSchema)
