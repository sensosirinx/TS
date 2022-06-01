import { combineReducers } from 'redux'
import { userReducer } from './userReducer'
import { authReducer } from './authReducer'
import { popupUserReducer } from './popupUserReducer'


export const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  popupUser: popupUserReducer
})

export type RootState = ReturnType<typeof rootReducer>
