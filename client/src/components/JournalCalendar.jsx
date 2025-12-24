import React from 'react'

const JournalCalendar = ({ journals }) => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  // Create array of days with journal entries
  const daysWithEntries = journals.reduce((acc, journal) => {
    const journalDate = new Date(journal.date)
    if (journalDate.getMonth() === currentMonth && journalDate.getFullYear() === currentYear) {
      acc.push(journalDate.getDate())
    }
    return acc
  }, [])

  const renderCalendarDays = () => {
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEntry = daysWithEntries.includes(day)
      const isToday = day === today.getDate()

      days.push(
        <div
          key={day}
          className={`h-8 w-8 flex items-center justify-center text-sm rounded-full transition-all duration-200 ${
            hasEntry
              ? 'bg-pink-500 text-white font-bold shadow-md'
              : isToday
              ? 'bg-pink-200 text-pink-800 font-semibold'
              : 'text-gray-600 hover:bg-pink-100'
          }`}
        >
          {day}
        </div>
      )
    }

    return days
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-pink-200/50">
      <div className="text-center mb-3">
        <h3 className="text-lg font-semibold text-pink-800">
          {monthNames[currentMonth]} {currentYear}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-pink-700 mb-2">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <span className="text-pink-700">Journal Entry</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-pink-200 rounded-full"></div>
          <span className="text-pink-700">Today</span>
        </div>
      </div>
    </div>
  )
}

export default JournalCalendar
