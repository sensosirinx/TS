export interface UserState {
  users: Array<UserFields>
  totalCount: number
  loading: boolean
  error: null | string
}

export interface UserFields {
  id: number,
  name: string,
  username: string,
  email: string,
  phone: string,
  userId: number
}

export enum UserActionTypes {
  FETCH_USERS = 'FETCH_USERS',
  FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS',
  FETCH_USERS_ERROR = 'FETCH_USERS_ERROR',
  FETCH_POPUP_USER_SUCCESS = 'FETCH_POPUP_USER_SUCCESS',
  FETCH_POPUP_USERS_ERROR = 'FETCH_POPUP_USERS_ERROR',
  CLEAR_POPUP_USERS_ERROR = 'CLEAR_POPUP_USERS_ERROR',
  ADD_USER = 'ADD_USER',
  EDIT_USER = 'EDIT_USER',
  DELETE_USER = 'DELETE_USER'
}

export enum RequestMethod {
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export enum UserErrorMessages {
  EMPTY_FIELDS = 'EMPTY_FIELDS',
  USER_IS_EXIST = 'USER_IS_EXIST'
}

interface FetchUsersAction {
  type: UserActionTypes.FETCH_USERS
}

interface FetchUsersSuccessAction {
  type: UserActionTypes.FETCH_USERS_SUCCESS
  payload: Array<UserFields>
  totalCount: number
}

interface FetchUsersErrorAction {
  type: UserActionTypes.FETCH_USERS_ERROR
  payload: string
}

export type UserAction = FetchUsersAction | FetchUsersSuccessAction | FetchUsersErrorAction

export interface RequiredFields {
  message: string,
  name: string | null,
  username: string | null
}

export interface PopupUserState {
  popupUser: UserFields | null
  error: RequiredFields | null
}

interface FetchPopupUsersSuccessAction {
  type: UserActionTypes.FETCH_POPUP_USER_SUCCESS
  payload: UserFields
}

interface FetchPopupUsersErrorAction {
  type: UserActionTypes.FETCH_POPUP_USERS_ERROR
  payload: RequiredFields
}

interface ClearPopupUsersErrorAction {
  type: UserActionTypes.CLEAR_POPUP_USERS_ERROR
  payload: null
}

export type UserPopupAction = FetchPopupUsersSuccessAction | FetchPopupUsersErrorAction | ClearPopupUsersErrorAction
