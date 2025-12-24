import React from 'react'

const Notes = () => {
  const notes = [
    {
      icon: '🔒',
      title: 'Your Privacy Matters',
      description: 'All your data is encrypted and securely stored. Your personal information and journal entries are completely private.',
      gradient: 'from-pink-50 to-pink-100'
    },
    {
      icon: '📞',
      title: '24/7 Support Available',
      description: 'Our crisis support line is available around the clock for immediate help when you need it most.',
      gradient: 'from-pink-25 to-pink-50'
    },
    {
      icon: '🎯',
      title: 'Evidence-Based Approach',
      description: 'Our tools and techniques are backed by scientific research and clinical expertise for maximum effectiveness.',
      gradient: 'from-white to-pink-25'
    },
    {
      icon: '🌍',
      title: 'Inclusive & Accessible',
      description: 'Designed to be accessible to everyone, regardless of background, ability, or location.',
      gradient: 'from-pink-50 to-pink-100'
    }
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-white via-pink-25 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-8">
            Important Notes
          </h2>
          <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light">
            Everything you need to know about using our platform safely and effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {notes.map((note, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${note.gradient} backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-pink-100/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group`}
            >
              <div className="flex items-start space-x-6">
                <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">{note.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">{note.title}</h3>
                  <p className="text-pink-700 leading-relaxed font-light">{note.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-pink-100 via-pink-200 to-pink-100 rounded-3xl p-12 text-center shadow-xl border border-pink-200/50">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-6">
            Remember: You're Not Alone
          </h3>
          <p className="text-lg text-pink-700 max-w-3xl mx-auto leading-relaxed font-light mb-8">
            Mental wellbeing is a journey, not a destination. Every small step you take
            matters, and we're here to support you every step of the way. Your courage
            in seeking help is already a powerful act of self-love.
          </p>
          <div className="mt-8 flex justify-center space-x-6 text-pink-500">
            <span className="text-3xl animate-pulse">💕</span>
            <span className="text-3xl animate-pulse delay-100">🌸</span>
            <span className="text-3xl animate-pulse delay-200">💕</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Notes
