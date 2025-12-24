import React from 'react'
import ChatBot from '../components/ChatBot'

const WomenChatBotPage = () => {
  const welcomeMessage = "Hello! I'm your Women's Wellness Companion. I'm here to listen and support you through whatever you're experiencing - whether it's about relationships, health, work, family, or personal growth. You can talk to me about anything that's on your mind. What's been going on for you?"

  return <ChatBot userType="women" welcomeMessage={welcomeMessage} />
}

export default WomenChatBotPage
