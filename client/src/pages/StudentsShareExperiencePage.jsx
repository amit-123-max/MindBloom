import React from 'react'
import ShareExperienceForm from '../components/ShareExperienceForm'

const StudentsShareExperiencePage = () => {
  const handleSubmit = (formData) => {
    console.log('Student journey submitted:', formData)
    // Here you would typically send the data to your backend
    alert('Thank you for sharing your academic journey! Your story inspires and helps other students.')
  }

  return <ShareExperienceForm userType="students" onSubmit={handleSubmit} />
}

export default StudentsShareExperiencePage
