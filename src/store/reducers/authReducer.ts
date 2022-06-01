import { AuthAction, AuthState, AuthActionTypes } from '../../types/auth'


const initialState: AuthState = {
  user: null,
  isLogin: false,
  error: null
}

export const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.IS_LOGGED: {
      return {isLogin: true, error: null, user: action.payload}
    }
    case AuthActionTypes.FETCH_USER: {
      return {isLogin: true, error: null, user: action.payload}
    }
    case AuthActionTypes.FETCH_USER_ERROR: {
      return {isLogin: false, error: action.payload, user: null}
    }
    default: {
      return state
    }
  }
}
