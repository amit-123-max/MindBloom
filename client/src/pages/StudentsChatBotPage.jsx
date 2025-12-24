import React from 'react'
import ChatBot from '../components/ChatBot'

const StudentsChatBotPage = () => {
  const welcomeMessage = "Hey there! I'm your Student Support Buddy, here to help you navigate the ups and downs of student life. Whether it's about exams, motivation, social life, career worries, or just needing someone to listen - I'm here for you. What's on your mind today?"

  return <ChatBot userType="students" welcomeMessage={welcomeMessage} />
}

export default StudentsChatBotPage
