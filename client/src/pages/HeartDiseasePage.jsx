import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HeartDiseasePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: 0,
    sex: 0,
    chestPainType: 0,
    restingBP: 0,
    cholesterol: 0,
    fastingBS: 0,
    restingECG: 0,
    maxHR: 0,
    exerciseAngina: 0,
    oldpeak: 0.0,
    stSlope: 0,
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingReport, setSavingReport] = useState(false);
  const [reportSaved, setReportSaved] = useState(false);
  const [assessmentHistory, setAssessmentHistory] = useState([]);

  // Load assessment history on component mount
  useEffect(() => {
    loadAssessmentHistory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'oldpeak' ? parseFloat(value) : parseInt(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    // Validate all fields are filled
    const requiredFields = Object.keys(formData);
    const emptyFields = requiredFields.filter(field => !formData[field]);

    if (emptyFields.length > 0) {
      setError(`Please fill in all required fields: ${emptyFields.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/health/heart-predict', {
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
      loadAssessmentHistory(); // Load history after successful prediction
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      age: 0,
      sex: 0,
      chestPainType: 0,
      restingBP: 0,
      cholesterol: 0,
      fastingBS: 0,
      restingECG: 0,
      maxHR: 0,
      exerciseAngina: 0,
      oldpeak: 0.0,
      stSlope: 0,
    });
    setPrediction(null);
    setError('');
    setReportSaved(false);
  };

  const saveReport = async () => {
    if (!prediction || prediction.saved_to_history) return;

    setSavingReport(true);
    try {
      const response = await fetch('/api/health/heart-disease-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          ...formData,
          prediction: prediction.prediction,
          riskScore: prediction.risk_factors.total_risk_score * 100, // Assuming risk_factors.total_risk_score is a probability
          confidence: prediction.confidence,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save heart disease report');
      }

      const data = await response.json();
      setPrediction(prev => ({
        ...prev,
        saved_to_history: true,
        assessment_id: data.assessmentId
      }));
      setReportSaved(true);
      loadAssessmentHistory();
    } catch (err) {
      console.error('Save report error:', err);
      setError('Failed to save report. Please try again.');
    } finally {
      setSavingReport(false);
    }
  };

  const loadAssessmentHistory = async () => {
    try {
      const response = await fetch('/api/health/heart-disease-history', {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAssessmentHistory(data.assessments || []);
      }
    } catch (err) {
      console.error('Failed to load heart disease history:', err);
    }
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
      case 'high': return '🚨';
      case 'moderate': return '⚠️';
      case 'low': return '✅';
      default: return '❓';
    }
  };

  const getRiskFactorsBreakdown = (riskFactors) => {
    if (!riskFactors) return null;

    const factors = [
      { name: 'Age Factor', value: riskFactors.age_risk, icon: '🎂' },
      { name: 'Gender Factor', value: riskFactors.gender_risk, icon: '⚤' },
      { name: 'Chest Pain', value: riskFactors.chest_pain_risk, icon: '💔' },
      { name: 'Blood Pressure', value: riskFactors.bp_risk, icon: '🩸' },
      { name: 'Cholesterol', value: riskFactors.cholesterol_risk, icon: '🥑' },
      { name: 'Blood Sugar', value: riskFactors.fbs_risk, icon: '🍯' },
      { name: 'Heart Rate', value: riskFactors.hr_risk, icon: '❤️' },
      { name: 'Exercise Angina', value: riskFactors.angina_risk, icon: '🏃' },
      { name: 'ST Depression', value: riskFactors.st_depression_risk, icon: '📉' },
      { name: 'ST Slope', value: riskFactors.st_slope_risk, icon: '📈' },
    ];

    return factors;
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
                <span className="text-4xl animate-bounce">❤️</span>
                <span className="text-4xl animate-bounce delay-100">🔬</span>
                <span className="text-4xl animate-bounce delay-200">📊</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-4">
                Heart Disease Risk Assessment
              </h1>
              <p className="text-xl text-pink-600 mb-6 font-light">
                Advanced AI-powered cardiovascular risk evaluation using Cleveland Heart Disease Dataset
              </p>
              <div className="flex justify-center space-x-4 text-sm text-pink-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  85-90% Accuracy
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  11 Medical Parameters
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
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-pink-100/50 p-8 md:p-12">

              {/* Form Section */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-6 text-center">
                  Enter Your Cardiovascular Health Parameters
                </h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-center font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        min="20"
                        max="100"
                        required
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="29-77"
                      />
                    </div>

                    {/* Sex */}
                    <div className="space-y-2">
                      <label htmlFor="sex" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">⚤</span>
                        Gender
                      </label>
                      <select
                        id="sex"
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value="">Select Gender</option>
                        <option value="0">Female</option>
                        <option value="1">Male</option>
                      </select>
                    </div>

                    {/* Chest Pain Type */}
                    <div className="space-y-2">
                      <label htmlFor="chestPainType" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">💔</span>
                        Chest Pain Type
                      </label>
                      <select
                        id="chestPainType"
                        name="chestPainType"
                        value={formData.chestPainType}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value="">Select Pain Type</option>
                        <option value="0">Typical Angina</option>
                        <option value="1">Atypical Angina</option>
                        <option value="2">Non-anginal Pain</option>
                        <option value="3">Asymptomatic</option>
                      </select>
                    </div>

                    {/* Resting Blood Pressure */}
                    <div className="space-y-2">
                      <label htmlFor="restingBP" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">🩸</span>
                        Resting BP (mmHg)
                      </label>
                      <input
                        type="number"
                        id="restingBP"
                        name="restingBP"
                        value={formData.restingBP}
                        onChange={handleChange}
                        min="80"
                        max="200"
                        required
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="90-200"
                      />
                    </div>

                    {/* Cholesterol */}
                    <div className="space-y-2">
                      <label htmlFor="cholesterol" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">🥑</span>
                        Cholesterol (mg/dL)
                      </label>
                      <input
                        type="number"
                        id="cholesterol"
                        name="cholesterol"
                        value={formData.cholesterol}
                        onChange={handleChange}
                        min="126"
                        max="600"
                        required
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="126-564"
                      />
                    </div>

                    {/* Fasting Blood Sugar */}
                    <div className="space-y-2">
                      <label htmlFor="fastingBS" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">🍯</span>
                        Fasting BS &gt; 120 mg/dL
                      </label>
                      <select
                        id="fastingBS"
                        name="fastingBS"
                        value={formData.fastingBS}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value="">Select</option>
                        <option value="0">No (&gt;120)</option>
                        <option value="1">Yes (≤120)</option>
                      </select>
                    </div>

                    {/* Resting ECG */}
                    <div className="space-y-2">
                      <label htmlFor="restingECG" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">📊</span>
                        Resting ECG Results
                      </label>
                      <select
                        id="restingECG"
                        name="restingECG"
                        value={formData.restingECG}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value="">Select Result</option>
                        <option value="0">Normal</option>
                        <option value="1">ST-T Wave Abnormality</option>
                        <option value="2">Left Ventricular Hypertrophy</option>
                      </select>
                    </div>

                    {/* Max Heart Rate */}
                    <div className="space-y-2">
                      <label htmlFor="maxHR" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">❤️</span>
                        Max Heart Rate (bpm)
                      </label>
                      <input
                        type="number"
                        id="maxHR"
                        name="maxHR"
                        value={formData.maxHR}
                        onChange={handleChange}
                        min="60"
                        max="220"
                        required
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="60-220"
                      />
                    </div>

                    {/* Exercise Angina */}
                    <div className="space-y-2">
                      <label htmlFor="exerciseAngina" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">🏃</span>
                        Exercise Angina
                      </label>
                      <select
                        id="exerciseAngina"
                        name="exerciseAngina"
                        value={formData.exerciseAngina}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value="">Select</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    </div>

                    {/* Oldpeak */}
                    <div className="space-y-2">
                      <label htmlFor="oldpeak" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">📉</span>
                        ST Depression (mm)
                      </label>
                      <input
                        type="number"
                        id="oldpeak"
                        name="oldpeak"
                        value={formData.oldpeak}
                        onChange={handleChange}
                        min="0"
                        max="7"
                        step="0.1"
                        required
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                        placeholder="0.0-6.2"
                      />
                    </div>

                    {/* ST Slope */}
                    <div className="space-y-2">
                      <label htmlFor="stSlope" className="text-pink-700 font-medium flex items-center">
                        <span className="text-lg mr-2">📈</span>
                        ST Slope
                      </label>
                      <select
                        id="stSlope"
                        name="stSlope"
                        value={formData.stSlope}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border-2 border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
                      >
                        <option value="">Select Slope</option>
                        <option value="0">Upsloping</option>
                        <option value="1">Flat</option>
                        <option value="2">Downsloping</option>
                      </select>
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
                          Analyzing Heart Health...
                        </div>
                      ) : (
                        'Get Heart Disease Risk Assessment'
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
                    Your Cardiovascular Risk Assessment
                  </h2>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Main Risk Assessment Card */}
                    <div className="bg-gradient-to-br from-white to-pink-50/50 p-8 rounded-2xl border border-pink-200/30">
                      <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getRiskColor(getRiskLevel(prediction))} text-white text-6xl mb-4 shadow-2xl`}>
                          {getRiskEmoji(getRiskLevel(prediction))}
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">
                          {prediction.risk} Risk
                        </h3>
                        <p className="text-gray-600 text-lg">
                          Confidence: {(prediction.confidence * 100).toFixed(1)}%
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
                          <p className={`font-medium text-lg ${
                            getRiskLevel(prediction) === 'low' ? 'text-green-800' :
                            getRiskLevel(prediction) === 'moderate' ? 'text-yellow-800' :
                            'text-red-800'
                          }`}>
                            {getRiskLevel(prediction) === 'low' && '✅ Low Risk: Your cardiovascular parameters suggest a low likelihood of heart disease. Continue maintaining healthy lifestyle habits.'}
                            {getRiskLevel(prediction) === 'moderate' && '⚠️ Moderate Risk: Your parameters indicate moderate cardiovascular risk. Consider lifestyle modifications and regular health monitoring.'}
                            {getRiskLevel(prediction) === 'high' && '🚨 High Risk: Your parameters suggest elevated cardiovascular risk. Immediate consultation with a cardiologist is strongly recommended.'}
                          </p>
                        </div>
                      </div>

                      {/* Model Information */}
                      {prediction.model_info && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <h4 className="text-lg font-semibold text-blue-800 mb-3">Model Information:</h4>
                          <div className="space-y-2 text-sm text-blue-700">
                            <p><strong>Model:</strong> {prediction.model_info.name}</p>
                            <p><strong>Dataset:</strong> {prediction.model_info.dataset}</p>
                            <p><strong>Accuracy:</strong> {prediction.model_info.accuracy}</p>
                            <p><strong>Algorithm:</strong> {prediction.model_info.algorithm}</p>
                            <p><strong>Features:</strong> {prediction.model_info.features_used}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Detailed Risk Factors */}
                    <div className="space-y-6">
                      <div className="bg-white/80 p-6 rounded-2xl border border-pink-200/30">
                        <h4 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
                          <span className="text-xl mr-2">📊</span>
                          Risk Factor Analysis
                        </h4>
                        <div className="space-y-3">
                          {getRiskFactorsBreakdown(prediction.risk_factors)?.map((factor, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200/30">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{factor.icon}</span>
                                <span className="text-pink-700 font-medium">{factor.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-pink-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(factor.value * 100, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-pink-600 font-bold w-12 text-right">
                                  {(factor.value * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      {prediction.recommendations && prediction.recommendations.length > 0 && (
                        <div className="bg-white/80 p-6 rounded-2xl border border-pink-200/30">
                          <h4 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
                            <span className="text-xl mr-2">💡</span>
                            Personalized Recommendations
                          </h4>
                          <div className="space-y-3">
                            {prediction.recommendations.slice(0, 6).map((rec, index) => (
                              <div key={index} className="flex items-start space-x-3 bg-pink-50 p-4 rounded-xl border border-pink-200/30">
                                <span className="text-pink-500 font-bold text-lg mt-1">{index + 1}.</span>
                                <span className="text-pink-700 leading-relaxed">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Report Button */}
                  <div className="mt-8 text-center">
                    {!prediction.saved_to_history && !reportSaved && (
                      <button
                        onClick={saveReport}
                        disabled={savingReport}
                        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                            <p className="text-green-700 text-sm">Your heart disease assessment has been saved to your history.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {prediction.saved_to_history && (
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
                  <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <span className="text-red-500 text-2xl">⚠️</span>
                      <div>
                        <h5 className="text-red-800 font-semibold mb-2">Critical Medical Disclaimer</h5>
                        <p className="text-red-700 text-sm leading-relaxed">
                          This assessment is for informational and educational purposes only and should NOT replace professional medical advice,
                          diagnosis, or treatment. Always consult with qualified healthcare providers, particularly cardiologists, for any
                          cardiovascular concerns. Early detection and proper medical care are crucial for heart health.
                        </p>
                        <p className="text-red-600 text-sm mt-2 font-medium">
                          If you experience chest pain, shortness of breath, or other cardiac symptoms, seek immediate medical attention.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Assessment History Section */}
        {assessmentHistory.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-4">
                  Your Heart Health History
                </h2>
                <p className="text-pink-600 text-lg font-light">
                  Track your cardiovascular health assessments over time
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessmentHistory.map((assessment, index) => (
                  <div
                    key={assessment.id || index}
                    className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-pink-100/50 p-6 transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">❤️</span>
                        <span className="text-pink-600 font-medium text-sm">
                          {new Date(assessment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium">
                        #{assessmentHistory.length - index}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                        <span className="text-blue-700 font-medium">Risk Level</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-blue-800">{assessment.risk}</span>
                          <span className="text-2xl">{getRiskEmoji(assessment.risk.toLowerCase())}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200/50">
                        <span className="text-green-700 font-medium">Confidence</span>
                        <span className="font-bold text-green-800">{(assessment.probability * 100).toFixed(1)}%</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-pink-50 p-2 rounded border border-pink-200/30">
                          <div className="text-pink-700 font-medium">Age</div>
                          <div className="font-bold text-pink-800">{assessment.inputs?.age || 'N/A'}</div>
                        </div>
                        <div className="bg-pink-50 p-2 rounded border border-pink-200/30">
                          <div className="text-pink-700 font-medium">BP</div>
                          <div className="font-bold text-pink-800">{assessment.inputs?.restingBP || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {assessmentHistory.length > 0 && (
                <div className="text-center mt-12">
                  <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-pink-200/50">
                    <span className="text-pink-600 font-medium">
                      {assessmentHistory.length} assessment{assessmentHistory.length !== 1 ? 's' : ''} saved
                    </span>
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">Heart Disease Risk Predictor</h3>
              <p className="text-pink-100 text-sm leading-relaxed">
                Based on Cleveland Heart Disease Dataset with 85-90% accuracy. Using 11 clinical parameters for comprehensive cardiovascular assessment.
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

export default HeartDiseasePage;
