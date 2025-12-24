const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      }
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        user: {
          username: action.payload.username,
          email: action.payload.email,
          profileImage: action.payload.profileImage
        },
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case 'REGISTER_FAIL':
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token')
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload,
      }
    default:
      return state
  }
}

export default authReducer
