const mongoose = require('mongoose')

const InterestRatingSchema = new mongoose.Schema({
  interest: {
    type: String,
    required: true,
    enum: ['creative', 'analytical', 'social', 'practical', 'leadership', 'helping']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  }
})

const CareerSelectionSchema = new mongoose.Schema({
  careerId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  selectedAt: {
    type: Date,
    default: Date.now
  }
})

const StudentCareerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Interest assessment
  interests: [InterestRatingSchema],

  // Personal assessment
  strengths: {
    type: String,
    default: ''
  },
  careerConcerns: {
    type: String,
    default: ''
  },

  // Anxiety assessment
  futureAnxiety: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },

  // Career exploration
  selectedCareers: [CareerSelectionSchema],

  // AI recommendations
  predictions: {
    primaryCareer: String,
    reasoning: String,
    uncertaintyLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High']
    },
    uncertaintyAdvice: String,
    nextSteps: [String],
    alternativeCareers: [String],
    skillGaps: [String]
  },

  // Roadmap progress
  roadmapCreated: {
    type: Boolean,
    default: false
  },
  currentPhase: {
    type: String,
    enum: ['Foundation', 'Exploration', 'Development', 'Launch'],
    default: 'Foundation'
  },

  // Progress tracking
  assessmentsCompleted: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },

  // Metadata
  timestamp: {
    type: Date,
    default: Date.now
  }
})

// Index for efficient queries
StudentCareerSchema.index({ userId: 1, timestamp: -1 })
StudentCareerSchema.index({ timestamp: -1 })

// Pre-save middleware to update lastUpdated
StudentCareerSchema.pre('save', function(next) {
  this.lastUpdated = new Date()
  next()
})

module.exports = mongoose.model('StudentCareer', StudentCareerSchema)
