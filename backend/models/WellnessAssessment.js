const mongoose = require('mongoose')

const WellnessAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  inputs: {
    sleepHours: { type: Number, required: true, min: 0, max: 12 },
    exerciseFrequency: { type: Number, required: true, min: 0, max: 7 },
    screenTime: { type: Number, required: true, min: 0 },
    littleInterest: { type: Number, required: true, min: 0, max: 3 },
    feelingDown: { type: Number, required: true, min: 0, max: 3 },
    troubleConcentrating: { type: Number, required: true, min: 0, max: 3 },
    feelingTired: { type: Number, required: true, min: 0, max: 3 },
    feelingAnxious: { type: Number, required: true, min: 0, max: 3 },
    hoursWorked: { type: Number, required: true, min: 0 },
    deadlinePressure: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  },
  stressLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    required: true,
  },
  depressionRisk: {
    type: String,
    enum: ['Low', 'Moderate', 'High'],
    required: true,
  },
  suggestions: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('WellnessAssessment', WellnessAssessmentSchema)
