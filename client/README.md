# Mental Wellbeing App - Frontend

## Vercel Deployment Guide

### 🚀 Frontend-Only Deployment (Demo Mode)

If you want to deploy **only the frontend** without a backend, the app will run in **demo mode** with mock data.

#### Quick Deploy (Frontend Only):
1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Set the root directory to `client/`

2. **Environment Variables**
   ```
   VITE_DEMO_MODE=true
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `your-project.vercel.app`

#### Demo Mode Features:
- ✅ **No authentication required** - automatically logged in as "Demo User"
- ✅ **Mock health predictions** - sample data for diabetes and heart disease
- ✅ **Mock journal entries** - demo content for testing
- ✅ **Basic chatbot responses** - keyword-based replies (upgrade with OpenAI API key)
- ✅ **Full UI functionality** - all pages and features work
- ✅ **Responsive design** - works on all devices

---

### 🔗 Full-Stack Deployment (with Backend)

For production deployment with real data and authentication:

### Prerequisites
- Vercel account
- Backend API deployed separately (Railway, Render, etc.)

### Environment Variables (Vercel Dashboard)
```
VITE_API_BASE_URL=https://your-backend-api-url.vercel.app/api
VITE_DEMO_MODE=false
```

### Gemini API Key (Required for Intelligent Chatbots)

#### **🤖 Google Gemini API Integration**
The app is configured to use Google Gemini API for all chatbot responses.

**API Key**: Integrated in code (`AIzaSyDNLYQsM6aTrpskeqqPF54sVY2Y-W1eLvU`)
- **Model**: `gemini-pro` (primary) and `text-bison-001` (fallback)
- **Provider**: Google AI Studio
- **Provider**: Google AI
- **Integration**: Direct API calls

**Note**: All chatbots now use Gemini API for intelligent, context-aware responses. Falls back to keyword responses if API unavailable.

### Deployment Steps

1. **Deploy Backend First**
   ```bash
   # Deploy backend to Railway/Render first
   # Get the API URL (e.g., https://your-backend.vercel.app)
   ```

2. **Deploy Frontend**
   - Import your GitHub repository to Vercel
   - Set the root directory to `client/`
   - Add environment variable: `VITE_API_BASE_URL=https://your-backend-url/api`

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 🎯 Deployment Options Summary

| Feature | Frontend Only (Demo) | Full Stack |
|---------|---------------------|------------|
| Authentication | Mock (auto-login) | Real JWT |
| Health Predictions | Sample data | Real ML models |
| Journal Storage | Local/demo data | Database |
| User Management | Single demo user | Multi-user |
| Setup Complexity | Simple (1 deploy) | Complex (2 deploys) |
| Cost | Free | Backend hosting cost |
| Use Case | Demo/Portfolio | Production app |
