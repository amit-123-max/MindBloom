import React from 'react'
import ShareExperienceForm from '../components/ShareExperienceForm'

const WomenShareExperiencePage = () => {
  const handleSubmit = (formData) => {
    console.log('Women experience submitted:', formData)
    // Here you would typically send the data to your backend
    alert('Thank you for sharing your story! Your experience helps us support women everywhere.')
  }

  return <ShareExperienceForm userType="women" onSubmit={handleSubmit} />
}

export default WomenShareExperiencePage
