import React, { createContext, useReducer, useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'
import { apiService } from '../../services/api'

const JournalContext = createContext()

const initialState = {
  journals: [],
  currentJournal: null,
  loading: false,
  error: null,
}

const journalReducer = (state, action) => {
  switch (action.type) {
    case 'JOURNALS_LOADING':
      return {
        ...state,
        loading: true,
      }
    case 'GET_JOURNALS':
      return {
        ...state,
        journals: action.payload,
        loading: false,
        error: null,
      }
    case 'GET_JOURNAL':
      return {
        ...state,
        currentJournal: action.payload,
        loading: false,
        error: null,
      }
    case 'ADD_JOURNAL':
      return {
        ...state,
        journals: [action.payload, ...state.journals],
        loading: false,
        error: null,
      }
    case 'UPDATE_JOURNAL':
      return {
        ...state,
        journals: state.journals.map(journal =>
          journal._id === action.payload._id ? action.payload : journal
        ),
        currentJournal: action.payload,
        loading: false,
        error: null,
      }
    case 'DELETE_JOURNAL':
      return {
        ...state,
        journals: state.journals.filter(journal => journal._id !== action.payload),
        currentJournal: null,
        loading: false,
        error: null,
      }
    case 'JOURNAL_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case 'CLEAR_CURRENT_JOURNAL':
      return {
        ...state,
        currentJournal: null,
      }
    default:
      return state
  }
}

const JournalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(journalReducer, initialState)
  const { user } = useContext(AuthContext)

  // Get all journals for the current user
  const getJournals = async () => {
    dispatch({ type: 'JOURNALS_LOADING' })

    const token = localStorage.getItem('token')

    if (token) {
      try {
        const data = await apiService.getJournals()
        dispatch({ type: 'GET_JOURNALS', payload: data })
        // Backup to localStorage
        localStorage.setItem('journals_backup', JSON.stringify(data))
        return
      } catch (err) {
        console.warn('JournalContext: Backend unavailable, using localStorage:', err.message)
      }
    }

    // Fallback to localStorage
    try {
      const backupJournals = localStorage.getItem('journals_backup')
      if (backupJournals) {
        const parsedBackup = JSON.parse(backupJournals)
        dispatch({ type: 'GET_JOURNALS', payload: parsedBackup })
      } else {
        dispatch({ type: 'GET_JOURNALS', payload: [] })
      }
    } catch (err) {
      console.error('JournalContext: Error loading from localStorage:', err.message)
      dispatch({ type: 'GET_JOURNALS', payload: [] })
    }
  }

  // Get a single journal entry
  const getJournal = async (id) => {
    dispatch({ type: 'JOURNALS_LOADING' })

    try {
      const res = await fetch(`/api/journals/${id}`, {
        method: 'GET',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      })

      const data = await res.json()

      if (res.ok) {
        dispatch({ type: 'GET_JOURNAL', payload: data })
      } else {
        dispatch({ type: 'JOURNAL_ERROR', payload: data.msg })
      }
    } catch (err) {
      dispatch({ type: 'JOURNAL_ERROR', payload: 'Server error' })
      console.error(err.message)
    }
  }

  // Add a new journal entry
  const addJournal = async (journalData) => {
    dispatch({ type: 'JOURNALS_LOADING' })

    const token = localStorage.getItem('token')

    try {
      // Try backend first if authenticated
      if (token) {
        const savedJournal = await apiService.createJournal(journalData)
        dispatch({ type: 'ADD_JOURNAL', payload: savedJournal })
        // Backup to localStorage
        const backupJournals = JSON.parse(localStorage.getItem('journals_backup') || '[]')
        backupJournals.push(savedJournal)
        localStorage.setItem('journals_backup', JSON.stringify(backupJournals))
        return { success: true, data: savedJournal, backendSaved: true }
      } else {
        throw new Error('No authentication token')
      }
    } catch (err) {
      console.warn('JournalContext: Backend unavailable, journal saved locally:', err.message)

      // Create local journal entry
      const localJournal = {
        ...journalData,
        _id: `local_${Date.now()}`,
        user: 'local_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isLocalOnly: true
      }

      dispatch({ type: 'ADD_JOURNAL', payload: localJournal })
      return { success: true, data: localJournal, backendSaved: false }
    }
  }

  // Update a journal entry
  const updateJournal = async (id, journalData) => {
    dispatch({ type: 'JOURNALS_LOADING' })

    const token = localStorage.getItem('token')

    try {
      if (token) {
        const data = await apiService.updateJournal(id, journalData)
        dispatch({ type: 'UPDATE_JOURNAL', payload: data })
        return { success: true, data }
      } else {
        throw new Error('No authentication token')
      }
    } catch (err) {
      console.warn('JournalContext: Backend unavailable, update failed:', err.message)
      dispatch({ type: 'JOURNAL_ERROR', payload: 'Failed to update journal' })
      return { success: false, error: 'Failed to update journal' }
    }
  }

  // Delete a journal entry
  const deleteJournal = async (id) => {
    dispatch({ type: 'JOURNALS_LOADING' })

    const token = localStorage.getItem('token')

    try {
      if (token) {
        await apiService.deleteJournal(id)
        dispatch({ type: 'DELETE_JOURNAL', payload: id })
        return { success: true }
      } else {
        throw new Error('No authentication token')
      }
    } catch (err) {
      console.warn('JournalContext: Backend unavailable, delete failed:', err.message)
      dispatch({ type: 'JOURNAL_ERROR', payload: 'Failed to delete journal' })
      return { success: false, error: 'Failed to delete journal' }
    }
  }

  // Clear current journal
  const clearCurrentJournal = () => {
    dispatch({ type: 'CLEAR_CURRENT_JOURNAL' })
  }

  return (
    <JournalContext.Provider
      value={{
        ...state,
        getJournals,
        getJournal,
        addJournal,
        updateJournal,
        deleteJournal,
        clearCurrentJournal,
      }}
    >
      {children}
    </JournalContext.Provider>
  )
}

export { JournalContext, JournalProvider }
