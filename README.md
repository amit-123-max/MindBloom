# MindBloom: Your Holistic Wellness Companion

![MindBloom Logo](link-to-your-logo.png)

## Project Overview

MindBloom is a comprehensive full-stack wellness application designed to empower users on their journey to mental and physical well-being. This platform integrates various tools and resources, including AI-powered health predictions, journaling, mood tracking, community support, and personalized insights to foster a healthier and happier lifestyle.

## Features

*   **User Authentication & Authorization:** Secure user registration, login, and protected routes using JWT.
*   **Personalized Journaling:** A private space for users to record their thoughts, feelings, and experiences.
*   **Mood Tracking:** Tools to monitor and visualize mood patterns over time.
*   **AI-Powered Health Predictions:**
    *   **Diabetes Prediction:** Utilizes a machine learning model to assess diabetes risk based on user input.
    *   **Heart Disease Prediction:** Employs a machine learning model to evaluate heart disease risk.
    *   **Mental Health Assessment:** Provides insights into mental well-being through AI-driven analysis.
*   **Wellness Assessments:** Comprehensive questionnaires to gauge overall wellness and provide personalized recommendations.
*   **Community Support (e.g., LGBTCommunity, Women's Mental Health):** Dedicated sections for specific communities to share experiences and find support.
*   **Educational Content (Albums & Series):** Curated resources and learning paths on various wellness topics.
*   **Chatbot Integration:** AI-driven chatbots for general queries, student support, professional advice, and women's health guidance.
*   **Career & Confidence Tracking (for Students):** Specific tools to help students manage stress, procrastination, sleep, career planning, and confidence levels.
*   **Reproductive Health Tracking:** Features for cycle tracking and PCOS information.
*   **Responsive Design:** A seamless user experience across various devices.

## Technologies Used

### Frontend

*   **React.js:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool for modern web projects.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **React Router DOM:** For declarative routing in React applications.

### Backend

*   **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** A NoSQL document database.
*   **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
*   **JSON Web Tokens (JWT):** For secure authentication and authorization.
*   **Cloudinary:** For cloud-based image and video management (if used for albums/series).

### Machine Learning Service

*   **Python:** Programming language for the ML models.
*   **Flask (or similar micro-framework):** For exposing the ML models as an API.
*   **Scikit-learn (or similar ML libraries):** For building and deploying predictive models.

## Installation

To get MindBloom up and running on your local machine, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/MindBloom.git
cd MindBloom
```

### 2. Backend Setup

Navigate to the `backend` directory, install dependencies, and start the server:

```bash
cd backend
npm install
# Create a .env file in the backend directory with your environment variables
# Example .env content:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret
npm start
```

### 3. Frontend Setup

Open a new terminal, navigate to the `client` directory, install dependencies, and start the development server:

```bash
cd ../client
npm install
npm run dev
```

### 4. Machine Learning Service Setup

Open another new terminal, navigate to the `ml-service` directory, install Python dependencies, and run the ML service:

```bash
cd ../ml-service
pip install -r requirements.txt
python app.py
```

## Usage

Once both the frontend, backend, and ML services are running, open your web browser and navigate to `http://localhost:5173` (or the port specified by your Vite development server). You can then register a new account or log in to explore the MindBloom application.

## Screenshots

Here are some screenshots showcasing the MindBloom application. Add your images below to visually demonstrate your project's features.

### Homepage

![Homepage Screenshot](path/to/homepage-screenshot.png)

### Journaling Interface

![Journaling Screenshot](path/to/journaling-screenshot.png)

### Diabetes Prediction Tool

![Diabetes Prediction Screenshot](path/to/diabetes-prediction-screenshot.png)

### Community Page

![Community Page Screenshot](path/to/community-page-screenshot.png)

### Other Key Features

![Feature X Screenshot](path/to/feature-x-screenshot.png)

![Feature Y Screenshot](path/to/feature-y-screenshot.png)

## Contributing

We welcome contributions to MindBloom! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Contact

Your Name - [Your Email](mailto:your.email@example.com) - [Your LinkedIn](https://www.linkedin.com/in/yourprofile)
Project Link: [https://github.com/your-username/MindBloom](https://github.com/your-username/MindBloom)

