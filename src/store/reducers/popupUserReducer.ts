import { PopupUserState, UserPopupAction, UserActionTypes } from '../../types/user'


const initialState: PopupUserState = {
  popupUser: null,
  error: null
}

export const popupUserReducer = (state = initialState, action: UserPopupAction): PopupUserState => {
  switch (action.type) {
    case UserActionTypes.FETCH_POPUP_USER_SUCCESS: {
      return {popupUser: action.payload, error: null}
    }
    case UserActionTypes.FETCH_POPUP_USERS_ERROR: {
      return {popupUser: null, error: action.payload}
    }
    case UserActionTypes.CLEAR_POPUP_USERS_ERROR: {
      return {popupUser: null, error: null}
    }
    default: {
      return state
    }
  }
}
