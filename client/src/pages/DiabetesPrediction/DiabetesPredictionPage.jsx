import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DiabetesPredictionPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    pregnancies: 0,
    glucose: 120,
    bloodPressure: 70,
    skinThickness: 20,
    insulin: 80,
    bmi: 25.0,
    diabetesPedigreeFunction: 0.5,
    age: 30
  })

  const [predictionResult, setPredictionResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [savingReport, setSavingReport] = useState(false)
    const [reportSaved, setReportSaved] = useState(false)
    const [assessmentHistory, setAssessmentHistory] = useState([])

    useEffect(() => {
        loadAssessmentHistory()
    }, [])

    const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'bmi' || name === 'diabetesPedigreeFunction' ? parseFloat(value) : parseInt(value)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPredictionResult(null)

    console.log("Frontend: Submitting form data:", formData);

    try {
      const response = await fetch('/api/health/diabetes-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to get diabetes prediction')
      }

      const data = await response.json()
      console.log("Frontend: Received prediction data:", data);
      setPredictionResult(data)
      loadAssessmentHistory()
    } catch (err) {
      console.error('Prediction error:', err)
      setError('Failed to get prediction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const saveReport = async () => {
    if (!predictionResult || predictionResult.saved_to_history) return

    setSavingReport(true)
    try {
      const response = await fetch('/api/health/diabetes-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          ...formData,
          prediction: predictionResult.prediction,
          riskScore: predictionResult.riskScore,
          confidence: predictionResult.confidence,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save diabetes report')
      }

      const data = await response.json()
      setPredictionResult(prev => ({ ...prev, saved_to_history: true, _id: data.assessmentId }));
      setReportSaved(true)
      loadAssessmentHistory()
    } catch (err) {
      console.error('Save report error:', err)
      setError('Failed to save report. Please try again.')
    } finally {
      setSavingReport(false)
    }
  }

  const loadAssessmentHistory = async () => {
    try {
      const response = await fetch('/api/health/diabetes-history', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAssessmentHistory(data.assessments || [])
      }
    } catch (err) {
      console.error('Failed to load diabetes history:', err)
    }
  }

  const calculateRiskScore = (data) => {
    let score = 0

    // Age factor
    if (data.age > 45) score += 0.2
    else if (data.age > 30) score += 0.1

    // Glucose factor
    if (data.glucose > 140) score += 0.25
    else if (data.glucose > 100) score += 0.15

    // BMI factor
    if (data.bmi > 30) score += 0.2
    else if (data.bmi > 25) score += 0.1

    // Blood pressure factor
    if (data.bloodPressure > 90) score += 0.15
    else if (data.bloodPressure > 80) score += 0.1

    // Pregnancies factor
    if (data.pregnancies > 5) score += 0.1
    else if (data.pregnancies > 2) score += 0.05

    // Insulin factor
    if (data.insulin > 150) score += 0.1

    // Skin thickness factor
    if (data.skinThickness > 30) score += 0.05

    // Diabetes pedigree function
    score += data.diabetesPedigreeFunction * 0.3

    return Math.min(score, 1) // Cap at 1.0
  }

  const getRecommendations = (prediction, data) => {
    const recommendations = []

    if (prediction === 'High Risk') {
      recommendations.push('Consult a healthcare professional immediately for comprehensive diabetes screening')
      recommendations.push('Consider lifestyle modifications and regular blood sugar monitoring')
    }

    if (data.glucose > 140) {
      recommendations.push('Monitor blood glucose levels regularly')
    }

    if (data.bmi > 25) {
      recommendations.push('Focus on maintaining a healthy weight through diet and exercise')
    }

    if (data.bloodPressure > 80) {
      recommendations.push('Monitor blood pressure and consider cardiovascular health check')
    }

    if (recommendations.length === 0) {
      recommendations.push('Maintain healthy lifestyle habits')
      recommendations.push('Continue regular health check-ups')
    }

    return recommendations
  }

  const resetForm = () => {
    setFormData({
      pregnancies: 0,
      glucose: 120,
      bloodPressure: 70,
      skinThickness: 20,
      insulin: 80,
      bmi: 25.0,
      diabetesPedigreeFunction: 0.5,
      age: 30
    })
    setPredictionResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-25 to-red-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/30 to-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-300/20 to-red-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-100/20 to-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-center space-x-4 mb-6">
                <span className="text-4xl animate-bounce">🩸</span>
                <span className="text-4xl animate-bounce delay-100">🔬</span>
                <span className="text-4xl animate-bounce delay-200">📊</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-800 via-red-700 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                Diabetes Prediction
                <span className="block bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">
                  AI-Powered Assessment
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-red-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                Our advanced machine learning model analyzes your health metrics to assess your risk
                of developing diabetes. Get personalized insights and recommendations for better health management.
              </p>
            </div>
          </div>
        </section>

        {/* Assessment Form Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-red-100/50 p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent mb-4">
                  Health Assessment Form
                </h2>
                <p className="text-red-600 text-lg font-light">
                  Please provide accurate information for the most reliable prediction
                </p>
              </div>

              {loading && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-500 border-t-transparent"></div>
                    <p className="text-red-700 font-medium">Analyzing your health data...</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200/30">
                  <h3 className="text-xl font-semibold text-red-800 mb-6 flex items-center">
                    <span className="text-2xl mr-3">👤</span>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="pregnancies" className="text-red-700 font-medium flex items-center">
                        <span className="text-lg mr-2">👶</span>
                        Number of Pregnancies
                      </label>
                      <input
                        type="number"
                        id="pregnancies"
                        name="pregnancies"
                        value={formData.pregnancies}
                        onChange={handleChange}
                        min="0"
                        max="20"
                        className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/70"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="age" className="text-red-700 font-medium flex items-center">
                        <span className="text-lg mr-2">🎂</span>
                        Age (years)
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="1"
                        max="120"
                        className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/70"
                        placeholder="30"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Measurements Section */}
                <div className="bg-gradient-to-r from-pink-50 to-red-50 p-6 rounded-2xl border border-pink-200/30">
                  <h3 className="text-xl font-semibold text-pink-800 mb-6 flex items-center">
                    <span className="text-2xl mr-3">📏</span>
                    Medical Measurements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="glucose" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">🩸</span>
                        Glucose Level (mg/dL)
                      </label>
                      <input
                        type="number"
                        id="glucose"
                        name="glucose"
                        value={formData.glucose}
                        onChange={handleChange}
                        min="0"
                        max="500"
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="bloodPressure" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">💓</span>
                        Blood Pressure (mmHg)
                      </label>
                      <input
                        type="number"
                        id="bloodPressure"
                        name="bloodPressure"
                        value={formData.bloodPressure}
                        onChange={handleChange}
                        min="0"
                        max="200"
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="70"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="skinThickness" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">📐</span>
                        Skin Thickness (mm)
                      </label>
                      <input
                        type="number"
                        id="skinThickness"
                        name="skinThickness"
                        value={formData.skinThickness}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="insulin" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">💉</span>
                        Insulin Level (mu U/ml)
                      </label>
                      <input
                        type="number"
                        id="insulin"
                        name="insulin"
                        value={formData.insulin}
                        onChange={handleChange}
                        min="0"
                        max="1000"
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="80"
                      />
                    </div>
                  </div>
                </div>

                {/* Body Metrics Section */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200/30">
                  <h3 className="text-xl font-semibold text-red-800 mb-6 flex items-center">
                    <span className="text-2xl mr-3">⚖️</span>
                    Body Metrics & Family History
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="bmi" className="text-red-700 font-medium flex items-center">
                        <span className="text-lg mr-2">📊</span>
                        BMI (Body Mass Index)
                      </label>
                      <input
                        type="number"
                        id="bmi"
                        name="bmi"
                        value={formData.bmi}
                        onChange={handleChange}
                        min="10"
                        max="60"
                        step="0.1"
                        className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/70"
                        placeholder="25.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="diabetesPedigreeFunction" className="text-red-700 font-medium flex items-center">
                        <span className="text-lg mr-2">👨‍👩‍👧‍👦</span>
                        Diabetes Pedigree Function
                      </label>
                      <input
                        type="number"
                        id="diabetesPedigreeFunction"
                        name="diabetesPedigreeFunction"
                        value={formData.diabetesPedigreeFunction}
                        onChange={handleChange}
                        min="0"
                        max="3"
                        step="0.01"
                        className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/70"
                        placeholder="0.5"
                      />
                      <p className="text-xs text-red-500 mt-1">Family history of diabetes (0.0-3.0 scale)</p>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      loading ? 'animate-pulse' : ''
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Analyzing Your Risk...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <span>🔬</span>
                        <span>Get Diabetes Prediction</span>
                        <span>📊</span>
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-red-600 hover:text-red-700 font-medium underline"
                  >
                    Reset Form
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-center font-medium">{error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {predictionResult && (
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-red-100/50 p-8 md:p-12">
                <div className="text-center mb-10">
                  <div className="flex justify-center space-x-4 mb-6">
                    <span className="text-4xl animate-bounce">🎯</span>
                    <span className="text-4xl animate-bounce delay-100">📈</span>
                    <span className="text-4xl animate-bounce delay-200">💡</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-700 to-pink-600 bg-clip-text text-transparent mb-4">
                    Your Diabetes Risk Assessment
                  </h3>
                  <p className="text-red-600 text-lg font-light">
                    Based on advanced machine learning analysis of your health metrics
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  {/* Risk Level Card */}
                  <div className={`bg-gradient-to-br ${
                    predictionResult.prediction === 'High Risk' ? 'from-red-400 to-red-500' :
                    predictionResult.prediction === 'Moderate Risk' ? 'from-yellow-400 to-yellow-500' :
                    'from-green-400 to-green-500'
                  } p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold">Diabetes Risk Level</h4>
                      <span className="text-4xl">
                        {predictionResult.prediction === 'High Risk' ? '🚨' :
                         predictionResult.prediction === 'Moderate Risk' ? '⚠️' : '✅'}
                      </span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{predictionResult.prediction}</div>
                    <div className="text-white/90 text-sm">
                      {predictionResult.prediction === 'High Risk' && 'High risk detected. Consult a healthcare professional immediately.'}
                      {predictionResult.prediction === 'Moderate Risk' && 'Moderate risk detected. Consider lifestyle changes and regular monitoring.'}
                      {predictionResult.prediction === 'Low Risk' && 'Low risk detected. Maintain healthy lifestyle habits.'}
                    </div>
                  </div>

                  {/* Risk Score Card */}
                  <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold">Risk Score</h4>
                      <span className="text-4xl">📊</span>
                    </div>
                    <div className="text-3xl font-bold mb-2">{predictionResult.riskScore !== undefined ? predictionResult.riskScore.toFixed(1) : 'N/A'}%</div>
                    <div className="text-white/90 text-sm">
                      Model Confidence: {predictionResult.confidence !== undefined ? predictionResult.confidence.toFixed(1) : 'N/A'}%
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {predictionResult.recommendations && predictionResult.recommendations.length > 0 && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-100/50 p-6 rounded-2xl border border-red-200/30 mb-8">
                    <h4 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                      <span className="text-2xl mr-3">💡</span>
                      Personalized Recommendations
                    </h4>
                    <div className="grid gap-3">
                      {predictionResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start space-x-3 bg-white/70 p-4 rounded-xl border border-red-200/30">
                          <span className="text-red-500 font-bold text-lg mt-1">{index + 1}.</span>
                          <span className="text-red-700 leading-relaxed">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Report Button */}
                <div className="mb-8 text-center">
                  {!predictionResult.saved_to_history && !reportSaved && (
                    <button
                      onClick={saveReport}
                      disabled={savingReport}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {savingReport ? (
                        <span className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Saving Report...</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <span>💾</span>
                          <span>Save This Report</span>
                        </span>
                      )}
                    </button>
                  )}

                  {reportSaved && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-green-500 text-2xl">✅</span>
                        <div>
                          <p className="text-green-800 font-semibold">Report Saved Successfully!</p>
                          <p className="text-green-700 text-sm">Your diabetes assessment has been saved to your history.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {predictionResult.saved_to_history && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-blue-500 text-2xl">📋</span>
                        <div>
                          <p className="text-blue-800 font-semibold">Report Already Saved</p>
                          <p className="text-blue-700 text-sm">This assessment is stored in your medical history.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl">ℹ️</span>
                    <div>
                      <h5 className="text-blue-800 font-semibold mb-2">Medical Disclaimer</h5>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        This assessment is for informational purposes only and is not a substitute for professional medical advice,
                        diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns and before
                        making significant health decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Assessment History Section */}
        {assessmentHistory.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-700 to-pink-600 bg-clip-text text-transparent mb-4">
                  Your Diabetes Health History
                </h2>
                <p className="text-red-600 text-lg font-light">
                  Track your diabetes risk assessments over time
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessmentHistory.map((assessment, index) => (
                  <div
                    key={assessment.id || index}
                    className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-red-100/50 p-6 transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🩸</span>
                        <span className="text-red-600 font-medium text-sm">
                          {new Date(assessment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                        #{assessmentHistory.length - index}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                        <span className="text-blue-700 font-medium">Risk Level</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-blue-800">{assessment.risk}</span>
                          <span className="text-2xl">
                            {assessment.risk === 'Low' ? '😊' :
                             assessment.risk === 'Moderate' ? '😐' : '😟'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200/50">
                        <span className="text-green-700 font-medium">Confidence</span>
                        <span className="font-bold text-green-800">{(assessment.probability * 100).toFixed(1)}%</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-red-50 p-2 rounded border border-red-200/30">
                          <div className="text-red-700 font-medium">Glucose</div>
                          <div className="font-bold text-red-800">{assessment.inputs?.glucose || 'N/A'}</div>
                        </div>
                        <div className="bg-red-50 p-2 rounded border border-red-200/30">
                          <div className="text-red-700 font-medium">BMI</div>
                          <div className="font-bold text-red-800">{assessment.inputs?.bmi || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {assessmentHistory.length > 0 && (
                <div className="text-center mt-12">
                  <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-200/50">
                    <span className="text-red-600 font-medium">
                      {assessmentHistory.length} assessment{assessmentHistory.length !== 1 ? 's' : ''} saved
                    </span>
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Back to Health Hub */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={() => navigate('/health-hub')}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              ← Back to Health Hub
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default DiabetesPredictionPage
