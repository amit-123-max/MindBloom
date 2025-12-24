import React, { useContext } from 'react'
import { JournalContext } from '../context/journal/JournalContext'
import { moodPredictionService } from '../services/moodPrediction'

const JournalList = ({ onEdit, onDelete }) => {
  const { journals, loading, deleteJournal } = useContext(JournalContext)

  const getSentimentColor = (journal) => {
    // Use mood prediction colors if available, fallback to sentiment
    if (journal.moodPrediction?.mood) {
      return moodPredictionService.getMoodColor(journal.moodPrediction.mood)
    }

    // Fallback to basic sentiment colors
    switch (journal.sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'neutral':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
      const result = await deleteJournal(id)
      if (!result.success) {
        alert(`Failed to delete journal: ${result.error}`)
      }
    }
  }

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-pink-600 text-lg">Loading journals...</div>
      </div>
    )
  }

  if (journals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-pink-800 mb-2">No journal entries yet</h3>
        <p className="text-pink-600">Start writing your first journal entry to capture your thoughts and feelings.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-pink-800 flex items-center gap-2">
          📝 Your Journal Entries
          <span className="text-sm font-normal text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
            {journals.length} entries
          </span>
        </h2>
      </div>

      {journals.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-pink-50 to-white rounded-2xl border border-pink-100">
          <div className="text-6xl mb-4">📓</div>
          <h3 className="text-xl font-semibold text-pink-800 mb-2">No journal entries yet</h3>
          <p className="text-pink-600 mb-4">Start capturing your thoughts and emotions!</p>
          <p className="text-sm text-pink-500">Your entries will appear here once saved</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {journals.map((journal, index) => (
            <div
              key={journal._id || `journal-${index}`}
              className="group bg-white p-6 rounded-2xl shadow-lg border border-pink-100/50 hover:shadow-2xl hover:border-pink-200 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-pink-100/30 to-transparent rounded-bl-full"></div>

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-pink-800 mb-2 line-clamp-2 group-hover:text-pink-900 transition-colors">
                      {journal.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-sm text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                        📅 {formatDate(journal.date)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${getSentimentColor(journal)} group-hover:scale-105`}
                      >
                        <span className="text-sm">
                          {journal.moodPrediction?.mood ?
                            moodPredictionService.getMoodEmoji(journal.moodPrediction.mood) :
                            getSentimentEmoji(journal.sentiment)
                          }
                        </span>
                        {journal.moodPrediction?.mood ?
                          moodPredictionService.getMoodName(journal.moodPrediction.mood) :
                          journal.sentiment
                        }
                      </span>
                      {journal.predictedMood && journal.predictedMood.confidence > 0.1 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300 ml-1 group-hover:shadow-md transition-all">
                          <span>🤖</span>
                          AI: {Math.round(journal.predictedMood.confidence * 100)}%
                        </span>
                      )}
                      {journal.isLocalOnly && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300 ml-1 group-hover:shadow-md transition-all">
                          <span>💾</span>
                          Local Only
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-5 line-clamp-3 leading-relaxed text-sm">
                  {truncateContent(journal.content)}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => onEdit(journal)}
                    className="flex-1 bg-gradient-to-r from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 text-pink-700 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(journal._id)}
                    className="px-4 py-2.5 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-700 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* Subtle animation indicator */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default JournalList
