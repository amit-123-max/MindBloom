const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  estimatedTime: {
    type: Number, // in minutes
    required: true,
    min: 5,
    max: 480 // 8 hours
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  timeSpent: Number // actual time spent in minutes
})

const StudentProcrastinationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Task management
  tasks: [TaskSchema],

  // Pomodoro session data
  completedPomodoros: {
    type: Number,
    default: 0,
    min: 0
  },

  // Productivity metrics
  productivityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  // Reflection
  reflection: {
    type: String,
    default: ''
  },

  // Session timing
  sessionStart: {
    type: Date,
    default: Date.now
  },
  sessionEnd: Date,

  // AI predictions
  predictions: {
    riskLevel: String, // 'Low', 'Medium', 'High'
    advice: String,
    suggestions: [String]
  },

  // Metadata
  timestamp: {
    type: Date,
    default: Date.now
  }
})

// Index for efficient queries
StudentProcrastinationSchema.index({ userId: 1, timestamp: -1 })
StudentProcrastinationSchema.index({ timestamp: -1 })

module.exports = mongoose.model('StudentProcrastination', StudentProcrastinationSchema)
