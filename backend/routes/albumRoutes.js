const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const upload = require('../middleware/upload')
const cloudinary = require('../config/cloudinaryConfig')
const Album = require('../models/Album')

// @route   POST /api/albums
// @desc    Create a new album with cover photo
// @access  Private
router.post('/', auth, upload.single('coverPhoto'), async (req, res) => {
  try {
    const { name } = req.body

    if (!req.file) {
      // If no file is uploaded, create album with default cover
      const newAlbum = new Album({
        user: req.user.id,
        name,
      })
      const album = await newAlbum.save()
      return res.json(album)
    }

    // Upload image to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64")
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64

    const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
      folder: `mindhaven/albums/${req.user.id}`,
    })

    const newAlbum = new Album({
      user: req.user.id,
      name,
      coverPhotoUrl: cloudinaryResponse.secure_url,
    })

    const album = await newAlbum.save()
    res.json(album)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// @route   GET /api/albums
// @desc    Get all albums for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const albums = await Album.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(albums)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
