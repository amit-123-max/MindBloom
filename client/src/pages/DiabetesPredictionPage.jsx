import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DiabetesPredictionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pregnancies: 0,
    glucose: 0,
    bloodPressure: 0,
    skinThickness: 0,
    insulin: 0,
    bmi: 0,
    diabetesPedigreeFunction: 0,
    age: 0,
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch('/api/health/diabetes-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pregnancies: 0,
      glucose: 0,
      bloodPressure: 0,
      skinThickness: 0,
      insulin: 0,
      bmi: 0,
      diabetesPedigreeFunction: 0,
      age: 0,
    });
    setPrediction(null);
    setError('');
  };

  const getRiskLevel = (prediction) => {
    if (!prediction || !prediction.risk) return 'unknown';
    return prediction.risk.toLowerCase();
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'from-red-400 to-red-500';
      case 'moderate': return 'from-yellow-400 to-yellow-500';
      case 'low': return 'from-green-400 to-green-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRiskEmoji = (risk) => {
    switch (risk) {
      case 'high': return '⚠️';
      case 'moderate': return '🟡';
      case 'low': return '✅';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-pink-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-300/20 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-100/20 to-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <section className="py-12 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex justify-center space-x-4 mb-6">
                <span className="text-4xl animate-bounce">🩸</span>
                <span className="text-4xl animate-bounce delay-100">🔬</span>
                <span className="text-4xl animate-bounce delay-200">📊</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-4">
                Diabetes Risk Assessment
              </h1>
              <p className="text-xl text-pink-600 mb-6 font-light">
                Advanced AI-powered diabetes prediction using multiple machine learning models
              </p>
              <div className="flex justify-center space-x-4 text-sm text-pink-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  77% Accuracy
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  ML-Powered
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Evidence-Based
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-pink-100/50 p-8 md:p-12">

              {/* Form Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
                  Enter Your Health Parameters
                </h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-center font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pregnancies */}
                    <div className="space-y-2">
                      <label htmlFor="pregnancies" className="text-pink-700 font-medium flex items-center">
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
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="0"
                      />
                    </div>

                    {/* Glucose */}
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
                        max="300"
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="Normal: 70-100"
                      />
                    </div>

                    {/* Blood Pressure */}
                    <div className="space-y-2">
                      <label htmlFor="bloodPressure" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">🩺</span>
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
                        placeholder="Normal: <120"
                      />
                    </div>

                    {/* Skin Thickness */}
                    <div className="space-y-2">
                      <label htmlFor="skinThickness" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">📏</span>
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
                        placeholder="Normal: 10-50"
                      />
                    </div>

                    {/* Insulin */}
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
                        placeholder="Normal: 5-30"
                      />
                    </div>

                    {/* BMI */}
                    <div className="space-y-2">
                      <label htmlFor="bmi" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">⚖️</span>
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
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="Normal: 18.5-24.9"
                      />
                    </div>

                    {/* Diabetes Pedigree Function */}
                    <div className="space-y-2">
                      <label htmlFor="diabetesPedigreeFunction" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">🧬</span>
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
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="0.0 - 3.0"
                      />
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                      <label htmlFor="age" className="text-pink-700 font-medium flex items-center">
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
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="Your age"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                        loading
                          ? 'bg-pink-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white transform hover:scale-105'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </div>
                      ) : (
                        'Get Diabetes Risk Assessment'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-8 py-4 border-2 border-pink-400 text-pink-600 hover:bg-pink-50 rounded-xl text-lg font-semibold transition-all duration-300"
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              </div>

              {/* Results Section */}
              {prediction && (
                <div className="border-t border-pink-200/50 pt-8">
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
                    Your Diabetes Risk Assessment
                  </h2>

                  <div className="bg-gradient-to-br from-white to-pink-50/50 p-8 rounded-2xl border border-pink-200/30">
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${getRiskColor(getRiskLevel(prediction))} text-white text-4xl mb-4 shadow-lg`}>
                        {getRiskEmoji(getRiskLevel(prediction))}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {prediction.risk} Risk
                      </h3>
                      <p className="text-gray-600">
                        Confidence: {prediction.confidence ? `${(prediction.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </p>
                    </div>

                    {/* Risk Interpretation */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-pink-800 mb-3">Risk Interpretation:</h4>
                      <div className={`p-4 rounded-xl ${
                        getRiskLevel(prediction) === 'low' ? 'bg-green-50 border border-green-200' :
                        getRiskLevel(prediction) === 'moderate' ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-red-50 border border-red-200'
                      }`}>
                        <p className={`font-medium ${
                          getRiskLevel(prediction) === 'low' ? 'text-green-800' :
                          getRiskLevel(prediction) === 'moderate' ? 'text-yellow-800' :
                          'text-red-800'
                        }`}>
                          {getRiskLevel(prediction) === 'low' && '✅ Low Risk: Your parameters suggest a low likelihood of diabetes. Continue maintaining healthy lifestyle habits.'}
                          {getRiskLevel(prediction) === 'moderate' && '🟡 Moderate Risk: Your parameters indicate moderate diabetes risk. Consider lifestyle modifications and regular health check-ups.'}
                          {getRiskLevel(prediction) === 'high' && '⚠️ High Risk: Your parameters suggest elevated diabetes risk. Please consult with a healthcare professional for proper evaluation.'}
                        </p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    {prediction.recommendations && prediction.recommendations.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-pink-800 mb-3">Recommendations:</h4>
                        <div className="space-y-2">
                          {prediction.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-3 bg-pink-50 p-3 rounded-lg border border-pink-200/30">
                              <span className="text-pink-500 font-bold">{index + 1}.</span>
                              <span className="text-pink-700">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Disclaimer */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-500 text-xl">ℹ️</span>
                        <div>
                          <h5 className="text-blue-800 font-semibold mb-2">Medical Disclaimer</h5>
                          <p className="text-blue-700 text-sm leading-relaxed">
                            This assessment is for informational purposes only and should not replace professional medical advice.
                            Always consult with qualified healthcare providers for medical concerns and proper diagnosis.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">Diabetes Prediction Model</h3>
              <p className="text-pink-100 text-sm leading-relaxed">
                Powered by Machine Learning algorithms including Logistic Regression, Random Forest, Gradient Boosting, and SVM.
                Model accuracy: 77% (SVM), Overall: ~75%.
              </p>
            </div>
            <button
              onClick={() => navigate('/health-predictions')}
              className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              ← Back to Health Predictions
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DiabetesPredictionPage;
