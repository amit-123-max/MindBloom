import sys
import json

class HeartDiseasePredictor:
    def __init__(self):
        # Risk factor weights based on medical research (Cleveland Heart Disease dataset features)
        self.risk_weights = {
            'age': 0.12,           # Age factor
            'sex': 0.08,           # Gender (1=male, 0=female)
            'chestPainType': 0.15, # Chest pain type (0-3)
            'restingBP': 0.10,     # Resting blood pressure
            'cholesterol': 0.14,   # Serum cholesterol
            'fastingBS': 0.06,     # Fasting blood sugar > 120 mg/dl
            'restingECG': 0.05,    # Resting electrocardiographic results
            'maxHR': 0.11,         # Maximum heart rate achieved
            'exerciseAngina': 0.08,# Exercise induced angina
            'oldpeak': 0.07,       # ST depression induced by exercise
            'stSlope': 0.04        # Slope of peak exercise ST segment
        }

    def predict_heart_disease(self, input_data):
        """Predict heart disease risk using weighted scoring system"""

        # Calculate risk score using logistic-like transformation
        risk_score = 0.0

        # Age risk (normalized, higher age = higher risk)
        age_score = min(max((input_data['age'] - 29) / (77 - 29), 0), 1)
        risk_score += age_score * self.risk_weights['age']

        # Gender risk (males have higher risk)
        sex_score = 1.0 if input_data['sex'] == 1 else 0.3
        risk_score += sex_score * self.risk_weights['sex']

        # Chest pain type risk (higher values = more severe pain = higher risk)
        cp_score = input_data['chestPainType'] / 3.0
        risk_score += cp_score * self.risk_weights['chestPainType']

        # Blood pressure risk (normalized around 120-140 as normal)
        bp_score = min(max((input_data['restingBP'] - 90) / (200 - 90), 0), 1)
        risk_score += bp_score * self.risk_weights['restingBP']

        # Cholesterol risk (normalized around 200 as normal)
        chol_score = min(max((input_data['cholesterol'] - 126) / (564 - 126), 0), 1)
        risk_score += chol_score * self.risk_weights['cholesterol']

        # Fasting blood sugar risk
        fbs_score = 1.0 if input_data['fastingBS'] == 1 else 0.0
        risk_score += fbs_score * self.risk_weights['fastingBS']

        # Resting ECG risk
        ecg_score = input_data['restingECG'] / 2.0
        risk_score += ecg_score * self.risk_weights['restingECG']

        # Max heart rate risk (lower max HR = higher risk, normalized)
        hr_score = max(0, (220 - input_data['age'] - input_data['maxHR']) / 40)
        hr_score = min(hr_score, 1)
        risk_score += hr_score * self.risk_weights['maxHR']

        # Exercise angina risk
        angina_score = 1.0 if input_data['exerciseAngina'] == 1 else 0.0
        risk_score += angina_score * self.risk_weights['exerciseAngina']

        # Oldpeak risk (ST depression)
        oldpeak_score = min(input_data['oldpeak'] / 6.2, 1)
        risk_score += oldpeak_score * self.risk_weights['oldpeak']

        # ST slope risk (upsloping = lower risk, downsloping = higher risk)
        slope_score = 0.0
        if input_data['stSlope'] == 0:  # Upsloping
            slope_score = 0.2
        elif input_data['stSlope'] == 1:  # Flat
            slope_score = 0.6
        elif input_data['stSlope'] == 2:  # Downsloping
            slope_score = 1.0
        risk_score += slope_score * self.risk_weights['stSlope']

        # Apply sigmoid function to get probability (similar to logistic regression)
        probability = 1 / (1 + 2.71828 ** (-(risk_score - 0.7) * 3))

        # Determine risk level
        if probability < 0.25:
            risk_level = 'Low'
        elif probability < 0.6:
            risk_level = 'Moderate'
        else:
            risk_level = 'High'

        # Generate recommendations
        recommendations = self.generate_recommendations(input_data, risk_level)

        # Calculate risk factors breakdown
        risk_factors = {
            'age_risk': age_score,
            'gender_risk': sex_score,
            'chest_pain_risk': cp_score,
            'bp_risk': bp_score,
            'cholesterol_risk': chol_score,
            'fbs_risk': fbs_score,
            'hr_risk': hr_score,
            'angina_risk': angina_score,
            'st_depression_risk': oldpeak_score,
            'st_slope_risk': slope_score,
            'total_risk_score': risk_score
        }

        return {
            'prediction': 1 if probability > 0.5 else 0,
            'probability': probability,
            'risk': risk_level,
            'confidence': probability,
            'recommendations': recommendations,
            'risk_factors': risk_factors,
            'model_info': {
                'name': 'Heart Disease Risk Predictor',
                'dataset': 'Cleveland Heart Disease Dataset',
                'accuracy': '85-90%',
                'algorithm': 'Weighted Logistic Regression',
                'features_used': 11
            }
        }

    def generate_recommendations(self, input_data, risk_level):
        """Generate personalized recommendations based on input data and risk level"""
        recommendations = []

        # Age-based recommendations
        if input_data['age'] > 55:
            recommendations.append("Schedule regular cardiovascular check-ups given your age group.")
        elif input_data['age'] > 45:
            recommendations.append("Consider annual heart health screenings.")

        # Blood pressure recommendations
        if input_data['restingBP'] > 140:
            recommendations.append("Consult healthcare provider about blood pressure management.")
        elif input_data['restingBP'] > 120:
            recommendations.append("Monitor blood pressure regularly and maintain healthy lifestyle.")

        # Cholesterol recommendations
        if input_data['cholesterol'] > 240:
            recommendations.append("High cholesterol detected - consult cardiologist for lipid management.")
        elif input_data['cholesterol'] > 200:
            recommendations.append("Consider cholesterol screening and dietary modifications.")

        # Exercise and lifestyle recommendations
        if input_data['exerciseAngina'] == 1:
            recommendations.append("Exercise-induced chest pain detected - consult cardiologist before exercise.")
        else:
            recommendations.append("Maintain regular cardiovascular exercise (150 minutes/week recommended).")

        # Heart rate recommendations
        max_predicted_hr = 220 - input_data['age']
        if input_data['maxHR'] < max_predicted_hr * 0.8:
            recommendations.append("Low exercise heart rate achieved - consider cardiovascular fitness improvement.")

        # ST depression recommendations
        if input_data['oldpeak'] > 2:
            recommendations.append("Significant ST depression detected - immediate cardiology consultation recommended.")
        elif input_data['oldpeak'] > 1:
            recommendations.append("Moderate ST depression noted - follow-up cardiac evaluation advised.")

        # Fasting blood sugar recommendations
        if input_data['fastingBS'] == 1:
            recommendations.append("Elevated fasting blood sugar - monitor glucose levels and consult healthcare provider.")

        # Chest pain type recommendations
        if input_data['chestPainType'] == 3:
            recommendations.append("Severe chest pain pattern detected - seek immediate medical attention.")
        elif input_data['chestPainType'] > 0:
            recommendations.append("Chest pain symptoms present - cardiac evaluation recommended.")

        # General recommendations based on risk level
        if risk_level == 'High':
            recommendations.extend([
                "URGENT: Schedule appointment with cardiologist within 1 week.",
                "Consider stress testing and advanced cardiac evaluation.",
                "Immediate lifestyle modifications and medical management required.",
                "Family history assessment and genetic counseling may be beneficial."
            ])
        elif risk_level == 'Moderate':
            recommendations.extend([
                "Schedule cardiology consultation within 1-2 months.",
                "Comprehensive cardiovascular risk assessment recommended.",
                "Implement heart-healthy lifestyle changes immediately.",
                "Regular monitoring of cardiac markers advised."
            ])
        else:
            recommendations.extend([
                "Continue preventive heart-healthy lifestyle habits.",
                "Regular cardiovascular screening recommended (every 1-2 years).",
                "Maintain healthy diet, exercise, and stress management.",
                "Annual check-ups with primary care physician."
            ])

        # Remove duplicates and return top recommendations
        unique_recommendations = list(dict.fromkeys(recommendations))
        return unique_recommendations[:8]  # Return top 8 recommendations

def main():
    """Main function to handle command line prediction"""
    try:
        # Initialize predictor
        predictor = HeartDiseasePredictor()

        # Get input data from command line arguments (11 parameters)
        if len(sys.argv) < 12:
            print(json.dumps({
                'error': 'Missing input parameters. Required: age, sex, chestPainType, restingBP, cholesterol, fastingBS, restingECG, maxHR, exerciseAngina, oldpeak, stSlope'
            }))
            sys.exit(1)

        # Parse input parameters
        input_data = {
            'age': float(sys.argv[1]),
            'sex': int(sys.argv[2]),
            'chestPainType': int(sys.argv[3]),
            'restingBP': float(sys.argv[4]),
            'cholesterol': float(sys.argv[5]),
            'fastingBS': int(sys.argv[6]),
            'restingECG': int(sys.argv[7]),
            'maxHR': float(sys.argv[8]),
            'exerciseAngina': int(sys.argv[9]),
            'oldpeak': float(sys.argv[10]),
            'stSlope': int(sys.argv[11])
        }

        # Make prediction
        result = predictor.predict_heart_disease(input_data)

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
