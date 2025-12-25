const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const Journal = require('../models/Journal')

// @route   GET /api/journals
// @desc    Get all journals for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log(`[journalRoutes.js:10] GET /api/journals - User: ${req.user.id}`)

    // Check if MongoDB is connected
    if (require('mongoose').connection.readyState !== 1) {
      console.log(`[journalRoutes.js:13] MongoDB not connected`)
      return res.status(503).json({
        msg: 'Database not available',
        error: 'MongoDB connection failed',
        location: 'journalRoutes.js:17'
      })
    }

    const journals = await Journal.find({ user: req.user.id }).sort({ date: -1, createdAt: -1 })
    console.log(`[journalRoutes.js:23] Found ${journals.length} journals for user ${req.user.id}`)
    res.json(journals)
  } catch (err) {
    console.error(`[journalRoutes.js:26] GET journals error for user ${req.user.id}:`, err.message)
    res.status(500).json({
      msg: 'Failed to fetch journals',
      error: err.message,
      location: 'journalRoutes.js:29'
    })
  }
})

// @route   GET /api/journals/:id
// @desc    Get a specific journal entry
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    console.log(`[journalRoutes.js:22] GET /api/journals/${req.params.id} - User: ${req.user.id}`)

    // Check if MongoDB is connected
    if (require('mongoose').connection.readyState !== 1) {
      console.log(`[journalRoutes.js:25] MongoDB not connected`)
      return res.status(503).json({
        msg: 'Database not available',
        error: 'MongoDB connection failed',
        location: 'journalRoutes.js:29'
      })
    }

    const journal = await Journal.findById(req.params.id)

    if (!journal) {
      console.log(`[journalRoutes.js:35] Journal entry not found: ${req.params.id}`)
      return res.status(404).json({ msg: 'Journal entry not found' })
    }

    // Make sure user owns the journal
    if (journal.user.toString() !== req.user.id) {
      console.log(`[journalRoutes.js:40] User not authorized. Journal user: ${journal.user}, Request user: ${req.user.id}`)
      return res.status(401).json({ msg: 'User not authorized' })
    }

    console.log(`[journalRoutes.js:44] Returning journal: ${req.params.id}`)
    res.json(journal)
  } catch (err) {
    console.error(`[journalRoutes.js:46] GET journal error for ${req.params.id}:`, err.message)
    console.error(`[journalRoutes.js:47] Error stack:`, err.stack)

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journal entry not found' })
    }

    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid journal ID format' })
    }

    res.status(500).json({
      msg: 'Failed to fetch journal entry',
      error: err.message,
      location: 'journalRoutes.js:59'
    })
  }
})

// @route   POST /api/journals
// @desc    Create a new journal entry
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    console.log(`[journalRoutes.js:34] POST /api/journals - User: ${req.user.id}`)

    // Check if MongoDB is connected
    if (require('mongoose').connection.readyState !== 1) {
      console.log(`[journalRoutes.js:37] MongoDB not connected`)
      return res.status(503).json({
        msg: 'Database not available',
        error: 'MongoDB connection failed',
        location: 'journalRoutes.js:41'
      })
    }

    const { title, content, sentiment, date, predictedMood } = req.body

    // Validate required fields
    if (!title || !content) {
      console.log(`[journalRoutes.js:46] Validation failed: title or content missing`)
      return res.status(400).json({ msg: 'Title and content are required' })
    }

    const newJournal = new Journal({
      user: req.user.id,
      title: title.trim(),
      content: content.trim(),
      sentiment: sentiment || 'neutral',
      date: date || Date.now(),
      moodPrediction: predictedMood ? {
        mood: predictedMood.mood,
        confidence: predictedMood.confidence,
        model: predictedMood.model || 'keyword-based',
        processedAt: new Date()
      } : undefined
    })

    console.log(`[journalRoutes.js:57] Saving journal for user ${req.user.id}`)
    const journal = await newJournal.save()
    console.log(`[journalRoutes.js:59] Journal created successfully: ${journal._id}`)
    res.json(journal)
  } catch (err) {
    console.error(`[journalRoutes.js:61] Journal creation error for user ${req.user.id}:`, err.message)
    console.error(`[journalRoutes.js:62] Error stack:`, err.stack)

    // Handle specific MongoDB errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Invalid journal data' })
    }

    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Duplicate journal entry' })
    }

    res.status(500).json({
      msg: 'Failed to create journal entry',
      error: err.message,
      location: 'journalRoutes.js:74'
    })
  }
})

// @route   PUT /api/journals/:id
// @desc    Update a journal entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    console.log(`[journalRoutes.js:79] PUT /api/journals/${req.params.id} - User: ${req.user.id}`)

    // Check if MongoDB is connected
    if (require('mongoose').connection.readyState !== 1) {
      console.log(`[journalRoutes.js:82] MongoDB not connected`)
      return res.status(503).json({
        msg: 'Database not available',
        error: 'MongoDB connection failed',
        location: 'journalRoutes.js:86'
      })
    }

    const { title, content, sentiment, date, predictedMood } = req.body

    let journal = await Journal.findById(req.params.id)

    if (!journal) {
      console.log(`[journalRoutes.js:93] Journal entry not found: ${req.params.id}`)
      return res.status(404).json({ msg: 'Journal entry not found' })
    }

    // Make sure user owns the journal
    if (journal.user.toString() !== req.user.id) {
      console.log(`[journalRoutes.js:98] User not authorized. Journal user: ${journal.user}, Request user: ${req.user.id}`)
      return res.status(401).json({ msg: 'User not authorized' })
    }

    // Update fields
    journal.title = title || journal.title
    journal.content = content || journal.content
    journal.sentiment = sentiment || journal.sentiment
    journal.date = date || journal.date
    if (predictedMood) {
      journal.moodPrediction = {
        mood: predictedMood.mood,
        confidence: predictedMood.confidence,
        model: predictedMood.model || 'keyword-based',
        processedAt: new Date()
      }
    }
    journal.updatedAt = Date.now()

    console.log(`[journalRoutes.js:109] Updating journal: ${req.params.id}`)
    await journal.save()
    console.log(`[journalRoutes.js:111] Journal updated successfully: ${req.params.id}`)
    res.json(journal)
  } catch (err) {
    console.error(`[journalRoutes.js:113] Update error for journal ${req.params.id}:`, err.message)
    console.error(`[journalRoutes.js:114] Error stack:`, err.stack)

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journal entry not found' })
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Invalid update data' })
    }

    res.status(500).json({
      msg: 'Failed to update journal entry',
      error: err.message,
      location: 'journalRoutes.js:126'
    })
  }
})

// @route   DELETE /api/journals/:id
// @desc    Delete a journal entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log(`[journalRoutes.js:131] DELETE /api/journals/${req.params.id} - User: ${req.user.id}`)

    // Check if MongoDB is connected
    if (require('mongoose').connection.readyState !== 1) {
      console.log(`[journalRoutes.js:134] MongoDB not connected`)
      return res.status(503).json({
        msg: 'Database not available',
        error: 'MongoDB connection failed',
        location: 'journalRoutes.js:138'
      })
    }

    const journal = await Journal.findById(req.params.id)

    if (!journal) {
      console.log(`[journalRoutes.js:144] Journal entry not found: ${req.params.id}`)
      return res.status(404).json({ msg: 'Journal entry not found' })
    }

    // Make sure user owns the journal
    if (journal.user.toString() !== req.user.id) {
      console.log(`[journalRoutes.js:149] User not authorized. Journal user: ${journal.user}, Request user: ${req.user.id}`)
      return res.status(401).json({ msg: 'User not authorized' })
    }

    console.log(`[journalRoutes.js:154] Deleting journal: ${req.params.id}`)
    await journal.deleteOne() // Changed from deprecated journal.remove()
    console.log(`[journalRoutes.js:156] Journal deleted successfully: ${req.params.id}`)

    res.json({ msg: 'Journal entry removed' })
  } catch (err) {
    console.error(`[journalRoutes.js:158] Delete error for journal ${req.params.id}:`, err.message)
    console.error(`[journalRoutes.js:159] Error stack:`, err.stack)

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Journal entry not found' })
    }

    // Handle specific database errors
    if (err.name === 'CastError') {
      return res.status(400).json({ msg: 'Invalid journal ID format' })
    }

    res.status(500).json({
      msg: 'Failed to delete journal entry',
      error: err.message,
      location: 'journalRoutes.js:171'
    })
  }
})

module.exports = router
