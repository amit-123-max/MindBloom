from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import joblib
import os

app = Flask(__name__)
CORS(app)

# Global variables for models
models = {}
scaler = None
FEATURES = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']

def create_sample_data():
    """Create sample diabetes dataset for training models"""
    np.random.seed(42)

    # Generate sample data similar to Pima Indians Diabetes dataset
    n_samples = 1000

    data = {
        'Pregnancies': np.random.randint(0, 17, n_samples),
        'Glucose': np.random.normal(120, 30, n_samples).clip(0, 200),
        'BloodPressure': np.random.normal(70, 15, n_samples).clip(0, 122),
        'SkinThickness': np.random.normal(20, 15, n_samples).clip(0, 99),
        'Insulin': np.random.normal(80, 115, n_samples).clip(0, 846),
        'BMI': np.random.normal(32, 8, n_samples).clip(0, 67),
        'DiabetesPedigreeFunction': np.random.exponential(0.5, n_samples).clip(0.078, 2.42),
        'Age': np.random.normal(33, 12, n_samples).clip(21, 81)
    }

    df = pd.DataFrame(data)

    # Create target based on risk factors
    risk_score = (
        (df['Glucose'] > 140).astype(int) * 0.25 +
        (df['BMI'] > 30).astype(int) * 0.2 +
        (df['Age'] > 45).astype(int) * 0.2 +
        (df['BloodPressure'] > 90).astype(int) * 0.15 +
        (df['Pregnancies'] > 5).astype(int) * 0.1 +
        (df['Insulin'] > 150).astype(int) * 0.1
    )

    df['Outcome'] = (risk_score > 0.4).astype(int)

    return df

def train_models():
    """Train multiple ML models for diabetes prediction"""
    global models, scaler

    print("Training diabetes prediction models...")

    # Create sample dataset
    df = create_sample_data()

    X = df[FEATURES]
    y = df['Outcome']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train models
    models['logistic_regression'] = LogisticRegression(random_state=42)
    models['random_forest'] = RandomForestClassifier(n_estimators=100, random_state=42)
    models['gradient_boosting'] = GradientBoostingClassifier(random_state=42)
    models['svm'] = SVC(probability=True, random_state=42)

    accuracies = {}

    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        accuracies[name] = accuracy
        print(".3f")

    # Save models
    os.makedirs('models', exist_ok=True)
    joblib.dump(models, 'models/diabetes_models.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')

    print("Models trained and saved successfully!")
    return accuracies

def load_models():
    """Load trained models from disk"""
    global models, scaler

    try:
        models = joblib.load('models/diabetes_models.pkl')
        scaler = joblib.load('models/scaler.pkl')
        print("Models loaded successfully!")
        return True
    except:
        print("Models not found, training new models...")
        train_models()
        return True

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': len(models) > 0,
        'scaler_loaded': scaler is not None
    })

@app.route('/predict', methods=['POST'])
def predict_diabetes():
    """Predict diabetes risk using multiple ML models"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract features
        features = {}
        for feature in FEATURES:
            if feature not in data:
                return jsonify({'error': f'Missing required feature: {feature}'}), 400
            features[feature] = float(data[feature])

        # Convert to array
        input_data = np.array([[features[feature] for feature in FEATURES]])

        # Scale features
        input_scaled = scaler.transform(input_data)

        # Get predictions from all models
        predictions = {}
        probabilities = {}

        for name, model in models.items():
            pred = model.predict(input_scaled)[0]
            prob = model.predict_proba(input_scaled)[0]

            predictions[name] = int(pred)
            probabilities[name] = {
                'no_diabetes': float(prob[0]),
                'diabetes': float(prob[1])
            }

        # Ensemble prediction (majority vote)
        ensemble_pred = 1 if sum(predictions.values()) >= len(models) / 2 else 0

        # Calculate risk level
        avg_probability = np.mean([prob['diabetes'] for prob in probabilities.values()])

        if avg_probability > 0.7:
            risk_level = 'High Risk'
        elif avg_probability > 0.4:
            risk_level = 'Moderate Risk'
        else:
            risk_level = 'Low Risk'

        # Generate recommendations
        recommendations = generate_recommendations(features, risk_level)

        response = {
            'predictions': predictions,
            'probabilities': probabilities,
            'ensemble_prediction': ensemble_pred,
            'risk_level': risk_level,
            'risk_score': round(avg_probability * 100, 1),
            'confidence': calculate_confidence(predictions),
            'recommendations': recommendations,
            'disclaimer': 'This assessment is not a medical diagnosis. It is intended for awareness and self-reflection only. Always consult a healthcare professional for medical concerns.'
        }

        return jsonify(response)

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

def generate_recommendations(features, risk_level):
    """Generate personalized recommendations based on input features and risk level"""
    recommendations = []

    if risk_level == 'High Risk':
        recommendations.append('Consult a healthcare professional immediately for comprehensive diabetes screening')
        recommendations.append('Consider lifestyle modifications and regular blood sugar monitoring')
    elif risk_level == 'Moderate Risk':
        recommendations.append('Schedule regular health check-ups and blood glucose testing')
        recommendations.append('Focus on healthy eating and regular physical activity')

    # Feature-specific recommendations
    if features['Glucose'] > 140:
        recommendations.append('Monitor blood glucose levels regularly and maintain a balanced diet')

    if features['BMI'] > 30:
        recommendations.append('Focus on achieving and maintaining a healthy weight through diet and exercise')

    if features['BloodPressure'] > 90:
        recommendations.append('Monitor blood pressure regularly and consider cardiovascular health')

    if features['Age'] > 45:
        recommendations.append('Age is a risk factor - regular health screenings are recommended')

    if len(recommendations) == 0:
        recommendations.append('Maintain healthy lifestyle habits with balanced diet and regular exercise')
        recommendations.append('Continue regular health check-ups as recommended by your healthcare provider')

    return recommendations[:4]  # Limit to top 4 recommendations

def calculate_confidence(predictions):
    """Calculate confidence score based on model agreement"""
    values = list(predictions.values())
    agreement = sum(values) / len(values)

    # If all models agree, high confidence
    if agreement == 0 or agreement == 1:
        return 95
    # If majority agree, medium confidence
    elif agreement >= 0.75 or agreement <= 0.25:
        return 85
    # If models disagree, lower confidence
    else:
        return 75

@app.route('/train', methods=['POST'])
def retrain_models():
    """Retrain models with new parameters (admin endpoint)"""
    try:
        accuracies = train_models()
        return jsonify({
            'message': 'Models retrained successfully',
            'accuracies': accuracies
        })
    except Exception as e:
        return jsonify({'error': f'Retraining failed: {str(e)}'}), 500

if __name__ == '__main__':
    # Load or train models on startup
    load_models()

    print("Diabetes Prediction ML Service starting...")
    print(f"Available models: {list(models.keys())}")
    app.run(host='0.0.0.0', port=5002, debug=True)
