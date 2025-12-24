import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth/AuthContext'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext)

  const authLinks = (
    <div className="hidden md:flex items-center space-x-6">
      {user && user.profileImage ? (
        <img
          src={user.profileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-pink-300 shadow-md"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
          {user && user.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
      )}
      <button
        onClick={logout}
        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        Logout
      </button>
    </div>
  )

  const guestLinks = (
    <div className="hidden md:flex items-center space-x-8">
      <Link to="/login" className="text-pink-600 hover:text-pink-700 font-medium transition-all duration-300 hover:scale-105">
        Login
      </Link>
      <Link to="/register" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
        Get Started
      </Link>
    </div>
  )

  return (
    <nav className="bg-white/90 backdrop-blur-lg shadow-soft sticky top-0 z-50 border-b border-pink-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              🌸 MindBloom
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-pink-600 hover:text-pink-700 font-medium transition-all duration-300 hover:scale-105">
              Home
            </a>
            <a href="#about" className="text-pink-600 hover:text-pink-700 font-medium transition-all duration-300 hover:scale-105">
              About
            </a>
            <a href="#features" className="text-pink-600 hover:text-pink-700 font-medium transition-all duration-300 hover:scale-105">
              Features
            </a>
            <a href="#contact" className="text-pink-600 hover:text-pink-700 font-medium transition-all duration-300 hover:scale-105">
              Contact
            </a>
            <Link to="/health-predictions" className="text-pink-600 hover:text-pink-700 font-medium transition-all duration-300 hover:scale-105">
              Explore Health
            </Link>
            {isAuthenticated ? authLinks : guestLinks}
          </div>
          <div className="md:hidden">
            <button className="text-pink-500 hover:text-pink-600 transition-colors duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
