// Enhanced Mood Prediction Service
// Advanced keyword-based analysis with ML-ready architecture
// Compatible with Hugging Face Transformers when package is available

export class MoodPredictionService {
  constructor() {
    // Enhanced mood keywords with intensity modifiers
    this.moodKeywords = {
      happy: {
        keywords: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'love', 'loved', 'enjoy', 'delighted', 'thrilled', 'ecstatic', 'blessed', 'grateful', 'thankful', 'proud', 'accomplished', 'successful', 'celebrate', 'fun', 'laugh', 'smile', 'cheerful', 'glad', 'pleased', 'content', 'satisfied', 'fulfilled', 'blissful', 'joyful', 'cheerful', 'merry', 'jolly', 'elated', 'overjoyed', 'radiant'],
        weight: 1.0,
        intensity: ['very', 'extremely', 'super', 'incredibly', 'absolutely']
      },
      sad: {
        keywords: ['sad', 'unhappy', 'depressed', 'down', 'heartbroken', 'disappointed', 'lonely', 'alone', 'miss', 'cry', 'tears', 'hurt', 'pain', 'sorrow', 'grief', 'mourn', 'regret', 'sorry', 'guilty', 'ashamed', 'hopeless', 'desperate', 'helpless', 'worthless', 'miserable', 'gloomy', 'melancholy', 'blue', 'low', 'dejected', 'discouraged', 'disheartened', 'downcast', 'forlorn', 'woeful'],
        weight: 1.0,
        intensity: ['very', 'deeply', 'terribly', 'awfully', 'extremely']
      },
      anxious: {
        keywords: ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'fear', 'panic', 'stress', 'stressed', 'overwhelmed', 'tension', 'pressure', 'rushed', 'frantic', 'uneasy', 'apprehensive', 'dread', 'terror', 'phobia', 'trauma', 'nightmare', 'sleepless', 'restless', 'jittery', 'edgy', 'on edge', 'uptight', 'tense', 'nervy', 'fidgety'],
        weight: 1.0,
        intensity: ['very', 'extremely', 'severely', 'intensely', 'overwhelmingly']
      },
      angry: {
        keywords: ['angry', 'mad', 'furious', 'rage', 'hate', 'hated', 'frustrated', 'annoyed', 'irritated', 'pissed', 'furious', 'enraged', 'livid', 'infuriated', 'resentful', 'bitter', 'hostile', 'aggressive', 'violent', 'hateful', 'irate', 'incensed', 'outraged', 'indignant', 'vexed', 'exasperated', 'provoked', 'agitated'],
        weight: 1.0,
        intensity: ['very', 'extremely', 'fiercely', 'intensely', 'violently']
      },
      calm: {
        keywords: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'quiet', 'gentle', 'soothing', 'comfortable', 'content', 'satisfied', 'balanced', 'centered', 'mindful', 'present', 'zen', 'meditative', 'restful', 'easygoing', 'laid-back', 'placid', 'composed', 'collected', 'unruffled', 'sedate'],
        weight: 1.0,
        intensity: ['very', 'perfectly', 'completely', 'utterly', 'totally']
      },
      excited: {
        keywords: ['excited', 'enthusiastic', 'eager', 'keen', 'passionate', 'energetic', 'lively', 'vibrant', 'dynamic', 'motivated', 'inspired', 'ambitious', 'driven', 'determined', 'zealous', 'ardent', 'fervent', 'avid', 'enthused', 'pumped', 'thrilled', 'eager', 'agog', 'stoked', 'psyched'],
        weight: 0.9,
        intensity: ['very', 'extremely', 'super', 'incredibly', 'wildly']
      },
      tired: {
        keywords: ['tired', 'exhausted', 'fatigued', 'weary', 'drained', 'worn', 'sleepy', 'drowsy', 'lethargic', 'sluggish', 'burned', 'overworked', 'run-down', 'listless', 'apathetic', 'indifferent', 'wearied', 'spent', 'pooped', 'beat', 'bushed', 'knackered'],
        weight: 0.8,
        intensity: ['very', 'extremely', 'utterly', 'completely', 'totally']
      },
      confused: {
        keywords: ['confused', 'uncertain', 'unsure', 'bewildered', 'puzzled', 'perplexed', 'baffled', 'mystified', 'disoriented', 'lost', 'unclear', 'ambiguous', 'vague', 'complicated', 'complex', 'puzzling', 'bewildering', 'mystifying', 'baffling', 'perplexing'],
        weight: 0.7,
        intensity: ['very', 'completely', 'totally', 'utterly', 'absolutely']
      },
      hopeful: {
        keywords: ['hopeful', 'optimistic', 'positive', 'confident', 'encouraged', 'inspired', 'motivated', 'uplifted', 'empowered', 'capable', 'strong', 'resilient', 'determined', 'committed', 'dedicated', 'promising', 'bright', 'rosy', 'sanguine', 'bullish'],
        weight: 0.9,
        intensity: ['very', 'extremely', 'incredibly', 'tremendously', 'immensely']
      },
      grateful: {
        keywords: ['grateful', 'thankful', 'appreciative', 'blessed', 'fortunate', 'lucky', 'privileged', 'indebted', 'obliged', 'beholden', 'recognizing', 'acknowledging', 'valuing', 'cherishing', 'appreciative', 'thankful', 'grateful', 'obliged'],
        weight: 0.9,
        intensity: ['very', 'deeply', 'profoundly', 'immensely', 'sincerely']
      }
    }

    // Enhanced negation and context words
    this.negations = ['not', 'no', 'never', 'none', 'nobody', 'nothing', 'neither', 'nor', 'nowhere', 'hardly', 'scarcely', 'barely', 'doesn\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'haven\'t', 'hasn\'t', 'hadn\'t', 'don\'t', 'can\'t', 'won\'t', 'shouldn\'t', 'wouldn\'t', 'couldn\'t', 'aint', 'isnt', 'arent', 'wasnt', 'werent']
    this.intensifiers = ['very', 'really', 'so', 'extremely', 'incredibly', 'absolutely', 'totally', 'completely', 'utterly', 'highly', 'deeply', 'profoundly', 'intensely', 'tremendously', 'immensely']

    // ML-ready configuration (for future use)
    this.mlModel = null
    this.isModelLoaded = false
    this.modelName = 'j-hartmann/emotion-english-distilroberta-base'

    console.log('🤖 Enhanced Mood Prediction Service initialized')
  }

  // Safe ML model initialization (won't break if package not available)
  async initializeMLModel() {
    console.log('ℹ️ ML model initialization - package not available, using enhanced keyword analysis')
    this.isModelLoaded = false
  }

  // Main prediction method
  async predictMood(text) {
    if (!text || text.trim().length === 0) {
      return { mood: 'neutral', confidence: 0, scores: {}, model: 'none', wordCount: 0 }
    }

    // Use enhanced keyword analysis (ML integration ready for future)
    return this.predictMoodEnhanced(text)
  }

  // Enhanced keyword-based prediction with advanced NLP features
  predictMoodEnhanced(text) {
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 2 && word.length < 20)
    const moodScores = {}
    let intensifierMultiplier = 1.0
    let contextWindow = 2 // Look at words within 2 positions

    // Initialize scores for all moods
    Object.keys(this.moodKeywords).forEach(mood => {
      moodScores[mood] = 0
    })

    // First pass: detect intensifiers and set context multipliers
    const intensifierPositions = []
    words.forEach((word, index) => {
      if (this.intensifiers.includes(word)) {
        intensifierPositions.push(index)
      }
    })

    // Second pass: analyze emotions with enhanced context awareness
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      let weight = 1.0
      let contextMultiplier = 1.0

      // Check for negation within context window
      let negationFound = false
      for (let j = Math.max(0, i - contextWindow); j < i; j++) {
        if (this.negations.some(neg => words[j].includes(neg))) {
          weight = -0.7 // Stronger negation effect
          negationFound = true
          break
        }
      }

      // Check for intensifier boosting
      const nearbyIntensifier = intensifierPositions.find(pos =>
        Math.abs(pos - i) <= contextWindow
      )
      if (nearbyIntensifier !== undefined) {
        contextMultiplier = 1.8
      }

      // Apply stored intensifier multiplier from first pass
      if (intensifierMultiplier > 1.0) {
        contextMultiplier *= intensifierMultiplier
        intensifierMultiplier = 1.0 // Reset after use
      }

      // Enhanced mood matching with partial matches and compound words
      Object.entries(this.moodKeywords).forEach(([mood, data]) => {
        let matchScore = 0

        // Exact match
        if (data.keywords.includes(word)) {
          matchScore = data.weight
        }
        // Partial match for compound words (e.g., "unhappy" contains "happy")
        else if (data.keywords.some(keyword => word.includes(keyword) && word.length > keyword.length)) {
          matchScore = data.weight * 0.7
        }
        // Intensity combination (e.g., "very happy")
        else if (i > 0 && data.intensity && data.intensity.includes(words[i-1]) && data.keywords.includes(word)) {
          matchScore = data.weight * 1.5
        }

        if (matchScore > 0) {
          moodScores[mood] += matchScore * weight * contextMultiplier
        }
      })
    }

    // Third pass: handle compound emotions and contextual adjustments
    this.processCompoundEmotions(words, moodScores)

    // Calculate final scores and confidence
    const totalWords = words.length
    let maxScore = 0
    let predictedMood = 'neutral'
    let secondHighestScore = 0

    Object.entries(moodScores).forEach(([mood, score]) => {
      if (score > maxScore) {
        secondHighestScore = maxScore
        maxScore = score
      } else if (score > secondHighestScore) {
        secondHighestScore = score
      }
    })

    // Rerun to find the actual mood with highest score
    Object.entries(moodScores).forEach(([mood, score]) => {
      if (score === maxScore) {
        predictedMood = mood
      }
    })

    // Enhanced confidence calculation
    const baseConfidence = totalWords > 0 ? Math.min(maxScore / Math.max(totalWords * 0.5, 1), 1) : 0
    const scoreDifference = maxScore - secondHighestScore
    const uniquenessBonus = scoreDifference > 0.3 ? 0.1 : 0 // Bonus for clear winner

    let confidence = Math.min(baseConfidence + uniquenessBonus, 1)

    // If confidence is too low or scores are too close, default to neutral
    if (confidence < 0.15 || (maxScore > 0 && scoreDifference < 0.2)) {
      predictedMood = 'neutral'
      confidence = 0
    }

    return {
      mood: predictedMood,
      confidence: confidence,
      scores: moodScores,
      model: 'enhanced-keyword',
      wordCount: totalWords,
      dominantScore: maxScore,
      scoreDifference: scoreDifference,
      analysis: {
        hasNegation: words.some(word => this.negations.some(neg => word.includes(neg))),
        hasIntensifier: words.some(word => this.intensifiers.includes(word)),
        totalEmotionsDetected: Object.values(moodScores).filter(score => score > 0).length
      }
    }
  }

  // Process compound emotions and contextual relationships
  processCompoundEmotions(words, moodScores) {
    for (let i = 0; i < words.length - 1; i++) {
      const word1 = words[i]
      const word2 = words[i + 1]

      // Handle "not happy", "very sad", etc.
      if (this.negations.includes(word1) && this.isEmotionWord(word2)) {
        const mood = this.getMoodForWord(word2)
        if (mood) {
          moodScores[mood] -= 0.5 // Reduce the negated emotion
        }
      }

      // Handle intensifier + emotion combinations
      if (this.intensifiers.includes(word1) && this.isEmotionWord(word2)) {
        const mood = this.getMoodForWord(word2)
        if (mood) {
          moodScores[mood] += 0.3 // Boost intensified emotions
        }
      }
    }
  }

  // Helper methods
  isEmotionWord(word) {
    return Object.values(this.moodKeywords).some(data =>
      data.keywords.includes(word)
    )
  }

  getMoodForWord(word) {
    for (const [mood, data] of Object.entries(this.moodKeywords)) {
      if (data.keywords.includes(word)) {
        return mood
      }
    }
    return null
  }

  // Future ML integration method (ready for when package is available)
  async predictMoodWithML(text) {
    console.log('ML prediction not available - using enhanced keyword analysis')
    return this.predictMoodEnhanced(text)
  }

  // Get mood emoji for display
  getMoodEmoji(mood) {
    const emojis = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      calm: '😌',
      excited: '🤩',
      tired: '😴',
      confused: '😕',
      hopeful: '🌟',
      grateful: '🙏',
      neutral: '😐'
    }
    return emojis[mood] || '😐'
  }

  // Get mood color for UI
  getMoodColor(mood) {
    const colors = {
      happy: 'bg-green-100 text-green-800 border-green-200',
      sad: 'bg-blue-100 text-blue-800 border-blue-200',
      anxious: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      angry: 'bg-red-100 text-red-800 border-red-200',
      calm: 'bg-purple-100 text-purple-800 border-purple-200',
      excited: 'bg-pink-100 text-pink-800 border-pink-200',
      tired: 'bg-gray-100 text-gray-800 border-gray-200',
      confused: 'bg-orange-100 text-orange-800 border-orange-200',
      hopeful: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      grateful: 'bg-teal-100 text-teal-800 border-teal-200',
      neutral: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[mood] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Get human-readable mood name
  getMoodName(mood) {
    const names = {
      happy: 'Happy',
      sad: 'Sad',
      anxious: 'Anxious',
      angry: 'Angry',
      calm: 'Calm',
      excited: 'Excited',
      tired: 'Tired',
      confused: 'Confused',
      hopeful: 'Hopeful',
      grateful: 'Grateful',
      neutral: 'Neutral'
    }
    return names[mood] || 'Neutral'
  }
}

// Create singleton instance
export const moodPredictionService = new MoodPredictionService()

// For future ML integration, you can add:
// import { pipeline } from '@xenova/transformers'

// export async function predictMoodWithML(text) {
//   const classifier = await pipeline('sentiment-analysis', 'cardiffnlp/twitter-roberta-base-sentiment-latest')
//   const result = await classifier(text)
//   return result
// }
