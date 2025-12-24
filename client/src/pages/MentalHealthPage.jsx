import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MentalHealthPage = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    phq9_answers: Array(9).fill(0),
    gad7_answers: Array(7).fill(0),
    pss_answers: Array(10).fill(0),
    who5_answers: Array(5).fill(0)
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  const sections = [
    {
      title: 'Depression Assessment',
      subtitle: 'Patient Health Questionnaire (PHQ-9)',
      description: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
      questions: [
        'Little interest or pleasure in doing things',
        'Feeling down, depressed, or hopeless',
        'Trouble falling or staying asleep, or sleeping too much',
        'Feeling tired or having little energy',
        'Poor appetite or overeating',
        'Feeling bad about yourself or that you are a failure or have let yourself or your family down',
        'Trouble concentrating on things, such as reading the newspaper or watching television',
        'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
        'Thoughts that you would be better off dead, or of hurting yourself'
      ],
      field: 'phq9_answers',
      scale: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    {
      title: 'Anxiety Assessment',
      subtitle: 'Generalized Anxiety Disorder (GAD-7)',
      description: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
      questions: [
        'Feeling nervous, anxious, or on edge',
        'Not being able to stop or control worrying',
        'Worrying too much about different things',
        'Trouble relaxing',
        'Being so restless that it is hard to sit still',
        'Becoming easily annoyed or irritable',
        'Feeling afraid as if something awful might happen'
      ],
      field: 'gad7_answers',
      scale: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    {
      title: 'Stress Assessment',
      subtitle: 'Perceived Stress Scale (PSS-10)',
      description: 'In the last month, how often have you felt or thought a certain way?',
      questions: [
        'In the last month, how often have you been upset because of something that happened unexpectedly?',
        'In the last month, how often have you felt that you were unable to control the important things in your life?',
        'In the last month, how often have you felt nervous and "stressed"?',
        'In the last month, how often have you felt confident about your ability to handle your personal problems?',
        'In the last month, how often have you felt that things were going your way?',
        'In the last month, how often have you found that you could not cope with all the things that you had to do?',
        'In the last month, how often have you been able to control irritations in your life?',
        'In the last month, how often have you felt that you were on top of things?',
        'In the last month, how often have you been angered because of things that happened that were outside of your control?',
        'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?'
      ],
      field: 'pss_answers',
      scale: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often']
    },
    {
      title: 'Well-being Assessment',
      subtitle: 'World Health Organization Well-Being Index (WHO-5)',
      description: 'Please indicate for each of the 5 statements which is closest to how you have been feeling over the last two weeks.',
      questions: [
        'I have felt cheerful and in good spirits',
        'I have felt calm and relaxed',
        'I have felt active and vigorous',
        'I woke up feeling fresh and rested',
        'My daily life has been filled with things that interest me'
      ],
      field: 'who5_answers',
      scale: ['At no time', 'Some of the time', 'Less than half of the time', 'More than half of the time', 'Most of the time', 'All of the time']
    }
  ];

  const handleAnswerChange = (sectionIndex, questionIndex, value) => {
    const section = sections[sectionIndex];
    const newAnswers = [...formData[section.field]];
    newAnswers[questionIndex] = parseInt(value);

    setFormData({
      ...formData,
      [section.field]: newAnswers
    });
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch('/api/health/mental-health-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get mental health assessment');
      }

      const data = await response.json();
      setPrediction(data);
      loadAssessmentHistory(); // Reload history after new assessment
    } catch (err) {
      console.error('Mental health assessment error:', err);
      setError('Failed to get mental health assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      phq9_answers: Array(9).fill(0),
      gad7_answers: Array(7).fill(0),
      pss_answers: Array(10).fill(0),
      who5_answers: Array(5).fill(0)
    });
    setCurrentSection(0);
    setPrediction(null);
    setError('');
  };

  const getSeverityColor = (level) => {
    if (level.includes('Minimal') || level.includes('Low') || level.includes('Poor')) {
      return 'from-green-400 to-green-500';
    } else if (level.includes('Mild') || level.includes('Moderate') || level.includes('Fair')) {
      return 'from-yellow-400 to-yellow-500';
    } else if (level.includes('Severe') || level.includes('High') || level.includes('Critical')) {
      return 'from-red-400 to-red-500';
    }
    return 'from-blue-400 to-blue-500';
  };

  const getSeverityEmoji = (level) => {
    if (level.includes('Minimal') || level.includes('Low') || level.includes('Poor')) {
      return '😊';
    } else if (level.includes('Mild') || level.includes('Moderate') || level.includes('Fair')) {
      return '😐';
    } else if (level.includes('Severe') || level.includes('High') || level.includes('Critical')) {
      return '😟';
    }
    return '🤔';
  };

  const renderFormSection = (section, sectionIndex) => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-2">
            {section.title}
          </h3>
          <p className="text-pink-600 font-medium mb-2">{section.subtitle}</p>
          <p className="text-pink-700 text-sm max-w-2xl mx-auto">{section.description}</p>
        </div>

        <div className="space-y-6">
          {section.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="bg-white/70 p-6 rounded-xl border border-pink-200/30">
              <label className="text-pink-800 font-medium mb-4 block">
                {questionIndex + 1}. {question}
              </label>
              <select
                value={formData[section.field][questionIndex]}
                onChange={(e) => handleAnswerChange(sectionIndex, questionIndex, e.target.value)}
                className="w-full p-3 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 bg-white/70"
              >
                {section.scale.map((option, optionIndex) => (
                  <option key={optionIndex} value={optionIndex}>
                    {optionIndex} - {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevSection}
            disabled={sectionIndex === 0}
            className="px-6 py-3 bg-pink-100 text-pink-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-200 transition-all duration-200"
          >
            ← Previous
          </button>

          {sectionIndex < sections.length - 1 ? (
            <button
              type="button"
              onClick={nextSection}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-pink-700 transition-all duration-200"
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Get Assessment'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!prediction) return null;

    const { scores, severity_levels, overall_status, recommendations, risk_factors, model_info, disclaimer } = prediction;

    return (
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-pink-100/50 p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="flex justify-center space-x-4 mb-6">
            <span className="text-4xl animate-bounce">🧠</span>
            <span className="text-4xl animate-bounce delay-100">💭</span>
            <span className="text-4xl animate-bounce delay-200">🌟</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Mental Health Assessment
          </h3>
          <p className="text-pink-600 text-lg font-light">
            Comprehensive analysis based on standardized mental health questionnaires
          </p>
        </div>

        {/* Overall Status */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getSeverityColor(overall_status)} text-white text-6xl mb-4 shadow-2xl`}>
            {getSeverityEmoji(overall_status)}
          </div>
          <h4 className="text-3xl font-bold text-gray-800 mb-2">{overall_status}</h4>
          <p className="text-gray-600 text-lg">Overall Mental Health Status</p>
        </div>

        {/* Severity Levels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {Object.entries(severity_levels).map(([key, value]) => (
            <div key={key} className={`bg-gradient-to-br ${getSeverityColor(value)} p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-lg font-bold capitalize">{key.replace('_', ' ')}</h5>
                <span className="text-2xl">{getSeverityEmoji(value)}</span>
              </div>
              <div className="text-2xl font-bold mb-1">{value}</div>
              <div className="text-white/90 text-sm">
                {value.includes('Minimal') || value.includes('Low') ? 'Good range' :
                 value.includes('Mild') || value.includes('Moderate') ? 'Monitor closely' :
                 'Seek professional help'}
              </div>
            </div>
          ))}
        </div>

        {/* Scores Breakdown */}
        <div className="bg-gradient-to-r from-pink-50 to-pink-100/50 p-6 rounded-2xl border border-pink-200/30 mb-8">
          <h4 className="text-xl font-semibold text-pink-800 mb-4 flex items-center">
            <span className="text-2xl mr-3">📊</span>
            Assessment Scores
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(scores).map(([key, value]) => (
              <div key={key} className="bg-white/80 p-4 rounded-lg border border-pink-200/30">
                <div className="text-pink-700 font-medium text-sm uppercase tracking-wide">
                  {key.replace('_total', '').toUpperCase()}
                </div>
                <div className="text-2xl font-bold text-pink-800">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="bg-gradient-to-r from-pink-50 to-pink-100/50 p-6 rounded-2xl border border-pink-200/30 mb-8">
            <h4 className="text-xl font-semibold text-pink-800 mb-4 flex items-center">
              <span className="text-2xl mr-3">💡</span>
              Personalized Recommendations
            </h4>
            <div className="grid gap-3">
              {recommendations.slice(0, 8).map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 bg-white/70 p-4 rounded-xl border border-pink-200/30">
                  <span className="text-pink-500 font-bold text-lg mt-1">{index + 1}.</span>
                  <span className="text-pink-700 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {disclaimer && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-xl">ℹ️</span>
              <div>
                <h5 className="text-blue-800 font-semibold mb-2">Important Medical Disclaimer</h5>
                <p className="text-blue-700 text-sm leading-relaxed">{disclaimer}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
                <span className="text-4xl animate-bounce">🧠</span>
                <span className="text-4xl animate-bounce delay-100">💭</span>
                <span className="text-4xl animate-bounce delay-200">🌟</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-4">
                Mental Health Assessment
              </h1>
              <p className="text-xl text-pink-600 mb-6 font-light">
                Comprehensive evaluation using clinically validated questionnaires for depression, anxiety, stress, and well-being
              </p>
              <div className="flex justify-center space-x-4 text-sm text-pink-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  PHQ-9, GAD-7, PSS-10, WHO-5
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  31 Clinical Questions
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Evidence-Based Results
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Indicator */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center space-x-4 mb-8">
              {sections.map((section, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index <= currentSection
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                      : 'bg-pink-100 text-pink-400'
                  }`}>
                    {index + 1}
                  </div>
                  {index < sections.length - 1 && (
                    <div className={`w-16 h-1 ${
                      index < currentSection ? 'bg-pink-500' : 'bg-pink-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-pink-800 mb-2">
                {sections[currentSection].title}
              </h2>
              <p className="text-pink-600">{sections[currentSection].subtitle}</p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-pink-100/50 p-8 md:p-12">

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-center font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {renderFormSection(sections[currentSection], currentSection)}
              </form>

              {loading && (
                <div className="mt-8 p-6 bg-pink-50 border border-pink-200 rounded-xl">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
                    <p className="text-pink-700 font-medium text-lg">Analyzing your mental health responses...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results Section */}
        {prediction && (
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              {renderResults()}
            </div>
          </section>
        )}


        {/* Footer */}
        <footer className="bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 text-white py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">Mental Health Assessment</h3>
              <p className="text-pink-100 text-sm leading-relaxed">
                Based on clinically validated questionnaires: PHQ-9, GAD-7, PSS-10, and WHO-5.
                Comprehensive mental health evaluation for depression, anxiety, stress, and well-being assessment.
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

export default MentalHealthPage;
