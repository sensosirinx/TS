import { Dispatch } from 'redux'
import { AuthAction, AuthActionTypes } from '../../types/auth'
import { UserFields } from '../../types/user'
import axios from 'axios'
import config from '../../config.json'
import locale from '../../locale/index.json'


export const getCurrentUser = () => {
  const isLogged = localStorage.getItem(AuthActionTypes.IS_LOGGED)
  if (isLogged) {
    return JSON.parse(isLogged)[0]
  }
  return null
}

export const auth = (username: string) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    try {
      if (!username) {
        dispatch({type: AuthActionTypes.FETCH_USER_ERROR, payload: AuthActionTypes.EMPTY_LOGIN})
      } else {
        const response = await axios.get(config.url + '/users?username=' + username)
        if (response && response.data) {
          if (response.data.length > 0) {
            localStorage.setItem(AuthActionTypes.IS_LOGGED, JSON.stringify(response.data))
            dispatch({type: AuthActionTypes.FETCH_USER, payload: response.data})
          } else {
            dispatch({type: AuthActionTypes.FETCH_USER_ERROR, payload: locale.wrongLogin})
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : locale.error
      dispatch({type: AuthActionTypes.FETCH_USER_ERROR, payload: message})
    }
  }
}

export const checkIsLogged = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    const isLogged = localStorage.getItem(AuthActionTypes.IS_LOGGED)
    if (isLogged) {
      const user = JSON.parse(isLogged)
      dispatch({type: AuthActionTypes.IS_LOGGED, payload: user})
    } else {
      dispatch({type: AuthActionTypes.FETCH_USER_ERROR, payload: ''})
    }
  }
}

export const logOut = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    localStorage.removeItem(AuthActionTypes.IS_LOGGED)
    dispatch({type: AuthActionTypes.FETCH_USER_ERROR, payload: ''})
  }
}
