import React from 'react'
import ShareExperienceForm from '../components/ShareExperienceForm'

const ProfessionalsShareExperiencePage = () => {
  const handleSubmit = (formData) => {
    console.log('Professional experience submitted:', formData)
    // Here you would typically send the data to your backend
    alert('Thank you for sharing your professional experience! Your insights help create better workplace support.')
  }

  return <ShareExperienceForm userType="professionals" onSubmit={handleSubmit} />
}

export default ProfessionalsShareExperiencePage
