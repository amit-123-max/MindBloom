const mongoose = require('mongoose')

const ReflectionResponseSchema = new mongoose.Schema({
  promptId: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  }
})

const StudentConfidenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Reflection responses
  reflections: [ReflectionResponseSchema],

  // Anonymous journaling
  anonymousJournal: {
    type: String,
    default: ''
  },

  // Comparison thoughts
  comparisonThoughts: {
    type: String,
    default: ''
  },

  // Session data
  affirmationsViewed: [{
    affirmation: String,
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // AI analysis
  predictions: {
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative', 'Mixed']
    },
    feedback: String,
    affirmations: [String], // Personalized affirmations
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100
    },
    improvementAreas: [String]
  },

  // Progress tracking
  sessionNumber: {
    type: Number,
    default: 1
  },
  streakDays: {
    type: Number,
    default: 0
  },

  // Metadata
  timestamp: {
    type: Date,
    default: Date.now
  },
  completedPrompts: {
    type: Number,
    default: 0,
    min: 0,
    max: 5 // Total number of reflection prompts
  }
})

// Index for efficient queries
StudentConfidenceSchema.index({ userId: 1, timestamp: -1 })
StudentConfidenceSchema.index({ timestamp: -1 })

// Pre-save middleware to calculate completion stats
StudentConfidenceSchema.pre('save', function(next) {
  if (this.reflections && this.reflections.length > 0) {
    this.completedPrompts = this.reflections.length
  }
  next()
})

module.exports = mongoose.model('StudentConfidence', StudentConfidenceSchema)
