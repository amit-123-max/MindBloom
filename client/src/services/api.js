// API Service - Centralized API configuration and calls
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Helper method to get auth token
  getAuthToken() {
    return localStorage.getItem('token')
  }

  // Helper method to create headers
  getHeaders(includeAuth = true, additionalHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    }

    if (includeAuth && this.getAuthToken()) {
      headers['x-auth-token'] = this.getAuthToken()
    }

    return headers
  }

  // Generic fetch wrapper with error handling
  async request(endpoint, options = {}) {
    // Demo mode: return mock data
    if (DEMO_MODE) {
      return this.getMockResponse(endpoint, options)
    }

    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
        ...options
      })

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.msg || errorData.message || errorMessage
        } catch (e) {
          // If we can't parse JSON, use the default error message
        }
        throw new Error(errorMessage)
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return response
      }
    } catch (error) {
      // Log error in development only
      if (import.meta.env.DEV) {
        console.error('API Request failed:', error)
      }
      throw error
    }
  }

  // Mock responses for demo mode
  getMockResponse(endpoint, options = {}) {
    const method = options.method || 'GET'

    // Mock auth responses
    if (endpoint === '/auth/login' && method === 'POST') {
      return Promise.resolve({
        token: 'demo-token-12345',
        user: { username: 'Demo User', email: 'demo@example.com' }
      })
    }

    if (endpoint === '/auth/register' && method === 'POST') {
      return Promise.resolve({
        token: 'demo-token-12345',
        user: { username: 'Demo User', email: 'demo@example.com' }
      })
    }

    if (endpoint === '/auth/me') {
      return Promise.resolve({
        username: 'Demo User',
        email: 'demo@example.com'
      })
    }

    // Mock journal responses
    if (endpoint === '/journals' && method === 'GET') {
      return Promise.resolve([
        {
          _id: '1',
          title: 'Demo Journal Entry',
          content: 'This is a demo journal entry for demonstration purposes.',
          mood: 'happy',
          createdAt: new Date().toISOString()
        }
      ])
    }

    if (endpoint.startsWith('/journals/') && method === 'GET') {
      return Promise.resolve({
        _id: '1',
        title: 'Demo Journal Entry',
        content: 'This is a demo journal entry for demonstration purposes.',
        mood: 'happy',
        createdAt: new Date().toISOString()
      })
    }

    // Mock health prediction responses
    if (endpoint === '/health/heart-predict' && method === 'POST') {
      return Promise.resolve({
        prediction: 0,
        probability: 0.25,
        risk: 'Low Risk',
        confidence: 0.85,
        recommendations: ['Maintain healthy lifestyle', 'Regular exercise', 'Balanced diet'],
        disclaimer: 'This is demo data. Consult healthcare professionals for real assessments.'
      })
    }

    if (endpoint === '/health/diabetes-predict' && method === 'POST') {
      return Promise.resolve({
        prediction: 0,
        probability: 0.20,
        risk: 'Low Risk',
        confidence: 0.80,
        recommendations: ['Continue healthy habits', 'Monitor blood sugar regularly'],
        disclaimer: 'This is demo data. Consult healthcare professionals for real assessments.'
      })
    }

    // Default mock response
    return Promise.resolve({
      message: 'Demo mode - feature available with full backend',
      status: 'success'
    })
  }

  // Journal endpoints
  async getJournals() {
    return this.request('/journals')
  }

  async getJournal(id) {
    return this.request(`/journals/${id}`)
  }

  async createJournal(journalData) {
    return this.request('/journals', {
      method: 'POST',
      body: JSON.stringify(journalData)
    })
  }

  async updateJournal(id, journalData) {
    return this.request(`/journals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(journalData)
    })
  }

  async deleteJournal(id) {
    return this.request(`/journals/${id}`, {
      method: 'DELETE'
    })
  }

  // Health endpoints
  async predictHeartDisease(data) {
    return this.request('/health/heart-predict', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getHeartDiseaseHistory() {
    return this.request('/health/heart-disease-history')
  }

  async predictDiabetes(data) {
    return this.request('/health/diabetes-predict', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getDiabetesHistory() {
    return this.request('/health/diabetes-history')
  }

  async predictMentalHealth(data) {
    return this.request('/health/mental-health-predict', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getMentalHealthHistory() {
    return this.request('/health/mental-health-history')
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  // Generic POST method
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
