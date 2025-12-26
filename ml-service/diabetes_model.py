import sys
import json

class DiabetesPredictor:
    def __init__(self):
        # Risk factor weights based on medical research
        self.risk_weights = {
            'glucose': 0.25,      # Blood glucose level
            'bmi': 0.20,          # Body mass index
            'age': 0.15,          # Age factor
            'bloodPressure': 0.10, # Blood pressure
            'pregnancies': 0.10,  # Number of pregnancies
            'insulin': 0.08,      # Insulin level
            'skinThickness': 0.07, # Skin thickness
            'diabetesPedigreeFunction': 0.05  # Family history
        }

    def predict_diabetes(self, input_data):
        """Predict diabetes risk using weighted scoring system"""

        # Calculate risk score
        risk_score = 0.0

        # Glucose risk (normalized scale)
        glucose_score = min(max((input_data['Glucose'] - 70) / (200 - 70), 0), 1)
        risk_score += glucose_score * self.risk_weights['glucose']

        # BMI risk
        bmi_score = min(max((input_data['BMI'] - 18.5) / (40 - 18.5), 0), 1)
        risk_score += bmi_score * self.risk_weights['bmi']

        # Age risk
        age_score = min(max((input_data['Age'] - 20) / (80 - 20), 0), 1)
        risk_score += age_score * self.risk_weights['age']

        # Blood pressure risk
        bp_score = min(max((input_data['BloodPressure'] - 60) / (120 - 60), 0), 1)
        risk_score += bp_score * self.risk_weights['bloodPressure']

        # Pregnancies risk
        preg_score = min(input_data['Pregnancies'] / 10, 1)
        risk_score += preg_score * self.risk_weights['pregnancies']

        # Insulin risk
        insulin_score = min(max((input_data['Insulin'] - 15) / (300 - 15), 0), 1)
        risk_score += insulin_score * self.risk_weights['insulin']

        # Skin thickness risk
        skin_score = min(max((input_data['SkinThickness'] - 7) / (50 - 7), 0), 1)
        risk_score += skin_score * self.risk_weights['skinThickness']

        # Family history risk
        pedigree_score = min(input_data['DiabetesPedigreeFunction'], 1)
        risk_score += pedigree_score * self.risk_weights['diabetesPedigreeFunction']

        # Apply sigmoid function to get probability
        probability = 1 / (1 + 2.71828 ** (-(risk_score - 0.5) * 5))

        # Determine risk level
        if probability < 0.3:
            risk_level = 'Low'
        elif probability < 0.7:
            risk_level = 'Moderate'
        else:
            risk_level = 'High'

        # Generate recommendations
        recommendations = self.generate_recommendations(input_data, risk_level)

        return {
            'prediction': 1 if probability > 0.5 else 0,
            'probability': probability,
            'risk': risk_level,
            'confidence': probability,
            'recommendations': recommendations,
            'risk_factors': {
                'glucose_score': glucose_score,
                'bmi_score': bmi_score,
                'age_score': age_score,
                'total_risk_score': risk_score
            }
        }

    def generate_recommendations(self, input_data, risk_level):
        """Generate personalized recommendations based on input data and risk level"""
        recommendations = []

        # BMI recommendations
        if input_data['BMI'] > 30:
            recommendations.append("Consider weight management through healthy diet and regular exercise.")
        elif input_data['BMI'] > 25:
            recommendations.append("Maintain healthy weight through balanced nutrition and physical activity.")

        # Glucose recommendations
        if input_data['Glucose'] > 140:
            recommendations.append("Monitor blood glucose levels regularly and consult healthcare provider.")
        elif input_data['Glucose'] > 100:
            recommendations.append("Consider lifestyle modifications to maintain healthy glucose levels.")

        # Exercise recommendations
        if input_data['BMI'] > 25 or risk_level in ['Moderate', 'High']:
            recommendations.append("Aim for at least 150 minutes of moderate aerobic activity per week.")

        # Age-based recommendations
        if input_data['Age'] > 45:
            recommendations.append("Schedule regular health check-ups, especially for blood glucose monitoring.")

        # General recommendations
        if risk_level == 'High':
            recommendations.extend([
                "Consult with a healthcare professional for comprehensive diabetes screening.",
                "Consider lifestyle counseling and nutritional guidance.",
                "Monitor blood pressure and cholesterol levels regularly."
            ])
        elif risk_level == 'Moderate':
            recommendations.extend([
                "Adopt preventive lifestyle measures to reduce diabetes risk.",
                "Increase intake of whole foods, vegetables, and lean proteins.",
                "Stay physically active and maintain healthy sleep patterns."
            ])
        else:
            recommendations.extend([
                "Continue maintaining healthy lifestyle habits.",
                "Regular health screenings are recommended.",
                "Stay informed about diabetes prevention strategies."
            ])

        return recommendations[:5]  # Return top 5 recommendations

def main():
    """Main function to handle command line prediction"""
    try:
        # Initialize predictor
        predictor = DiabetesPredictor()

        # Get input data from command line arguments
        if len(sys.argv) < 9:
            print(json.dumps({
                'error': 'Missing input parameters. Required: pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigreeFunction, age'
            }))
            sys.exit(1)

        # Parse input parameters
        input_data = {
            'Pregnancies': float(sys.argv[1]),
            'Glucose': float(sys.argv[2]),
            'BloodPressure': float(sys.argv[3]),
            'SkinThickness': float(sys.argv[4]),
            'Insulin': float(sys.argv[5]),
            'BMI': float(sys.argv[6]),
            'DiabetesPedigreeFunction': float(sys.argv[7]),
            'Age': float(sys.argv[8])
        }

        # Make prediction
        result = predictor.predict_diabetes(input_data)

        # Output result as JSON
        print(json.dumps(result, indent=2))

    except Exception as e:
        print(json.dumps({
            'error': str(e),
            'prediction': 0,
            'probability': 0.0,
            'risk': 'Unknown',
            'recommendations': ['Please try again or consult a healthcare professional.']
        }))

if __name__ == '__main__':
    main()
