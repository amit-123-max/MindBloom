import React from 'react'

const SentimentSelector = ({ selectedSentiment, onSentimentChange }) => {
  const sentiments = [
    {
      value: 'positive',
      label: 'Positive',
      emoji: '😊',
      color: 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200',
    },
    {
      value: 'neutral',
      label: 'Neutral',
      emoji: '😐',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200',
    },
    {
      value: 'negative',
      label: 'Negative',
      emoji: '😔',
      color: 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200',
    },
  ]

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-pink-700">
        How are you feeling?
      </label>
      <div className="flex gap-3">
        {sentiments.map((sentiment) => (
          <button
            key={sentiment.value}
            type="button"
            onClick={() => onSentimentChange(sentiment.value)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${
              selectedSentiment === sentiment.value
                ? sentiment.color + ' ring-2 ring-pink-300'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{sentiment.emoji}</span>
            <span className="font-medium">{sentiment.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SentimentSelector
