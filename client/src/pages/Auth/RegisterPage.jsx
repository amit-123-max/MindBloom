import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/auth/AuthContext'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, isAuthenticated, error } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  })

  const { username, email, password, password2 } = formData

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/') // Redirect to home page if logged in
    }
    if (error) {
      alert(error) // Display error message
    }
  }, [isAuthenticated, error, navigate])

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) {
      alert('Passwords do not match')
    } else {
      register({ username, email, password })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-pink-100/50">
        <div>
          <h2 className="mt-6 text-center text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent">
            Create a New Account
          </h2>
          <p className="mt-4 text-center text-lg text-pink-600 font-light">
            Or
            <Link to="/login" className="font-medium text-pink-500 hover:text-pink-700 ml-1 transition-colors duration-200">
              sign in to your account
            </Link>
          </p>
          <div className="mt-4 text-center">
            <Link to="/" className="text-pink-600 hover:text-pink-800 font-medium">
              Back to Home
            </Link>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-pink-300 placeholder-pink-400 text-pink-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm bg-pink-50"
                placeholder="Username"
                value={username}
                onChange={onChange}
              />
            </div>
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-pink-300 placeholder-pink-400 text-pink-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm bg-pink-50"
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
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-pink-300 placeholder-pink-400 text-pink-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm bg-pink-50"
                placeholder="Password"
                value={password}
                onChange={onChange}
                minLength="6"
              />
            </div>
            <div>
              <input
                id="password2"
                name="password2"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-pink-300 placeholder-pink-400 text-pink-900 rounded-b-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm bg-pink-50"
                placeholder="Confirm Password"
                value={password2}
                onChange={onChange}
                minLength="6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
