const mongoose = require('mongoose')

const StudentStressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Stress assessment responses (1-8 scale)
  academicPressure: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  examAnxiety: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  timeManagement: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  peerComparison: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  futureUncertainty: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  sleepQuality: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  copingMechanisms: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  // Calculated stress level (0-100)
  stressLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  // Optional journal entry
  journalEntry: {
    type: String,
    default: ''
  },
  // AI predictions (optional)
  predictions: {
    stressLevel: String,
    advice: String,
    copingStrategies: [String]
  },
  // Metadata
  timestamp: {
    type: Date,
    default: Date.now
  },
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }
})

// Index for efficient queries
StudentStressSchema.index({ userId: 1, timestamp: -1 })
StudentStressSchema.index({ timestamp: -1 })

module.exports = mongoose.model('StudentStress', StudentStressSchema)
