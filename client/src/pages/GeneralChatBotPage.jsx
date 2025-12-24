import React from 'react'
import ChatBot from '../components/ChatBot'

const GeneralChatBotPage = () => {
  const welcomeMessage = "Hello! I'm your Supportive Conversation Partner. I'm here to listen to whatever is on your mind - whether it's about stress, emotions, relationships, work, or any aspect of life. There's no pressure to share anything specific, and I'm here to offer a gentle, non-judgmental space for conversation. What would you like to talk about?"

  return <ChatBot userType="general" welcomeMessage={welcomeMessage} />
}

export default GeneralChatBotPage
