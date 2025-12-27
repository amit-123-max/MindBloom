const mongoose = require('mongoose')

const JournalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral', 'happy', 'sad', 'anxious', 'angry', 'calm', 'excited', 'tired', 'confused', 'hopeful', 'grateful'],
    default: 'neutral',
  },
  moodPrediction: {
    mood: {
      type: String,
      enum: ['happy', 'sad', 'anxious', 'angry', 'calm', 'excited', 'tired', 'confused', 'hopeful', 'grateful', 'neutral'],
      default: 'neutral'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    model: {
      type: String,
      default: 'keyword-based'
    },
    processedAt: {
      type: Date,
      default: Date.now
    }
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Pre-save hook removed to prevent 'next is not a function' errors
// updatedAt is handled manually in the routes

module.exports = mongoose.model('Journal', JournalSchema)
