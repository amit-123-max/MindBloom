const multer = require('multer')
const cloudinary = require('../config/cloudinaryConfig')

const storage = multer.memoryStorage() // Store files in memory as a Buffer

const upload = multer({ storage: storage })

module.exports = upload
