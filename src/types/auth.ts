import { UserFields } from './user'

export interface AuthState {
  user: UserFields | null
  isLogin: boolean
  error: null | string
}

export enum AuthActionTypes {
  IS_LOGGED = 'IS_LOGGED',
  FETCH_USER = 'FETCH_USER',
  FETCH_USER_ERROR = 'FETCH_USER_ERROR',
  EMPTY_LOGIN = 'EMPTY_LOGIN'
}

interface isLoggedUserAction {
  type: AuthActionTypes.IS_LOGGED
  payload: UserFields | null
}

interface FetchUserAction {
  type: AuthActionTypes.FETCH_USER
  payload: UserFields | null
}

interface FetchUserErrorAction {
  type: AuthActionTypes.FETCH_USER_ERROR
  payload: string
}

export type AuthAction = FetchUserAction | FetchUserErrorAction | isLoggedUserAction
