import React, { createContext, useReducer, useEffect } from 'react'
import authReducer from './authReducer'

const AuthContext = createContext()
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

const initialState = {
  token: DEMO_MODE ? 'demo-token' : localStorage.getItem('token'),
  isAuthenticated: DEMO_MODE ? true : null,
  loading: DEMO_MODE ? false : true,
  user: DEMO_MODE ? { username: 'Demo User', email: 'demo@example.com' } : null,
  error: null,
}

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user on app start
  React.useEffect(() => {
    loadUser()
  }, [])

  // Load User (e.g., check token on initial load)
  const loadUser = async () => {
    // In demo mode, skip API call and use demo user
    if (DEMO_MODE) {
      dispatch({
        type: 'USER_LOADED',
        payload: { username: 'Demo User', email: 'demo@example.com' },
      })
      return
    }

    if (localStorage.getItem('token')) {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        })

        if (res.ok) {
          const data = await res.json()
          dispatch({ type: 'USER_LOADED', payload: data })
        } else {
          const errorText = await res.text()
          console.error('AuthContext: Error loading user:', errorText)
          dispatch({ type: 'AUTH_ERROR', payload: errorText })
        }
      } catch (err) {
        dispatch({ type: 'AUTH_ERROR' })
        console.error('AuthContext: Network or JSON parse error during user load:', err.message)
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' })
    }
  }

  // Register User
  const register = async (data) => {
    // Demo mode: simulate successful registration
    if (DEMO_MODE) {
      setTimeout(() => {
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: {
            token: 'demo-token-12345',
            user: { username: 'Demo User', email: 'demo@example.com' }
          }
        })
      }, 1000) // Simulate network delay
      return
    }

    try {
      console.log('AuthContext: Starting registration...', data instanceof FormData ? 'with FormData' : 'with JSON')

      let requestBody, headers = {}

      if (data instanceof FormData) {
        // Handle FormData (with profile image)
        requestBody = data
        // Don't set Content-Type header - let browser set it with boundary
      } else {
        // Handle JSON data (no profile image)
        requestBody = JSON.stringify(data)
        headers['Content-Type'] = 'application/json'
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers,
        body: requestBody,
      })

      console.log('AuthContext: Registration response status:', res.status)

      if (!res.ok) {
        // Try to get error message from response
        try {
          const errorData = await res.text()
          console.error('AuthContext: Registration failed with error:', errorData)
          dispatch({ type: 'REGISTER_FAIL', payload: errorData || 'Registration failed' })
          throw new Error(errorData || 'Registration failed')
        } catch (parseError) {
          console.error('AuthContext: Could not parse error response:', parseError)
          dispatch({ type: 'REGISTER_FAIL', payload: 'Registration failed' })
          throw new Error('Registration failed')
        }
      }

      // Get response data
      const responseText = await res.text()
      console.log('AuthContext: Raw response:', responseText)

      if (!responseText) {
        throw new Error('Empty response from server')
      }

      const responseData = JSON.parse(responseText)
      console.log('AuthContext: Parsed response data:', responseData)

      localStorage.setItem('token', responseData.token)
      dispatch({ type: 'REGISTER_SUCCESS', payload: responseData })
    } catch (err) {
      console.error('AuthContext: Registration error:', err.message)
      dispatch({ type: 'REGISTER_FAIL', payload: err.message || 'Registration failed' })
      throw err
    }
  }

  // Login User
  const login = async (formData) => {
    // Demo mode: simulate successful login
    if (DEMO_MODE) {
      setTimeout(() => {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token: 'demo-token-12345',
            user: { username: 'Demo User', email: 'demo@example.com' }
          }
        })
      }, 1000) // Simulate network delay
      return
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('token', data.token)
        console.log('Login successful, setting token and dispatching success')
        dispatch({ type: 'LOGIN_SUCCESS', payload: data })
      } else {
        const errorText = await res.text()
        console.error('AuthContext: Login failed:', errorText)
        dispatch({ type: 'LOGIN_FAIL', payload: errorText || 'Login failed' })
        throw new Error(errorText || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err.message)
      dispatch({ type: 'LOGIN_FAIL', payload: err.message || 'Login failed' })
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
