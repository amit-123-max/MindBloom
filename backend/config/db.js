// const mongoose = require('mongoose')
// const config = require('./config')

// console.log('MONGO URI USED BY BACKEND:', config.mongoURI)


// const connectDB = async () => {
//   try {
//     await mongoose.connect(config.mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     console.log('MongoDB Connected...')
//   } catch (err) {
//     console.error(err.message)
//     console.error('MongoDB connection failed')

//     // process.exit(1)
//   }
// }

// module.exports = connectDB
const mongoose = require('mongoose')
const config = require('./config')

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...')
    const conn = await mongoose.connect(config.mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })
    console.log('✅ MongoDB Connected successfully!')
    console.log('📍 Host:', conn.connection.host)
    console.log('🗄️  Database:', conn.connection.name)

    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected')
    })

  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message)
    console.log('⚠️  Server starting with local storage only')
    console.log('💡 To enable database persistence, ensure MongoDB is running and accessible')
    console.log('🔧 Current URI:', config.mongoURI.replace(/\/\/.*@/, '//***:***@'))

    // Don't exit the process - let the server run without DB
    // This allows the app to work with local storage when DB is down
  }
}

module.exports = connectDB
