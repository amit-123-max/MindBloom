const express = require('express')
const connectDB = require('./config/db')
const config = require('./config/config')
const cors = require('cors')

const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  credentials: true
}))

app.use(express.json({ extended: false }))

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() })
})

// Define Routes
console.log('Registering routes...')
app.use('/api/auth', require('./routes/authRoutes'))
console.log('✅ Auth routes registered')
app.use('/api/albums', require('./routes/albumRoutes'))
console.log('✅ Album routes registered')
app.use('/api/series', require('./routes/seriesRoutes'))
console.log('✅ Series routes registered')
app.use('/api/journals', require('./routes/journalRoutes'))
console.log('✅ Journal routes registered')
app.use('/api/wellness', require('./routes/wellnessRoutes'))
console.log('✅ Wellness routes registered')
app.use('/api/health', require('./routes/healthRoutes'))
console.log('✅ Health prediction routes registered')
app.use('/api/student', require('./routes/studentRoutes'))
console.log('✅ Student mental health routes registered')

// Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'))

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//   })
// }

const PORT = process.env.PORT || 3001

// Add error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

let server;
try {
  server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server started on port ${PORT}`)
  })
} catch (err) {
  console.error('Failed to start server on port', PORT, ':', err.message)
  console.log('Trying alternative port...')

  // Try alternative ports
  const altPorts = [3002, 3003, 3004, 8080, 8081]
  for (const altPort of altPorts) {
    try {
      server = app.listen(altPort, '127.0.0.1', () => {
        console.log(`Server started on alternative port ${altPort}`)
      })
      break
    } catch (altErr) {
      console.error(`Failed to start on port ${altPort}:`, altErr.message)
    }
  }

  if (!server) {
    console.error('Could not start server on any port. Please check system permissions.')
    process.exit(1)
  }
}

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err)
  process.exit(1)
})
