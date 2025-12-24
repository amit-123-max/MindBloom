import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // In production, you might want to send this to an error reporting service
    // reportError(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border border-pink-100">
            <div className="text-6xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-pink-800 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-pink-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left bg-pink-50 p-4 rounded-lg border border-pink-200">
                <summary className="cursor-pointer font-semibold text-pink-800 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-pink-700 whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="border-2 border-pink-400 text-pink-600 hover:bg-pink-50 px-6 py-3 rounded-xl font-medium transition-all duration-300"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
