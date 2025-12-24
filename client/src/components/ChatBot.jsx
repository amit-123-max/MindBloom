import React, { useState, useRef, useEffect } from 'react'

// Gemini API integration
const GEMINI_API_KEY = 'AIzaSyDNLYQsM6aTrpskeqqPF54sVY2Y-W1eLvU'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

// Alternative PaLM API (more reliable)
const PALM_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText'

const ChatBot = ({ userType = 'general', welcomeMessage = 'Hello! I\'m here to listen and support you.' }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: welcomeMessage, sender: 'bot', timestamp: new Date() }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Gemini API integration for intelligent responses
  const getBotResponse = async (userMessage) => {
    // Always try Gemini API first
    try {
      console.log('Attempting Gemini API call for message:', userMessage)
      const response = await getGeminiResponse(userMessage)
      console.log('Gemini API response received:', response)
      return response
    } catch (error) {
      console.error('Gemini API failed, falling back to keyword responses:', error)
      // Fallback to keyword-based responses if API fails
      return getFallbackResponse(userMessage)
    }
  }

  // Gemini API integration
  const getGeminiResponse = async (userMessage) => {
    const systemPrompt = getSystemPrompt(userType)

    try {
      // Try Gemini API first
      console.log('Trying Gemini API...')
      const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant: Please provide a helpful, empathetic response.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300
          }
        })
      })

      if (geminiResponse.ok) {
        const data = await geminiResponse.json()
        console.log('Gemini API response:', data)

        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
          return data.candidates[0].content.parts[0].text.trim()
        }
      }

      // If Gemini fails, try PaLM API
      console.log('Gemini failed, trying PaLM API...')
      const palmResponse = await fetch(`${PALM_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: {
            text: `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`
          },
          temperature: 0.7,
          candidateCount: 1,
          maxOutputTokens: 300
        })
      })

      if (palmResponse.ok) {
        const palmData = await palmResponse.json()
        console.log('PaLM API response:', palmData)

        if (palmData && palmData.candidates && palmData.candidates[0] && palmData.candidates[0].output) {
          return palmData.candidates[0].output.trim()
        }
      }

      // If both APIs fail, throw error
      const geminiError = await geminiResponse.text()
      const palmError = await palmResponse.text()
      console.error('Both Gemini and PaLM APIs failed:', { gemini: geminiError, palm: palmError })
      throw new Error('Both Gemini and PaLM APIs failed')

    } catch (error) {
      console.error('API error:', error)
      throw error
    }
  }

  // System prompt based on user type
  const getSystemPrompt = (type) => {
    const basePrompt = `You are a compassionate, empathetic AI wellness companion. Respond with warmth, understanding, and practical advice. Keep responses conversational, supportive, and encouraging. Always remind users that you are not a substitute for professional mental health care when appropriate. `

    const typeSpecificPrompts = {
      women: `You are specifically supporting women in their wellness journey. Be sensitive to women's health topics, relationships, career challenges, and work-life balance. Acknowledge the unique experiences women face.`,
      students: `You are supporting students in their academic and personal growth. Address study stress, social life, career planning, motivation, and mental health in educational contexts.`,
      professionals: `You are supporting working professionals. Address workplace stress, career development, work-life balance, leadership challenges, and professional growth.`,
      general: `You provide general wellness support for anyone seeking emotional support, stress management, or personal growth guidance.`
    }

    return basePrompt + (typeSpecificPrompts[type] || typeSpecificPrompts.general)
  }

  // Fallback keyword-based responses (used when API is unavailable)
  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase()

    const responses = {
      women: {
        keywords: {
          'period': 'I understand periods can be challenging. Would you like to talk about managing period symptoms, tracking your cycle, or emotional aspects of menstruation?',
          'relationship': 'Relationships are complex. Would you like to discuss setting boundaries, communication challenges, or emotional support in relationships?',
          'work': 'Balancing career and personal life is important. Would you like to talk about workplace challenges, work-life balance, or professional growth?',
          'family': 'Family dynamics can be both supportive and challenging. Would you like to discuss family relationships, caregiving responsibilities, or setting family boundaries?',
          'health': 'Your health and well-being matter. Would you like to talk about physical health, mental health, or accessing healthcare services?',
          'stress': 'Stress affects us all differently. Would you like to discuss stress management techniques, identifying stressors, or finding healthy coping strategies?'
        },
        fallback: 'I\'m here to support you through whatever you\'re experiencing. You can talk to me about relationships, health, work, family, or any other concerns. What\'s on your mind?'
      },
      students: {
        keywords: {
          'exam': 'Exams can be stressful. Would you like to discuss study techniques, managing test anxiety, or balancing exam preparation with self-care?',
          'study': 'Studying effectively while maintaining well-being is important. Would you like to talk about time management, focus techniques, or creating a healthy study routine?',
          'social': 'Social life and friendships are important parts of student life. Would you like to discuss making friends, social anxiety, or navigating peer relationships?',
          'career': 'Career planning can feel overwhelming. Would you like to talk about choosing a major, internship opportunities, or future job prospects?',
          'motivation': 'Staying motivated can be challenging. Would you like to discuss finding purpose, overcoming procrastination, or building sustainable habits?',
          'mental': 'Mental health is crucial for academic success. Would you like to talk about managing anxiety, dealing with depression, or accessing campus resources?'
        },
        fallback: 'As a student, you\'re navigating many challenges. I\'m here to listen about academics, social life, career concerns, motivation, or mental health. What would you like to talk about?'
      },
      professionals: {
        keywords: {
          'work': 'Workplace challenges affect many professionals. Would you like to discuss managing workload, dealing with difficult colleagues, or career advancement?',
          'balance': 'Work-life balance is essential. Would you like to talk about setting boundaries, managing time, or prioritizing personal life?',
          'stress': 'Professional stress is common. Would you like to discuss stress management techniques, burnout prevention, or finding work satisfaction?',
          'leadership': 'Leadership roles bring unique challenges. Would you like to talk about team management, decision-making, or work relationships?',
          'career': 'Career development is ongoing. Would you like to discuss skill development, job changes, or achieving professional goals?',
          'motivation': 'Maintaining motivation at work matters. Would you like to talk about finding purpose, overcoming workplace challenges, or building job satisfaction?'
        },
        fallback: 'Professional life brings many experiences. I\'m here to discuss work challenges, career growth, work-life balance, leadership, or workplace stress. What\'s on your mind?'
      },
      general: {
        keywords: {
          'stress': 'Stress affects everyone differently. Would you like to talk about what\'s causing stress in your life or strategies for managing it?',
          'anxiety': 'Anxiety can feel overwhelming. Would you like to discuss coping strategies, grounding techniques, or when to seek professional help?',
          'sad': 'Feeling sad or down is a valid experience. Would you like to talk about what\'s contributing to these feelings or ways to find some comfort?',
          'lonely': 'Loneliness can be difficult to navigate. Would you like to discuss ways to build connections or coping with feelings of isolation?',
          'overwhelmed': 'Feeling overwhelmed is common. Would you like to talk about breaking things down, setting priorities, or finding support?',
          'change': 'Life changes can be challenging. Would you like to discuss adapting to transitions, managing uncertainty, or finding stability?'
        },
        fallback: 'I\'m here to listen and support you through whatever you\'re experiencing. You can talk to me about stress, emotions, relationships, work, or any aspect of life. What would you like to share?'
      }
    }

    const userResponses = responses[userType] || responses.general

    // Check for keywords in the message
    for (const [keyword, response] of Object.entries(userResponses.keywords)) {
      if (message.includes(keyword)) {
        return response
      }
    }

    // Return fallback response
    return userResponses.fallback
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(async () => {
      try {
        const botResponse = await getBotResponse(inputMessage)
        const botMessage = {
          id: messages.length + 2,
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      } catch (error) {
        console.error('ChatBot error:', error)
        const errorMessage = {
          id: messages.length + 2,
          text: 'Sorry, I encountered an error. Please try again or refresh the page.',
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
        setIsTyping(false)
      }
    }, 1000 + Math.random() * 2000) // Random delay between 1-3 seconds
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-pink-100 px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">💬</span>
          </div>
          <div>
            <h3 className="font-semibold text-pink-800">
              {userType === 'women' && 'Women\'s Wellness Companion'}
              {userType === 'students' && 'Student Support Buddy'}
              {userType === 'professionals' && 'Professional Wellness Advisor'}
              {userType === 'general' && 'Supportive Conversation Partner'}
            </h3>
            <p className="text-sm text-pink-600">Always here to listen</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'bg-white text-pink-800 border border-pink-100'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-2 ${
                message.sender === 'user' ? 'text-pink-100' : 'text-pink-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-pink-100 px-4 py-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-pink-100 px-4 py-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="flex-1 px-4 py-3 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {userType === 'women' && (
            <>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("I'm feeling overwhelmed with household responsibilities")}>
                Household stress
              </button>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("I need advice about relationships")}>
                Relationships
              </button>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("Work-life balance is challenging")}>
                Work balance
              </button>
            </>
          )}

          {userType === 'students' && (
            <>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("I'm stressed about exams")}>
                Exam stress
              </button>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("Having trouble with motivation")}>
                Motivation
              </button>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("Social life feels overwhelming")}>
                Social concerns
              </button>
            </>
          )}

          {userType === 'professionals' && (
            <>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("Workplace stress is affecting me")}>
                Work stress
              </button>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("Need help with work-life balance")}>
                Work balance
              </button>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("Feeling burned out")}>
                Burnout
              </button>
            </>
          )}

          {userType === 'general' && (
            <>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("I'm feeling anxious lately")}>
                Anxiety
              </button>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("Feeling overwhelmed with life")}>
                Overwhelmed
              </button>
              <button className="text-xs bg-pink-50 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                onClick={() => setInputMessage("Need someone to talk to")}>
                Need to talk
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatBot
