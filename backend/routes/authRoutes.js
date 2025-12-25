const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const upload = require('../middleware/upload')
const cloudinary = require('../config/cloudinaryConfig')
const authMiddleware = require('../middleware/authMiddleware')

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res, next) => {
  // Check if this is a FormData request (multipart) or JSON request
  const contentType = req.headers['content-type'] || ''

  if (contentType.includes('multipart/form-data')) {
    // Use multer for FormData requests
    upload.single('profileImage')(req, res, next)
  } else {
    // Skip multer for JSON requests
    next()
  }
}, async (req, res) => {
  console.log('[authRoutes.js] Registration request received')
  console.log('[authRoutes.js] Content-Type:', req.headers['content-type'])
  console.log('[authRoutes.js] Request body:', req.body)
  console.log('[authRoutes.js] Request file:', req.file ? 'present' : 'not present')

  const { username, email, password } = req.body

  try {
    console.log('[authRoutes.js] Checking if user exists:', email)
    let user = await User.findOne({ email })
    if (user) {
      console.log('[authRoutes.js] User already exists')
      return res.status(400).json({ msg: 'User already exists' })
    }
    console.log('[authRoutes.js] User does not exist, proceeding with registration')

    let profileImageUrl = ''

    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'profile_images',
              transformation: [
                { width: 200, height: 200, crop: 'fill', gravity: 'face' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error)
                reject(error)
              } else {
                resolve(result)
              }
            }
          )

          uploadStream.end(req.file.buffer)
        })

        profileImageUrl = result.secure_url

      } catch (uploadError) {
        console.error('Image upload error:', uploadError)
        return res.status(500).json({ msg: 'Image upload failed' })
      }
    }

    console.log('[authRoutes.js] Creating new user with data:', { username, email, profileImage: profileImageUrl ? 'present' : 'none' })
    user = new User({
      username,
      email,
      password,
      profileImage: profileImageUrl,
    })

    console.log('[authRoutes.js] Saving user to database...')
    await user.save()
    console.log('[authRoutes.js] User saved successfully')

    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err
      res.json({
        token,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      })
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Server error during registration' })
  }
})

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' })
    }

    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err
      res.json({
        token,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      })
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Server error during login' })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

module.exports = router
