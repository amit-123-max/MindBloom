import React from 'react'
import ChatBot from '../components/ChatBot'

const ProfessionalsChatBotPage = () => {
  const welcomeMessage = "Hello! I'm your Professional Wellness Advisor. I understand the unique challenges of professional life - from work stress and career decisions to maintaining work-life balance. I'm here to listen, offer guidance, and support you in whatever professional or personal matters you'd like to discuss. How can I help you today?"

  return <ChatBot userType="professionals" welcomeMessage={welcomeMessage} />
}

export default ProfessionalsChatBotPage
