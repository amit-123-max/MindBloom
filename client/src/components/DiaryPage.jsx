import React, { useState, useContext, useEffect } from 'react'
import { JournalContext } from '../context/journal/JournalContext'
import Navbar from './Navbar'
import Footer from './Footer'
import JournalForm from './JournalForm'
import JournalList from './JournalList'
import JournalCalendar from './JournalCalendar'
import MoodTracker from './MoodTracker'

const DiaryPage = () => {
  const { journals, getJournals, loading, error } = useContext(JournalContext)
  const [showForm, setShowForm] = useState(false)
  const [editingJournal, setEditingJournal] = useState(null)

  // useEffect(() => {
  //   console.log('DiaryPage: Loading journals...')
  //   getJournals()
  // }, [getJournals])

  // useEffect(() => {
  //   console.log('DiaryPage: Journals updated:', journals)
  //   console.log('DiaryPage: Loading state:', loading)
  //   console.log('DiaryPage: Error state:', error)
  // }, [journals, loading, error])
  useEffect(() => {
    console.log('DiaryPage: Loading journals...')
    getJournals()
  }, [])
  
  useEffect(() => {
    console.log('DiaryPage: Journals updated:', journals)
    console.log('DiaryPage: Loading state:', loading)
    console.log('DiaryPage: Error state:', error)
  }, [journals, loading, error])

  const handleCreateNew = () => {
    setEditingJournal(null)
    setShowForm(true)
  }

  const handleEdit = (journal) => {
    setEditingJournal(journal)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingJournal(null)
  }

  const handleSuccess = () => {
    console.log('DiaryPage: Journal saved successfully, journal already added to state')
    setShowForm(false)
    setEditingJournal(null)
    // Journal is already added to state by the addJournal function, no need to refresh
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-8 leading-tight">
              My Daily Journal
            </h1>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light">
              Capture your thoughts, track your emotions, and reflect on your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Calendar - Top Left */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <JournalCalendar journals={journals} />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  Error: {error}
                </div>
              )}

              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-pink-800">Journal Dashboard</h2>
                <button
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ✏️ Write New Entry
                </button>
              </div>

              {showForm && (
                <div className="mb-8">
                  <JournalForm
                    journalToEdit={editingJournal}
                    onCancel={handleCancel}
                    onSuccess={handleSuccess}
                  />
                </div>
              )}

              {/* Mood Tracker */}
              <div className="mb-8">
                <MoodTracker journals={journals} />
              </div>

              <JournalList
                onEdit={handleEdit}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default DiaryPage
