const mongoose = require('mongoose')

const SleepHygieneItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    enum: ['consistentSchedule', 'coolDarkRoom', 'noScreens', 'noCaffeine', 'relaxationRoutine', 'comfortableBed']
  },
  completed: {
    type: Boolean,
    default: false
  }
})

const StudentSleepSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Sleep metrics
  hoursSlept: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  sleepQuality: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  bedtime: {
    type: String, // HH:MM format
    required: true
  },
  wakeTime: {
    type: String, // HH:MM format
    required: true
  },

  // Lifestyle factors
  caffeineIntake: {
    type: Number, // cups
    default: 0,
    min: 0,
    max: 20
  },
  screenTime: {
    type: Number, // hours before bed
    default: 0,
    min: 0,
    max: 12
  },
  stressLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },

  // Sleep hygiene checklist
  hygieneChecklist: [SleepHygieneItemSchema],

  // Calculated metrics
  hygieneScore: {
    type: Number, // 0-6 (number of completed items)
    default: 0,
    min: 0,
    max: 6
  },
  burnoutRisk: {
    type: Number, // 0-100
    required: true,
    min: 0,
    max: 100
  },

  // Weekly tracking
  weekData: [{
    date: {
      type: String, // YYYY-MM-DD format
      required: true
    },
    hoursSlept: Number,
    sleepQuality: Number,
    burnoutRisk: Number,
    hygieneScore: Number
  }],

  // AI predictions
  predictions: {
    riskLevel: String, // 'Low', 'Moderate', 'High'
    recommendations: [String],
    insights: String
  },

  // Metadata
  timestamp: {
    type: Date,
    default: Date.now
  },
  date: {
    type: String, // YYYY-MM-DD format for daily tracking
    required: true
  }
})

// Index for efficient queries
StudentSleepSchema.index({ userId: 1, date: -1 })
StudentSleepSchema.index({ userId: 1, timestamp: -1 })
StudentSleepSchema.index({ date: -1 })

// Pre-save middleware to calculate hygiene score
StudentSleepSchema.pre('save', function(next) {
  if (this.hygieneChecklist && this.hygieneChecklist.length > 0) {
    this.hygieneScore = this.hygieneChecklist.filter(item => item.completed).length
  }
  next()
})

module.exports = mongoose.model('StudentSleep', StudentSleepSchema)
