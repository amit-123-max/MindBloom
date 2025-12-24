import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../context/auth/AuthContext'

const AuthPage = () => {
  const navigate = useNavigate()
  const { register, login, isAuthenticated, error, user, loading } = useContext(AuthContext)

  const [isLogin, setIsLogin] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(0)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  })
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const { username, email, password, password2 } = formData

  useEffect(() => {
    if (isAuthenticated && user) {
      if (isLogin) {
        // Login: Show success message with countdown
        const message = 'Login successful! Welcome back!'
        setSuccessMessage(message)
        setRedirectCountdown(3)

        const countdownInterval = setInterval(() => {
          setRedirectCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              setTimeout(() => {
                console.log('Navigating to home page after login...')
                navigate('/', { replace: true })
              }, 100)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        // Registration: Show alert and redirect immediately
        setTimeout(() => {
          alert('Registration successful! Welcome to MindBloom!')
          console.log('Navigating to home page after registration...')
          navigate('/', { replace: true })
        }, 100)
      }
    }
  }, [isAuthenticated, user, navigate, isLogin])

  useEffect(() => {
    if (error) {
      setSuccessMessage('')
      // For login errors, show in UI. Registration errors are handled in onSubmit with alerts
      if (isLogin) {
        // Error will be displayed in the UI for login
      }
    }
  }, [error, isLogin])

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      if (isLogin) {
        await login({ email, password })
      } else {
        if (password !== password2) {
          alert('Passwords do not match')
          setIsSubmitting(false)
          return
        }

        if (profileImage) {
          // Send as FormData when there's a profile image
          const formDataToSend = new FormData()
          formDataToSend.append('username', username)
          formDataToSend.append('email', email)
          formDataToSend.append('password', password)
          formDataToSend.append('profileImage', profileImage)
          await register(formDataToSend)
        } else {
          // Send as JSON when no profile image
          await register({
            username,
            email,
            password
          })
        }
      }
    } catch (err) {
      // Handle registration errors with alert for non-login mode
      if (!isLogin) {
        alert('Registration failed: ' + (err.message || 'Please try again'))
      }
      // Login errors are handled by the useEffect below
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      username: '',
      email: '',
      password: '',
      password2: '',
    })
    setProfileImage(null)
    setImagePreview('')
    setSuccessMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-pink-100/50">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-4">
            {isLogin ? 'Welcome Back' : 'Join MindBloom'}
          </h2>
          <div className="flex justify-center mb-6">
            <div className="bg-pink-100 p-1 rounded-full">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  isLogin
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'text-pink-600 hover:text-pink-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  !isLogin
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'text-pink-600 hover:text-pink-700'
                }`}
              >
                Register
              </button>
            </div>
          </div>
          <div className="text-center mb-6">
            <Link to="/" className="text-pink-600 hover:text-pink-800 font-medium">
              Back to Home
            </Link>
          </div>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
            <div className="font-medium">{successMessage}</div>
            {redirectCountdown > 0 && (
              <div className="text-sm mt-1">
                Redirecting to home page in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required={!isLogin}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-pink-300 placeholder-pink-400 text-pink-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm bg-pink-50"
                  placeholder="Username"
                  value={username}
                  onChange={onChange}
                />
              </div>
            )}

            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-pink-300 placeholder-pink-400 text-pink-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm bg-pink-50"
                placeholder="Email address"
                value={email}
                onChange={onChange}
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-pink-300 placeholder-pink-400 text-pink-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm bg-pink-50"
                placeholder="Password"
                value={password}
                onChange={onChange}
                minLength="6"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <input
                    id="password2"
                    name="password2"
                    type="password"
                    autoComplete="new-password"
                    required={!isLogin}
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-pink-300 placeholder-pink-400 text-pink-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm bg-pink-50"
                    placeholder="Confirm Password"
                    value={password2}
                    onChange={onChange}
                    minLength="6"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-pink-700">
                    Profile Picture (Optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={onImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profileImage"
                      className="cursor-pointer bg-pink-50 border border-pink-300 rounded-lg px-4 py-2 text-pink-700 hover:bg-pink-100 transition-colors duration-200"
                    >
                      Choose Image
                    </label>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-12 h-12 rounded-full object-cover border-2 border-pink-300"
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white transition-all duration-300 shadow-lg ${
                isSubmitting
                  ? 'bg-pink-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transform hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthPage
