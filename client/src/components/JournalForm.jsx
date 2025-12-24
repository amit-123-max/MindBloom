import React, { useState, useContext, useEffect } from 'react'
import { JournalContext } from '../context/journal/JournalContext'
import SentimentSelector from './SentimentSelector'
import { moodPredictionService } from '../services/moodPrediction'

const JournalForm = ({ journalToEdit, onCancel, onSuccess }) => {
  const { addJournal, updateJournal } = useContext(JournalContext)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sentiment: 'neutral',
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD format
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [predictedMood, setPredictedMood] = useState(null)
  const [showPrediction, setShowPrediction] = useState(false)

  useEffect(() => {
    if (journalToEdit) {
      setFormData({
        title: journalToEdit.title || '',
        content: journalToEdit.content || '',
        sentiment: journalToEdit.sentiment || 'neutral',
        date: journalToEdit.date ? new Date(journalToEdit.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      })
    }
  }, [journalToEdit])

  const { title, content, sentiment, date } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Predict mood when content changes
  useEffect(() => {
    const predictMood = async () => {
      if (formData.content.length > 20) { // Only predict if there's substantial content
        const prediction = await moodPredictionService.predictMood(formData.content)
        setPredictedMood(prediction)
        setShowPrediction(true)
      } else {
        setPredictedMood(null)
        setShowPrediction(false)
      }
    }

    const debounceTimer = setTimeout(predictMood, 1000) // Debounce for better UX
    return () => clearTimeout(debounceTimer)
  }, [formData.content])

  const onSentimentChange = (newSentiment) => {
    setFormData({ ...formData, sentiment: newSentiment })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Use predicted mood if no manual sentiment selected and prediction is available
      let finalSentiment = sentiment
      if (sentiment === 'neutral' && predictedMood && predictedMood.confidence > 0.1) {
        finalSentiment = predictedMood.mood
      }

      const journalData = {
        title: title.trim(),
        content: content.trim(),
        sentiment: finalSentiment,
        date: new Date(date).toISOString(),
        predictedMood: predictedMood ? {
          mood: predictedMood.mood,
          confidence: predictedMood.confidence
        } : null
      }

      let result
      if (journalToEdit) {
        result = await updateJournal(journalToEdit._id, journalData)
      } else {
        result = await addJournal(journalData)
      }

      if (result.success) {
        console.log(`✅ Journal ${journalToEdit ? 'updated' : 'created'} successfully:`, result.data)

        // Show different messages based on save location
        if (result.backendSaved === false && !journalToEdit) {
          console.warn('⚠️ Journal saved locally only - will sync when server is available')
          alert('Journal saved locally. It will be synced to the server when connection is restored.')
        } else {
          console.log('🎉 Journal saved to server and should now be visible in the list!')
        }

        // Clear form immediately
        setFormData({
          title: '',
          content: '',
          sentiment: 'neutral',
          date: new Date().toISOString().slice(0, 10),
        })
        setPredictedMood(null)
        setShowPrediction(false)
        setIsSubmitting(false)

        // Call success callback
        onSuccess && onSuccess()
      } else {
        console.error(`❌ Failed to ${journalToEdit ? 'update' : 'create'} journal:`, result.error)
        alert(`Failed to ${journalToEdit ? 'update' : 'create'} journal: ${result.error}`)
        setIsSubmitting(false)
      }
    } catch (err) {
      alert(`Error: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-pink-100">
      <h3 className="text-xl font-semibold text-pink-800 mb-4">
        {journalToEdit ? 'Edit Journal Entry' : 'Create New Journal Entry'}
      </h3>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-pink-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-pink-50"
            placeholder="Give your journal entry a title..."
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-pink-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-pink-50"
          />
        </div>

        {/* Mood Prediction Display */}
        {showPrediction && predictedMood && (
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 border border-pink-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{moodPredictionService.getMoodEmoji(predictedMood.mood)}</div>
                <div>
                  <div className="font-medium text-pink-800">
                    Detected Mood: {moodPredictionService.getMoodName(predictedMood.mood)}
                  </div>
                  <div className="text-sm text-pink-600">
                    Confidence: {Math.round(predictedMood.confidence * 100)}%
                  </div>
                </div>
              </div>
              <div className="text-sm text-pink-600">
                {sentiment === 'neutral' ? 'Will be applied automatically' : 'You can override with manual selection'}
              </div>
            </div>
          </div>
        )}

        <SentimentSelector
          selectedSentiment={sentiment}
          onSentimentChange={onSentimentChange}
        />

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-pink-700 mb-1">
            Journal Entry
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={onChange}
            required
            rows={8}
            className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-pink-50 resize-vertical"
            placeholder="Write your thoughts, feelings, and experiences here..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {journalToEdit ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              journalToEdit ? 'Update Entry' : 'Create Entry'
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-pink-300 text-pink-600 rounded-full font-medium hover:bg-pink-50 transition-colors duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default JournalForm
