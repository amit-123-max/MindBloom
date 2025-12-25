const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const StudentStress = require('../models/StudentStress')
const StudentProcrastination = require('../models/StudentProcrastination')
const StudentSleep = require('../models/StudentSleep')
const StudentConfidence = require('../models/StudentConfidence')
const StudentCareer = require('../models/StudentCareer')

// Helper function for ML predictions with fallback
const getMLPrediction = async (type, data) => {
  try {
    // TODO: Implement actual ML service calls
    // For now, return mock predictions based on simple rules

    switch (type) {
      case 'stress':
        const stressLevel = data.stressLevel
        return {
          stressLevel: stressLevel > 60 ? 'High' : stressLevel > 30 ? 'Moderate' : 'Low',
          advice: stressLevel > 60
            ? 'Consider speaking with a counselor and implementing immediate stress reduction techniques.'
            : 'Your stress levels are manageable. Continue with healthy coping strategies.',
          copingStrategies: [
            'Practice deep breathing exercises',
            'Take regular breaks during study sessions',
            'Maintain a consistent sleep schedule',
            'Exercise regularly'
          ]
        }

      case 'procrastination':
        const productivityScore = data.productivityScore
        return {
          riskLevel: productivityScore < 40 ? 'High' : productivityScore < 70 ? 'Moderate' : 'Low',
          advice: productivityScore < 40
            ? 'High procrastination risk detected. Try breaking tasks into smaller steps and using the Pomodoro technique.'
            : 'Your productivity habits are good. Keep up the momentum!',
          suggestions: [
            'Use the Pomodoro technique (25 minutes work + 5 minutes break)',
            'Break large tasks into smaller, manageable steps',
            'Set specific deadlines for each task',
            'Reward yourself after completing tasks'
          ]
        }

      case 'sleep':
        const burnoutRisk = data.burnoutRisk
        return {
          riskLevel: burnoutRisk > 60 ? 'High' : burnoutRisk > 30 ? 'Moderate' : 'Low',
          recommendations: [
            'Aim for 7-9 hours of sleep per night',
            'Maintain a consistent sleep schedule',
            'Create a relaxing bedtime routine',
            'Limit caffeine and screen time before bed'
          ],
          insights: burnoutRisk > 60
            ? 'Your sleep patterns suggest high burnout risk. Prioritize rest and consider professional support.'
            : 'Your sleep habits are generally healthy. Continue maintaining good sleep hygiene.'
        }

      case 'confidence':
        // Simple sentiment analysis based on text length and keywords
        const text = data.anonymousJournal + ' ' + data.comparisonThoughts
        const positiveWords = ['confident', 'strong', 'capable', 'proud', 'happy', 'grateful']
        const negativeWords = ['worried', 'anxious', 'insecure', 'doubt', 'fear', 'inadequate']

        const positiveCount = positiveWords.filter(word => text.toLowerCase().includes(word)).length
        const negativeCount = negativeWords.filter(word => text.toLowerCase().includes(word)).length

        const sentiment = positiveCount > negativeCount ? 'Positive' :
                         negativeCount > positiveCount ? 'Negative' : 'Neutral'

        return {
          sentiment,
          feedback: sentiment === 'Positive'
            ? 'Your reflections show good self-awareness and positivity. Keep building on these strengths!'
            : 'Your reflections indicate some challenges with confidence. Consider focusing on your unique strengths.',
          affirmations: [
            'I am worthy of respect and kindness',
            'My efforts and growth matter',
            'I bring unique value to my relationships',
            'I am capable of achieving my goals',
            'My voice and opinions are important'
          ],
          confidenceScore: Math.max(0, Math.min(100, 50 + (positiveCount * 10) - (negativeCount * 5)))
        }

      case 'career':
        const anxietyLevel = data.futureAnxiety
        const topInterests = Object.entries(data.interests || {})
          .sort(([,a], [,b]) => b - a)
          .slice(0, 2)
          .map(([interest]) => interest)

        const careerMap = {
          analytical: 'Data Scientist or Research Scientist',
          creative: 'Designer or Marketing Professional',
          social: 'Teacher or Counselor',
          practical: 'Engineer or Project Manager',
          leadership: 'Entrepreneur or Manager',
          helping: 'Healthcare Professional or Social Worker'
        }

        const primaryCareer = careerMap[topInterests[0]] || 'Professional in your field of interest'

        return {
          primaryCareer,
          reasoning: `Based on your strong interest in ${topInterests.join(' and ')}, ${primaryCareer} could be a great fit.`,
          nextSteps: [
            'Research programs related to your interests',
            'Speak with professionals in your field of interest',
            'Take relevant courses or certifications',
            'Gain practical experience through internships or volunteer work'
          ],
          uncertaintyAdvice: anxietyLevel > 7
            ? 'Your high anxiety suggests you may benefit from career counseling. Consider speaking with a career advisor.'
            : 'Your uncertainty level is manageable. Focus on exploring your interests through courses and internships.'
        }

      default:
        return null
    }
  } catch (error) {
    console.error('ML prediction error:', error)
    return null
  }
}

// @route   POST /api/student/stress
// @desc    Save stress assessment data
// @access  Private
router.post('/stress', auth, async (req, res) => {
  try {
    console.log('Stress assessment request for user:', req.user.id)
    console.log('Request body:', req.body)

    // Validate required fields
    const requiredFields = ['academicPressure', 'examAnxiety', 'timeManagement', 'peerComparison', 'futureUncertainty', 'sleepQuality', 'copingMechanisms', 'stressLevel']
    const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null)

    if (missingFields.length > 0) {
      return res.status(400).json({
        msg: `Missing required fields: ${missingFields.join(', ')}`
      })
    }

    const stressData = {
      userId: req.user.id,
      academicPressure: req.body.academicPressure,
      examAnxiety: req.body.examAnxiety,
      timeManagement: req.body.timeManagement,
      peerComparison: req.body.peerComparison,
      futureUncertainty: req.body.futureUncertainty,
      sleepQuality: req.body.sleepQuality,
      copingMechanisms: req.body.copingMechanisms,
      stressLevel: req.body.stressLevel,
      journalEntry: req.body.journalEntry || '',
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' })
    }

    // Get ML predictions
    const predictions = await getMLPrediction('stress', stressData)
    if (predictions) {
      stressData.predictions = predictions
    }

    const stressEntry = new StudentStress(stressData)
    const savedEntry = await stressEntry.save()

    console.log('Stress assessment saved successfully:', savedEntry._id)

    res.json({
      msg: 'Stress assessment saved successfully',
      id: savedEntry._id,
      predictions
    })
  } catch (error) {
    console.error('Stress assessment error:', error)
    res.status(500).json({
      msg: 'Server error',
      error: error.message
    })
  }
})

// @route   POST /api/student/procrastination
// @desc    Save procrastination/productivity data
// @access  Private
router.post('/procrastination', auth, async (req, res) => {
  try {
    console.log('Procrastination request for user:', req.user.id)
    console.log('Request body:', req.body)

    // Validate required fields
    if (!req.body.tasks || !Array.isArray(req.body.tasks) || req.body.tasks.length === 0) {
      return res.status(400).json({ msg: 'At least one task is required' })
    }

    const procrastinationData = {
      userId: req.user.id,
      tasks: req.body.tasks,
      completedPomodoros: req.body.completedPomodoros || 0,
      productivityScore: req.body.productivityScore || 0,
      reflection: req.body.reflection || ''
    }

    // Get ML predictions
    const predictions = await getMLPrediction('procrastination', procrastinationData)
    if (predictions) {
      procrastinationData.predictions = predictions
    }

    const procrastinationEntry = new StudentProcrastination(procrastinationData)
    const savedEntry = await procrastinationEntry.save()

    console.log('Procrastination data saved successfully:', savedEntry._id)

    res.json({
      msg: 'Productivity session saved successfully',
      id: savedEntry._id,
      predictions
    })
  } catch (error) {
    console.error('Procrastination tracking error:', error)
    res.status(500).json({
      msg: 'Server error',
      error: error.message
    })
  }
})

// @route   POST /api/student/sleep
// @desc    Save sleep tracking data
// @access  Private
router.post('/sleep', auth, async (req, res) => {
  try {
    console.log('Sleep tracking request for user:', req.user.id)
    console.log('Request body:', req.body)

    // Validate required fields
    const requiredFields = ['hoursSlept', 'sleepQuality', 'bedtime', 'wakeTime', 'stressLevel', 'burnoutRisk']
    const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null)

    if (missingFields.length > 0) {
      return res.status(400).json({
        msg: `Missing required fields: ${missingFields.join(', ')}`
      })
    }

    const sleepData = {
      userId: req.user.id,
      hoursSlept: req.body.hoursSlept,
      sleepQuality: req.body.sleepQuality,
      bedtime: req.body.bedtime,
      wakeTime: req.body.wakeTime,
      caffeineIntake: req.body.caffeineIntake || 0,
      screenTime: req.body.screenTime || 0,
      stressLevel: req.body.stressLevel,
      hygieneChecklist: req.body.hygieneChecklist || [],
      burnoutRisk: req.body.burnoutRisk,
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    }

    // Get ML predictions
    const predictions = await getMLPrediction('sleep', sleepData)
    if (predictions) {
      sleepData.predictions = predictions
    }

    const sleepEntry = new StudentSleep(sleepData)
    const savedEntry = await sleepEntry.save()

    console.log('Sleep data saved successfully:', savedEntry._id)

    res.json({
      msg: 'Sleep data saved successfully',
      id: savedEntry._id,
      predictions
    })
  } catch (error) {
    console.error('Sleep tracking error:', error)
    res.status(500).json({
      msg: 'Server error',
      error: error.message
    })
  }
})

// @route   POST /api/student/confidence
// @desc    Save confidence building session data
// @access  Private
router.post('/confidence', auth, async (req, res) => {
  try {
    console.log('Confidence request for user:', req.user.id)
    console.log('Request body:', req.body)

    // Validate required fields
    if (!req.body.reflections || typeof req.body.reflections !== 'object') {
      return res.status(400).json({ msg: 'Reflections data is required' })
    }

    const confidenceData = {
      userId: req.user.id,
      reflections: req.body.reflections,
      anonymousJournal: req.body.anonymousJournal || '',
      comparisonThoughts: req.body.comparisonThoughts || ''
    }

    // Get ML predictions
    const predictions = await getMLPrediction('confidence', confidenceData)
    if (predictions) {
      confidenceData.predictions = predictions
    }

    const confidenceEntry = new StudentConfidence(confidenceData)
    const savedEntry = await confidenceEntry.save()

    console.log('Confidence data saved successfully:', savedEntry._id)

    res.json({
      msg: 'Confidence session saved successfully',
      id: savedEntry._id,
      predictions
    })
  } catch (error) {
    console.error('Confidence tracking error:', error)
    res.status(500).json({
      msg: 'Server error',
      error: error.message
    })
  }
})

// @route   POST /api/student/career
// @desc    Save career planning data
// @access  Private
router.post('/career', auth, async (req, res) => {
  try {
    console.log('Career planning request for user:', req.user.id)
    console.log('Request body:', req.body)

    // Validate required fields
    if (!req.body.interests || typeof req.body.interests !== 'object') {
      return res.status(400).json({ msg: 'Interests data is required' })
    }

    if (!req.body.strengths || !req.body.strengths.trim()) {
      return res.status(400).json({ msg: 'Strengths description is required' })
    }

    if (!req.body.selectedCareers || !Array.isArray(req.body.selectedCareers) || req.body.selectedCareers.length === 0) {
      return res.status(400).json({ msg: 'At least one selected career is required' })
    }

    const careerData = {
      userId: req.user.id,
      interests: req.body.interests,
      strengths: req.body.strengths,
      careerConcerns: req.body.careerConcerns || '',
      futureAnxiety: req.body.futureAnxiety,
      selectedCareers: req.body.selectedCareers,
      roadmapCreated: true
    }

    // Get ML predictions
    const predictions = await getMLPrediction('career', careerData)
    if (predictions) {
      careerData.predictions = predictions
    }

    const careerEntry = new StudentCareer(careerData)
    const savedEntry = await careerEntry.save()

    console.log('Career data saved successfully:', savedEntry._id)

    res.json({
      msg: 'Career planning data saved successfully',
      id: savedEntry._id,
      predictions
    })
  } catch (error) {
    console.error('Career planning error:', error)
    res.status(500).json({
      msg: 'Server error',
      error: error.message
    })
  }
})

// @route   GET /api/student/resources
// @desc    Get educational resources and information
// @access  Public
router.get('/resources', async (req, res) => {
  try {
    // Return curated educational resources
    const resources = {
      emergencyContacts: [
        {
          name: 'National Suicide Prevention Lifeline',
          contact: '988',
          description: '24/7 free and confidential emotional support'
        },
        {
          name: 'Crisis Text Line',
          contact: 'Text HOME to 741741',
          description: 'Free 24/7 support via text message'
        }
      ],
      campusResources: [
        {
          type: 'Counseling Center',
          description: 'Professional counseling services for students',
          availability: 'Usually Monday-Friday, 9AM-5PM'
        },
        {
          type: 'Peer Support Groups',
          description: 'Student-led support groups for various mental health concerns',
          availability: 'Weekly meetings, check student services'
        }
      ],
      selfHelpResources: [
        {
          category: 'Mental Health Apps',
          items: ['Calm', 'Headspace', 'Insight Timer', 'Moodpath']
        },
        {
          category: 'Helpful Books',
          items: ['The Anxiety & Phobia Workbook', 'Feeling Good', 'The Happiness Trap']
        }
      ],
      educationalContent: {
        mythsVsFacts: [
          {
            myth: 'Mental health issues only affect "weak" people',
            fact: 'Mental health challenges can affect anyone, regardless of strength or background.'
          }
        ],
        copingStrategies: [
          'Practice deep breathing',
          'Maintain regular exercise',
          'Stay connected with supportive people',
          'Get adequate sleep'
        ]
      }
    }

    res.json({ resources })
  } catch (error) {
    console.error('Resources fetch error:', error)
    res.status(500).json({ msg: 'Server error' })
  }
})

// @route   GET /api/student/stress/history
// @desc    Get user's stress assessment history
// @access  Private
router.get('/stress/history', auth, async (req, res) => {
  try {
    const stressHistory = await StudentStress.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(30) // Last 30 entries

    res.json({ history: stressHistory })
  } catch (error) {
    console.error('Stress history fetch error:', error)
    res.status(500).json({ msg: 'Server error' })
  }
})

// @route   GET /api/student/sleep/weekly
// @desc    Get user's weekly sleep summary
// @access  Private
router.get('/sleep/weekly', auth, async (req, res) => {
  try {
    // Get last 7 days of sleep data
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const weeklySleep = await StudentSleep.find({
      userId: req.user.id,
      timestamp: { $gte: sevenDaysAgo }
    }).sort({ date: 1 })

    res.json({ weeklyData: weeklySleep })
  } catch (error) {
    console.error('Weekly sleep fetch error:', error)
    res.status(500).json({ msg: 'Server error' })
  }
})

module.exports = router
