import { Dispatch } from 'redux'
import { RequestMethod, UserAction, UserActionTypes, UserFields, UserPopupAction, UserErrorMessages } from '../../types/user'
import axios from 'axios'
import config from '../../config.json'
import locale from '../../locale/index.json'
import { getCurrentUser } from './login'


export const fetchUsers = (id?: string, loading?: boolean, callback?: () => void) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      if (loading) {
        dispatch({type: UserActionTypes.FETCH_USERS})
      }
      const currentUser = getCurrentUser()
      const pageId = id && parseInt(id) > 1 ? parseInt(id) : 1
      const limit = config.limitUsersPerPage
      const offset = (pageId - 1) * limit
      const response = await axios.get(config.url + '/contacts?userId=' + currentUser.id + '&_start=' + offset + '&_limit=' + limit)
      const totalCount = response.headers['x-total-count'] && parseInt(response.headers['x-total-count']) || 0
      dispatch({type: UserActionTypes.FETCH_USERS_SUCCESS, payload: response.data, totalCount: totalCount})
      callback && callback()
    } catch (error) {
      const message = error instanceof Error ? error.message : locale.error
      dispatch({type: UserActionTypes.FETCH_USERS_ERROR, payload: message})
    }
  }
}

export const searchUsers = (query: string) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const currentUser = getCurrentUser()
      const response = await axios.get(config.url + '/contacts?userId='+ currentUser.id +'&q=' + query)
      const totalCount = response.headers['x-total-count'] && parseInt(response.headers['x-total-count']) || 0
      dispatch({type: UserActionTypes.FETCH_USERS_SUCCESS, payload: response.data, totalCount: totalCount})
    } catch (error) {
      const message = error instanceof Error ? error.message : locale.error
      dispatch({type: UserActionTypes.FETCH_USERS_ERROR, payload: message})
    }
  }
}

export const addUser = (data: UserFields) => {
  return sendUserData(data, RequestMethod.POST)
}

export const editUser = (data: UserFields) => {
  return sendUserData(data, RequestMethod.PUT)
}

export const deleteUser = (data: UserFields) => {
  return sendUserData(data, RequestMethod.DELETE)
}

export const clearPopupError = () => {
  return async (dispatch: Dispatch<UserPopupAction>) => {
    dispatch({type: UserActionTypes.CLEAR_POPUP_USERS_ERROR, payload: null})
  }
}

const sendUserData = (data: UserFields, type: string) => {
  return async (dispatch: Dispatch<UserPopupAction>) => {

    const validFields = () => {
      if (!data.name || !data.username) {
        dispatch({type: UserActionTypes.FETCH_POPUP_USERS_ERROR, payload: {message: UserErrorMessages.EMPTY_FIELDS, name: data.name, username: data.username}})
        return false
      }
      return true
    }

    const isExistUser = async () => {
      const currentUser = getCurrentUser()
      const response = await axios.get(config.url + '/contacts?userId='+ currentUser.id +'&username=' + data.username)
      if (response && response.data && response.data.length > 0) {
        dispatch({type: UserActionTypes.FETCH_POPUP_USERS_ERROR, payload: {message: UserErrorMessages.USER_IS_EXIST, name: data.name, username: data.username}})
        return true
      }
      return false
    }

    try {
      switch (type) {
        case RequestMethod.POST: {
          const valid = validFields()
          if (!valid) {
            break
          }
          const isExist = await isExistUser()
          if (isExist) {
            break
          }
          const response = await axios.post(config.url + '/contacts', data)
          dispatch({type: UserActionTypes.FETCH_POPUP_USER_SUCCESS, payload: response.data})
          break
        }
        case RequestMethod.PUT: {
          const valid = validFields()
          if (!valid) {
            break
          }
          const response = await axios.put(config.url + '/contacts/' + data.id, data)
          dispatch({type: UserActionTypes.FETCH_POPUP_USER_SUCCESS, payload: response.data})
          break
        }
        case RequestMethod.DELETE: {
          const response = await axios.delete(config.url + '/contacts/' + data.id)
          dispatch({type: UserActionTypes.FETCH_POPUP_USER_SUCCESS, payload: response.data})
          break
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : locale.error
      dispatch({type: UserActionTypes.FETCH_POPUP_USERS_ERROR, payload: {message: message, name: null, username: null}})
    }
  }
}
