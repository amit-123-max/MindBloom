import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import apiService from '../services/api'

const ProcrastinationPage = () => {
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage on component mount
    try {
      const savedTasks = localStorage.getItem('procrastination_tasks')
      return savedTasks ? JSON.parse(savedTasks) : []
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error)
      return []
    }
  })
  const [currentTask, setCurrentTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    priority: 'medium',
    estimatedTime: 25
  })
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [customWorkTime, setCustomWorkTime] = useState(25)
  const [customBreakTime, setCustomBreakTime] = useState(5)
  const [productivityScore, setProductivityScore] = useState(0)
  const [reflection, setReflection] = useState('')
  const [showReflection, setShowReflection] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [predictions, setPredictions] = useState(null)

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem('procrastination_tasks', JSON.stringify(tasks))
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error)
    }
  }, [tasks])

  // Pomodoro timer effect
  useEffect(() => {
    let interval = null
    if (isActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => {
          if (time <= 1) {
            // Timer completed - play notification sound and show alert
            if (isBreak) {
              // Break finished, start work session
              setIsBreak(false)
              setPomodoroTime(customWorkTime * 60)
              // Use Notification API if available, fallback to alert
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('⏰ Break Time Over!', {
                  body: 'Time to get back to work!',
                  icon: '/favicon.ico',
                  tag: 'pomodoro-break-end'
                })
              }
              alert('⏰ Break time is over! Time to get back to work!')
            } else {
              // Work session finished, start break
              setIsBreak(true)
              setPomodoroTime(customBreakTime * 60)
              setCompletedPomodoros(prev => prev + 1)
              updateProductivityScore()
              // Use Notification API if available, fallback to alert
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('🎉 Work Session Complete!', {
                  body: `Great work! Take a ${customBreakTime} minute break.`,
                  icon: '/favicon.ico',
                  tag: 'pomodoro-work-end'
                })
              }
              alert(`🎉 Great work! Take a ${customBreakTime} minute break.`)
            }
            setIsActive(false)
            return 0
          }
          return time - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, pomodoroTime, isBreak, customWorkTime, customBreakTime])

  const updateProductivityScore = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.completed).length
    const score = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    setProductivityScore(score)
  }

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        ...newTask,
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString()
      }
      setTasks(prev => [...prev, task])
      setNewTask({
        title: '',
        deadline: '',
        priority: 'medium',
        estimatedTime: 25
      })
      console.log('Task added successfully:', task)
    } else {
      alert('Please enter a task title')
    }
  }

  const startPomodoro = (task) => {
    setCurrentTask(task)
    setPomodoroTime(customWorkTime * 60)
    setIsActive(true)
    setIsBreak(false)
  }

  const pausePomodoro = () => {
    setIsActive(false)
  }

  const stopPomodoro = () => {
    setIsActive(false)
    setPomodoroTime(customWorkTime * 60)
    setIsBreak(false)
    setCurrentTask(null)
  }

  const resetPomodoro = () => {
    setPomodoroTime(customWorkTime * 60)
    setIsActive(false)
    setIsBreak(false)
  }

  const completeTask = (taskId) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId.toString() ? { ...task, completed: true, completedAt: new Date().toISOString() } : task
    ))
    updateProductivityScore()
    console.log('Task completed:', taskId)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async () => {
    // Validate that there's at least one task
    if (tasks.length === 0) {
      alert('Please add at least one task before submitting.')
      return
    }

    // Validate tasks have required fields
    const invalidTasks = tasks.filter(task =>
      !task.title.trim() ||
      !task.deadline ||
      !task.estimatedTime ||
      task.estimatedTime < 5
    )

    if (invalidTasks.length > 0) {
      alert('Please ensure all tasks have a title, deadline, and valid estimated time (minimum 5 minutes).')
      return
    }

    setIsSubmitting(true)
    try {
      const procrastinationData = {
        tasks: tasks.map(task => ({
          title: task.title.trim(),
          deadline: task.deadline,
          priority: task.priority,
          estimatedTime: task.estimatedTime,
          completed: task.completed
        })),
        completedPomodoros,
        productivityScore,
        reflection: reflection.trim(),
        timestamp: new Date()
      }

      console.log('Submitting procrastination data:', procrastinationData)
      const response = await apiService.post('/student/procrastination', procrastinationData)

      if (response.predictions) {
        setPredictions(response.predictions)
      }

      alert('Productivity session saved successfully!')
    } catch (error) {
      console.error('Error submitting procrastination data:', error)
      alert(`Failed to save session: ${error.message || 'Please try again.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50'
      case 'medium': return 'border-yellow-300 bg-yellow-50'
      case 'low': return 'border-green-300 bg-green-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">⏰</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-4">
              Time Management & Procrastination Buster
            </h1>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light leading-relaxed">
              Break the cycle of procrastination with focused work sessions and smart task management.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Task Management */}
            <div className="space-y-8">
              {/* Add New Task */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-2xl font-bold text-pink-800 mb-6">Add New Task</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-pink-700 mb-2">Task Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What needs to be done?"
                      className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-pink-700 mb-2">Deadline</label>
                    <input
                      type="datetime-local"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-pink-700 mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-pink-700 mb-2">Estimated Time (minutes)</label>
                    <input
                      type="number"
                      value={newTask.estimatedTime}
                      onChange={(e) => setNewTask(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 25 }))}
                      min="5"
                      max="120"
                      className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={addTask}
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Add Task
                  </button>
                </div>
              </div>

              {/* Task List */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-2xl font-bold text-pink-800 mb-6">Your Tasks</h2>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {tasks.length === 0 ? (
                    <p className="text-pink-600 text-center py-8">No tasks added yet. Add your first task above!</p>
                  ) : (
                    tasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl border-2 ${getPriorityColor(task.priority)} ${task.completed ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className={`font-semibold ${task.completed ? 'line-through text-pink-500' : 'text-pink-800'}`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-pink-600">
                              Deadline: {task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline'}
                            </p>
                            <p className="text-sm text-pink-600">Est. time: {task.estimatedTime} min</p>
                          </div>
                          <div className="flex space-x-2">
                            {!task.completed && (
                              <button
                                onClick={() => startPomodoro(task)}
                                className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors"
                              >
                                Start
                              </button>
                            )}
                            {!task.completed && (
                              <button
                                onClick={() => completeTask(task.id)}
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Pomodoro Timer & Productivity */}
            <div className="space-y-8">
              {/* Pomodoro Timer */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">Pomodoro Timer</h2>

                {currentTask && (
                  <div className="text-center mb-6">
                    <p className="text-lg font-semibold text-pink-700 mb-2">Current Task:</p>
                    <p className="text-pink-600">{currentTask.title}</p>
                  </div>
                )}

                {/* Timer Settings */}
                <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl">
                  <h3 className="text-lg font-semibold text-pink-800 mb-3 text-center">Timer Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-pink-700 mb-2">Work Time (min)</label>
                      <select
                        value={customWorkTime}
                        onChange={(e) => setCustomWorkTime(parseInt(e.target.value))}
                        disabled={isActive}
                        className="w-full p-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                        <option value={30}>30</option>
                        <option value={45}>45</option>
                        <option value={60}>60</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-pink-700 mb-2">Break Time (min)</label>
                      <select
                        value={customBreakTime}
                        onChange={(e) => setCustomBreakTime(parseInt(e.target.value))}
                        disabled={isActive}
                        className="w-full p-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="text-6xl font-mono text-pink-700 mb-4">
                    {formatTime(pomodoroTime)}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-pink-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-pink-600 h-3 rounded-full transition-all duration-1000"
                      style={{
                        width: isBreak
                          ? `${((customBreakTime * 60 - pomodoroTime) / (customBreakTime * 60)) * 100}%`
                          : `${((customWorkTime * 60 - pomodoroTime) / (customWorkTime * 60)) * 100}%`
                      }}
                    ></div>
                  </div>

                  <p className="text-pink-600">
                    {isBreak ? 'Break Time! Take a rest.' : 'Focus Time - Stay concentrated!'}
                  </p>
                  {currentTask && (
                    <p className="text-sm text-pink-500 mt-2">Working on: {currentTask.title}</p>
                  )}
                </div>

                <div className="flex justify-center space-x-4 flex-wrap">
                  {!currentTask ? (
                    <p className="text-pink-600 text-center w-full">Select a task above to start the timer</p>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsActive(!isActive)}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        {isActive ? 'Pause' : 'Start'}
                      </button>
                      <button
                        onClick={stopPomodoro}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        Stop
                      </button>
                      <button
                        onClick={resetPomodoro}
                        className="px-6 py-3 bg-pink-100 text-pink-700 rounded-xl font-semibold hover:bg-pink-200 transition-all duration-300"
                      >
                        Reset
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-pink-600">Completed Pomodoros: <span className="font-bold text-pink-700">{completedPomodoros}</span></p>
                </div>
              </div>

              {/* Productivity Score */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">Productivity Score</h2>

                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-pink-700 mb-2">{productivityScore}%</div>
                  <div className="w-full bg-pink-200 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-pink-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${productivityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-pink-600 mt-2">
                    {productivityScore >= 80 ? 'Excellent!' : productivityScore >= 60 ? 'Good job!' : productivityScore >= 40 ? 'Keep going!' : 'Let\'s improve!'}
                  </p>
                </div>
              </div>

              {/* AI Predictions */}
              {predictions && (
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                  <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">AI Insights</h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">🎯</span>
                        <div>
                          <p className="font-semibold text-pink-800">Procrastination Risk: {predictions.riskLevel}</p>
                          <p className="text-pink-600 text-sm">{predictions.advice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reflection */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100/50">
                <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">Reflection</h2>

                <div className="mb-6">
                  <label className="block text-lg font-semibold text-pink-800 mb-3">
                    Why am I delaying this task? What thoughts are holding me back?
                  </label>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Be honest with yourself. Understanding the 'why' is the first step to overcoming procrastination..."
                    className="w-full h-32 p-4 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Session'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProcrastinationPage
