const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const Series = require('../models/Series')

// @route   POST /api/series
// @desc    Create a new video series
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body

    const newSeries = new Series({
      user: req.user.id,
      name,
    })

    const series = await newSeries.save()
    res.json(series)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   GET /api/series
// @desc    Get all video series for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const series = await Series.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(series)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   PUT /api/series/:id
// @desc    Rename a video series
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name } = req.body

    let series = await Series.findById(req.params.id)

    if (!series) {
      return res.status(404).json({ msg: 'Series not found' })
    }

    // Ensure user owns the series
    if (series.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    series.name = name
    series.updatedAt = Date.now()
    await series.save()

    res.json(series)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
