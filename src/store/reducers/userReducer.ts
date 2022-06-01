import { UserState, UserAction, UserActionTypes } from "../../types/user"

const initialState: UserState = {
  users: [],
  totalCount: 0,
  loading: false,
  error: null
}

export const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case UserActionTypes.FETCH_USERS: {
      return {loading: true, error: null, users: [], totalCount: 0}
    }
    case UserActionTypes.FETCH_USERS_SUCCESS: {
      return {loading: false, error: null, users: action.payload, totalCount: action.totalCount}
    }
    case UserActionTypes.FETCH_USERS_ERROR: {
      return {loading: false, error: action.payload, users: [], totalCount: 0}
    }
    default: {
      return state
    }
  }
}
