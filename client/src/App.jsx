import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import UserTypeSelection from './components/UserTypeSelection'
import Features from './components/Features'
import Notes from './components/Notes'
import Footer from './components/Footer'
import LGBTCommunity from './components/LGBTCommunity'
import DiaryPage from './components/DiaryPage'
import AlbumPage from './components/AlbumPage'
import AuthPage from './pages/Auth/AuthPage'
import ProtectedRoute from './components/ProtectedRoute'
import { JournalProvider } from './context/journal/JournalContext'
import { WellnessProvider } from './context/wellness/WellnessContext'
import WellnessPredictionPage from './pages/WellnessPredictionPage'
import HealthPredictionsPage from './pages/HealthPredictionsPage'
import DiabetesPredictionPage from './pages/DiabetesPrediction/DiabetesPredictionPage'
import HeartDiseasePage from './pages/HeartDiseasePage'
import MentalHealthPage from './pages/MentalHealthPage'
import { moodPredictionService } from './services/moodPrediction'
import WomenPage from './pages/WomenPage'
import StudentsPage from './pages/StudentsPage'
import ProfessionalsPage from './pages/ProfessionalsPage'
import GeneralPage from './pages/GeneralPage'
import WomenChatBotPage from './pages/WomenChatBotPage'
import StudentsChatBotPage from './pages/StudentsChatBotPage'
import ProfessionalsChatBotPage from './pages/ProfessionalsChatBotPage'
import GeneralChatBotPage from './pages/GeneralChatBotPage'
import WomenShareExperiencePage from './pages/WomenShareExperiencePage'
import StudentsShareExperiencePage from './pages/StudentsShareExperiencePage'
import ProfessionalsShareExperiencePage from './pages/ProfessionalsShareExperiencePage'
import CycleTrackingPage from './pages/CycleTrackingPage'
import PeriodHealthPage from './pages/PeriodHealthPage'
import NutritionExercisePage from './pages/NutritionExercisePage'
import PCOSPage from './pages/PCOSPage'
import WomenMentalHealthPage from './pages/WomenMentalHealthPage'
import ReproductiveHealthPage from './pages/ReproductiveHealthPage'
import ManageStressPage from './pages/ManageStressPage'
import ProcrastinationPage from './pages/ProcrastinationPage'
import SleepPage from './pages/SleepPage'
import ConfidencePage from './pages/ConfidencePage'
import FuturePlanningPage from './pages/FuturePlanningPage'
import MentalAwarenessPage from './pages/MentalAwarenessPage'

function HomePage() {
  // Initialize ML model on app start
  useEffect(() => {
    const initializeML = async () => {
      try {
        await moodPredictionService.initializeMLModel()
      } catch (error) {
        console.log('ML model initialization skipped (library not available)')
      }
    }

    initializeML()
  }, [])

  return (
    <div className="relative z-10">
      <Navbar />
      <Hero />
      <About />
      <UserTypeSelection />
      <Features />
      <Notes />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <JournalProvider>
        <WellnessProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100 relative overflow-hidden">
              {/* Optional background image overlay - uncomment and add your image */}
              {/* <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{backgroundImage: 'url("/path/to/your/background-image.jpg")'}}></div> */}

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/women" element={<WomenPage />} />
                <Route path="/women/chat" element={<WomenChatBotPage />} />
                <Route path="/women/share" element={<WomenShareExperiencePage />} />
                <Route path="/women/cycle-tracking" element={<CycleTrackingPage />} />
                <Route path="/women/period-health" element={<PeriodHealthPage />} />
                <Route path="/women/nutrition-exercise" element={<NutritionExercisePage />} />
                <Route path="/women/pcos" element={<PCOSPage />} />
                <Route path="/women/mental-health" element={<WomenMentalHealthPage />} />
                <Route path="/women/reproductive-health" element={<ReproductiveHealthPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/students/chat" element={<StudentsChatBotPage />} />
                <Route path="/students/share" element={<StudentsShareExperiencePage />} />
                <Route path="/student/manage-stress" element={<ManageStressPage />} />
                <Route path="/student/procrastination" element={<ProcrastinationPage />} />
                <Route path="/student/sleep" element={<SleepPage />} />
                <Route path="/student/confidence" element={<ConfidencePage />} />
                <Route path="/student/future" element={<FuturePlanningPage />} />
                <Route path="/student/mental-awareness" element={<MentalAwarenessPage />} />
                <Route path="/professionals" element={<ProfessionalsPage />} />
                <Route path="/professionals/chat" element={<ProfessionalsChatBotPage />} />
                <Route path="/professionals/share" element={<ProfessionalsShareExperiencePage />} />
                <Route path="/general" element={<GeneralPage />} />
                <Route path="/general/chat" element={<GeneralChatBotPage />} />
                <Route path="/lgbt-community" element={<LGBTCommunity />} />
                <Route path="/my-diary" element={<ProtectedRoute><DiaryPage /></ProtectedRoute>} />
                <Route path="/my-album" element={<ProtectedRoute><AlbumPage /></ProtectedRoute>} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                <Route path="/wellness-prediction" element={<ProtectedRoute><WellnessPredictionPage /></ProtectedRoute>} />
                <Route path="/health-predictions" element={<ProtectedRoute><HealthPredictionsPage /></ProtectedRoute>} />
                <Route path="/diabetes-prediction" element={<ProtectedRoute><DiabetesPredictionPage /></ProtectedRoute>} />
                <Route path="/heart-disease-prediction" element={<ProtectedRoute><HeartDiseasePage /></ProtectedRoute>} />
                <Route path="/mental-health-assessment" element={<ProtectedRoute><MentalHealthPage /></ProtectedRoute>} />
              </Routes>
            </div>
          </Router>
        </WellnessProvider>
      </JournalProvider>
    </ErrorBoundary>
  )
}

export default App
