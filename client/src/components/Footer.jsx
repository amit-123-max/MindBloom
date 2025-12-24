import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 text-white py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-100 to-white bg-clip-text text-transparent">
              🌸 MindBloom
            </div>
            <p className="text-pink-100 leading-relaxed mb-8 font-light text-lg">
              Your companion on the journey to mental wellbeing. We believe everyone deserves
              to feel supported, understood, and empowered in their unique path to wellness.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-pink-200 hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="text-2xl">📘</span>
              </a>
              <a href="#" className="text-pink-200 hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="text-2xl">🐦</span>
              </a>
              <a href="#" className="text-pink-200 hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="text-2xl">📷</span>
              </a>
              <a href="#" className="text-pink-200 hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="text-xl">💼</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-pink-100">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#home" className="text-pink-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">Home</a></li>
              <li><a href="#about" className="text-pink-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">About</a></li>
              <li><a href="#features" className="text-pink-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">Features</a></li>
              <li><a href="#contact" className="text-pink-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-pink-100">Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-pink-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">Help Center</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">Privacy Policy</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">Terms of Service</a></li>
              <li><a href="#" className="text-pink-200 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-pink-500/50 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-pink-200 text-sm font-light">
              © 2024 MindBloom. Made with 💖 for mental wellbeing.
            </p>
            <div className="flex items-center space-x-6 mt-6 md:mt-0">
              <span className="text-pink-200 text-sm font-medium">Need help?</span>
              <a href="tel:1-800-HELP" className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
                24/7 Support
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="flex justify-center space-x-4 text-pink-300">
            <span className="text-2xl animate-pulse">🌸</span>
            <span className="text-2xl animate-pulse delay-100">💕</span>
            <span className="text-2xl animate-pulse delay-200">🌺</span>
            <span className="text-2xl animate-pulse delay-300">💖</span>
            <span className="text-2xl animate-pulse delay-400">🌸</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
