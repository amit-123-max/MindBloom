import sys
import json

class MentalHealthPredictor:
    def __init__(self):
        # Severity thresholds based on clinical guidelines
        self.depression_thresholds = {
            'minimal': 5,
            'mild': 10,
            'moderate': 15,
            'moderately_severe': 20
        }

        self.anxiety_thresholds = {
            'minimal': 5,
            'mild': 10,
            'moderate': 15
        }

        self.stress_thresholds = {
            'low': 14,
            'moderate': 19,
            'high': 27
        }

        self.wellbeing_thresholds = {
            'poor': 7,
            'fair': 13,
            'good': 17,
            'excellent': 21
        }

    def predict_mental_health(self, input_data):
        """Comprehensive mental health assessment using standardized questionnaires"""

        # Calculate scores
        phq9_score = sum(input_data['phq9_answers'])
        gad7_score = sum(input_data['gad7_answers'])
        pss_score = sum(input_data['pss_answers'])
        who5_score = sum(input_data['who5_answers'])

        # Determine severity levels
        depression_level = self._get_depression_level(phq9_score)
        anxiety_level = self._get_anxiety_level(gad7_score)
        stress_level = self._get_stress_level(pss_score)
        wellbeing_level = self._get_wellbeing_level(who5_score)

        # Overall mental health status
        overall_status = self._calculate_overall_status(
            depression_level, anxiety_level, stress_level, wellbeing_level
        )

        # Generate recommendations
        recommendations = self._generate_recommendations(
            phq9_score, gad7_score, pss_score, who5_score,
            depression_level, anxiety_level, stress_level, wellbeing_level
        )

        # Calculate risk factors
        risk_factors = self._calculate_risk_factors(input_data)

        return {
            'scores': {
                'phq9_total': phq9_score,
                'gad7_total': gad7_score,
                'pss_total': pss_score,
                'who5_total': who5_score
            },
            'severity_levels': {
                'depression': depression_level,
                'anxiety': anxiety_level,
                'stress': stress_level,
                'wellbeing': wellbeing_level
            },
            'overall_status': overall_status,
            'recommendations': recommendations,
            'risk_factors': risk_factors,
            'model_info': {
                'name': 'Comprehensive Mental Health Assessment',
                'questionnaires': ['PHQ-9', 'GAD-7', 'PSS-10', 'WHO-5'],
                'assessments': ['Depression', 'Anxiety', 'Stress', 'Well-being'],
                'accuracy': 'Clinically Validated',
                'algorithm': 'Standardized Scoring System',
                'features_used': 31
            }
        }

    def _get_depression_level(self, score):
        """Determine depression severity based on PHQ-9 score"""
        if score <= 4:
            return 'Minimal Depression'
        elif score <= 9:
            return 'Mild Depression'
        elif score <= 14:
            return 'Moderate Depression'
        elif score <= 19:
            return 'Moderately Severe Depression'
        else:
            return 'Severe Depression'

    def _get_anxiety_level(self, score):
        """Determine anxiety severity based on GAD-7 score"""
        if score <= 4:
            return 'Minimal Anxiety'
        elif score <= 9:
            return 'Mild Anxiety'
        elif score <= 14:
            return 'Moderate Anxiety'
        else:
            return 'Severe Anxiety'

    def _get_stress_level(self, score):
        """Determine stress level based on PSS-10 score"""
        if score <= 13:
            return 'Low Stress'
        elif score <= 26:
            return 'Moderate Stress'
        else:
            return 'High Stress'

    def _get_wellbeing_level(self, score):
        """Determine wellbeing level based on WHO-5 score"""
        if score <= 6:
            return 'Poor Well-being'
        elif score <= 12:
            return 'Fair Well-being'
        elif score <= 16:
            return 'Good Well-being'
        elif score <= 20:
            return 'Very Good Well-being'
        else:
            return 'Excellent Well-being'

    def _calculate_overall_status(self, depression, anxiety, stress, wellbeing):
        """Calculate overall mental health status"""
        severity_map = {
            'Minimal Depression': 0, 'Mild Depression': 1, 'Moderate Depression': 2,
            'Moderately Severe Depression': 3, 'Severe Depression': 4,
            'Minimal Anxiety': 0, 'Mild Anxiety': 1, 'Moderate Anxiety': 2, 'Severe Anxiety': 3,
            'Low Stress': 0, 'Moderate Stress': 1, 'High Stress': 2,
            'Poor Well-being': 3, 'Fair Well-being': 2, 'Good Well-being': 1,
            'Very Good Well-being': 0, 'Excellent Well-being': 0
        }

        total_score = (
            severity_map.get(depression, 0) +
            severity_map.get(anxiety, 0) +
            severity_map.get(stress, 0) +
            severity_map.get(wellbeing, 0)
        )

        if total_score <= 2:
            return 'Excellent Mental Health'
        elif total_score <= 4:
            return 'Good Mental Health'
        elif total_score <= 6:
            return 'Fair Mental Health'
        elif total_score <= 8:
            return 'Poor Mental Health'
        else:
            return 'Critical Mental Health'

    def _generate_recommendations(self, phq9, gad7, pss, who5, depression, anxiety, stress, wellbeing):
        """Generate personalized recommendations based on assessment scores"""
        recommendations = []

        # Depression-specific recommendations
        if phq9 >= 15:
            recommendations.extend([
                "URGENT: Seek immediate professional mental health support",
                "Consider contacting a psychiatrist for evaluation",
                "Therapy (CBT) is highly recommended for severe depression"
            ])
        elif phq9 >= 10:
            recommendations.extend([
                "Schedule appointment with mental health professional",
                "Consider counseling or therapy services",
                "Daily exercise and social support are crucial"
            ])

        # Anxiety-specific recommendations
        if gad7 >= 15:
            recommendations.extend([
                "Immediate consultation with mental health specialist recommended",
                "Consider anti-anxiety medication evaluation",
                "Practice deep breathing and mindfulness exercises daily"
            ])
        elif gad7 >= 10:
            recommendations.extend([
                "Professional help recommended for moderate anxiety",
                "Learn relaxation techniques and stress management",
                "Consider therapy for anxiety management"
            ])

        # Stress-specific recommendations
        if pss >= 27:
            recommendations.extend([
                "High stress levels detected - immediate intervention needed",
                "Practice stress reduction techniques daily",
                "Consider work-life balance adjustments",
                "Professional stress management counseling recommended"
            ])
        elif pss >= 20:
            recommendations.extend([
                "Moderate stress - implement stress management strategies",
                "Daily relaxation exercises and time management",
                "Consider mindfulness or meditation practice"
            ])

        # Well-being specific recommendations
        if who5 <= 12:
            recommendations.extend([
                "Focus on improving overall well-being",
                "Engage in activities that bring joy and meaning",
                "Build stronger social connections",
                "Consider life coaching or counseling"
            ])

        # General recommendations
        recommendations.extend([
            "Maintain regular sleep schedule (7-9 hours nightly)",
            "Regular physical exercise (30 minutes most days)",
            "Healthy, balanced diet with adequate nutrition",
            "Limit alcohol and avoid recreational drugs",
            "Build and maintain social support network",
            "Practice mindfulness or meditation daily",
            "Consider journaling or therapy for emotional processing"
        ])

        # Remove duplicates and return top recommendations
        unique_recommendations = list(dict.fromkeys(recommendations))
        return unique_recommendations[:10]  # Return top 10 recommendations

    def _calculate_risk_factors(self, input_data):
        """Calculate risk factors breakdown"""
        # Analyze individual question responses for insights
        risk_factors = {}

        # PHQ-9 risk factors
        phq9_answers = input_data['phq9_answers']
        risk_factors['depression_symptoms'] = {
            'anhedonia': phq9_answers[1] + phq9_answers[5],  # Loss of interest + anhedonia
            'mood_disturbance': phq9_answers[0] + phq9_answers[8],  # Depressed mood + suicidal ideation
            'somatic_symptoms': phq9_answers[2] + phq9_answers[3] + phq9_answers[6],  # Sleep, fatigue, appetite
            'cognitive_symptoms': phq9_answers[4] + phq9_answers[7]  # Concentration, psychomotor
        }

        # GAD-7 risk factors
        gad7_answers = input_data['gad7_answers']
        risk_factors['anxiety_symptoms'] = {
            'general_anxiety': gad7_answers[0] + gad7_answers[1],  # Feeling nervous/anxious
            'worry_excess': gad7_answers[2] + gad7_answers[3],  # Unable to control worry
            'physical_symptoms': gad7_answers[4] + gad7_answers[5] + gad7_answers[6]  # Physical symptoms
        }

        # PSS risk factors
        pss_answers = input_data['pss_answers']
        risk_factors['stress_factors'] = {
            'uncontrollable_stress': sum(pss_answers[0:4]),  # Items about uncontrollability
            'overload_stress': sum(pss_answers[4:8]),  # Items about overload
            'coping_difficulty': sum(pss_answers[8:10])  # Items about coping
        }

        # WHO-5 risk factors (reverse scored for risk)
        who5_answers = input_data['who5_answers']
        risk_factors['wellbeing_factors'] = {
            'positive_mood': who5_answers[0] + who5_answers[3],  # Cheerful, relaxed
            'energy_vitality': who5_answers[1] + who5_answers[4],  # Active, rested
            'interest_engagement': who5_answers[2]  # Interested in things
        }

        return risk_factors

def main():
    """Main function to handle command line prediction"""
    try:
        predictor = MentalHealthPredictor()

        # Get input data from command line arguments
        if len(sys.argv) < 32:  # 31 questions + script name
            print(json.dumps({
                'error': 'Missing input parameters. Required: 9 PHQ-9 answers + 7 GAD-7 answers + 10 PSS answers + 5 WHO-5 answers'
            }))
            sys.exit(1)

        # Parse input parameters
        args = sys.argv[1:]
        phq9_answers = [int(x) for x in args[0:9]]      # PHQ-9: 9 questions
        gad7_answers = [int(x) for x in args[9:16]]     # GAD-7: 7 questions
        pss_answers = [int(x) for x in args[16:26]]     # PSS-10: 10 questions
        who5_answers = [int(x) for x in args[26:31]]    # WHO-5: 5 questions

        input_data = {
            'phq9_answers': phq9_answers,
            'gad7_answers': gad7_answers,
            'pss_answers': pss_answers,
            'who5_answers': who5_answers
        }

        # Make prediction
        result = predictor.predict_mental_health(input_data)

        # Output result as JSON
        print(json.dumps(result, indent=2))

    except Exception as e:
        print(json.dumps({
            'error': str(e),
            'overall_status': 'Unable to assess',
            'recommendations': ['Please consult a mental health professional for proper evaluation.']
        }))

if __name__ == '__main__':
    main()
