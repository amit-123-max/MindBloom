const mongoose = require('mongoose')

const AlbumSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  coverPhotoUrl: {
    type: String,
    default: 'https://via.placeholder.com/150/fbcfe8/be185d?text=Album', // Default pink placeholder
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Album', AlbumSchema)
