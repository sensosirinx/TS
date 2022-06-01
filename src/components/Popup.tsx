import React, { useEffect }  from 'react'
import { useParams } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '../store'
import { createRoot } from 'react-dom/client'
import { PopupInterface, ModalRootInterface, PopupUC } from '../types/popup'
import { UserActionTypes, UserFields, UserErrorMessages } from '../types/user'
import { useActions } from '../hooks/useActions'
import { useTypedSelector } from '../hooks/useTypedSelector'
import locale from '../locale/index.json'
import { getCurrentUser } from '../store/actions/login'


const ModalRoot: ModalRootInterface = {
  element: null
}

const unmountModal = () => {
  ModalRoot.element && ModalRoot.element.unmount()
  ModalRoot.element = null
}

export const Popup: React.FC<PopupInterface> = (props) => {

  const { clearPopupError, fetchUsers } = useActions()
  const { pageId } = props

  const closePopup = () => {
    clearPopupError()
    unmountModal()
  }

  const { popupUser, error } = useTypedSelector(state => state.popupUser)

  useEffect(() => {
    if (popupUser && !error) {
      fetchUsers(pageId, false, closePopup)
    }
  }, [pageId, popupUser, error])

  const { type, user } = props

  let popupComponent, title
  switch (type) {
    case UserActionTypes.ADD_USER: {
      popupComponent = <PopupUserComponent user={null}/>
      title = locale.addUser
      break
    }
    case UserActionTypes.EDIT_USER: {
      popupComponent = <PopupUserComponent user={user}/>
      title = locale.editUser
      break
    }
    case UserActionTypes.DELETE_USER: {
      popupComponent = <PopupUserInfoComponent type={UserActionTypes.DELETE_USER} user={user}/>
      title = locale.deleteUser
      break
    }
  }

  return (
    <div>
      <div className={'popup-overlay'} onClick={closePopup}></div>
      <div className={'popup'}>
        <div className={'popup-header'}>
          <div className={'popup-title'}>{title}</div>
          <button className={'close'} onClick={closePopup}></button>
        </div>
        {popupComponent}
      </div>
    </div>
  )
}

const PopupUserInfoComponent: React.FC<PopupInterface> = (props) => {

  const { type, user } = props
  const { error } = useTypedSelector(state => state.popupUser)
  const { deleteUser } = useActions()

  let title
  if (type === UserActionTypes.DELETE_USER) {
    const name = user && user.name || ''
    title = locale.deleteQuestion.replace('%name%', name)
  }

  const submit = () => {
    if (type === UserActionTypes.DELETE_USER && user) {
      deleteUser(user)
    }
  }

  const cancel = () => {
    unmountModal()
  }

  const errorMessage = error && error.message

  return (
    <div className={'popup-info'}>
      <div className={'title'}>
        {title}
      </div>
      <div className={'popup-content'}>
        <div className={'input-field'}>
          <button className={'popup-submit'} onClick={submit}>{locale.ok}</button>
          <button className={'popup-submit'} onClick={cancel}>{locale.cancel}</button>
        </div>
        <div className={'popup-error'}>{errorMessage}</div>
      </div>
    </div>
  )
}

const PopupUserComponent: React.FC<PopupUC> = (props) => {

  const { user } = props
  const { error } = useTypedSelector(state => state.popupUser)
  const { addUser, editUser } = useActions()
  const currentUser = getCurrentUser()

  const nameInput = React.createRef<HTMLInputElement>()
  const usernameInput = React.createRef<HTMLInputElement>()
  const emailInput = React.createRef<HTMLInputElement>()
  const phoneInput = React.createRef<HTMLInputElement>()

  const submit = () => {
    const data = {
      id: 0,
      name: nameInput && nameInput.current && nameInput.current.value || '',
      username: usernameInput && usernameInput.current && usernameInput.current.value || '',
      email: emailInput && emailInput.current && emailInput.current.value || '',
      phone: phoneInput && phoneInput.current && phoneInput.current.value || '',
      userId: currentUser.id
    }

    if (user) {
      data.id = user.id
      editUser(data)
    } else {
      addUser(data)
    }
  }

  let errorMessage = error && error.message
  let inputNameClassname = 'form-input', inputUsernameClassname = 'form-input'
  if (error && error.message) {
    if (error.message === UserErrorMessages.EMPTY_FIELDS) {
      errorMessage = locale.emptyFields
      if (!error.name) {
        inputNameClassname = 'form-input error'
      }
      if (!error.username) {
        inputUsernameClassname = 'form-input error'
      }
    } else if (error.message === UserErrorMessages.USER_IS_EXIST) {
      errorMessage = locale.userIsExist
      inputUsernameClassname = 'form-input error'
    }
  }


  let name, username, email, phone
  if (user) {
    name = user.name
    username = user.username
    email = user.email
    phone = user.phone
  }

  return (
    <div className={'popup-content'}>
      <div className={'input-field'}>
        <label htmlFor={'name'}>{locale.userFields.name} <span>*</span></label>
        <input type={'text'} id={'name'} defaultValue={name} className={inputNameClassname} ref={nameInput}/>
      </div>
      <div className={'input-field'}>
        <label htmlFor={'username'}>{locale.userFields.username} <span>*</span></label>
        <input type={'text'} id={'username'} defaultValue={username} className={inputUsernameClassname} ref={usernameInput}/>
      </div>
      <div className={'input-field'}>
        <label htmlFor={'email'}>{locale.userFields.email}</label>
        <input type={'text'} id={'email'} defaultValue={email} className={'form-input'} ref={emailInput}/>
      </div>
      <div className={'input-field'}>
        <label htmlFor={'phone'}>{locale.userFields.phone}</label>
        <input type={'text'} id={'phone'} defaultValue={phone} className={'form-input'} ref={phoneInput}/>
      </div>
      <div className={'input-field'}>
        <button className={'popup-submit'} onClick={submit}>{locale.submit}</button>
      </div>
      <div className={'popup-error'}>{errorMessage}</div>
    </div>
  )
}

export const initModal = (type: string, user: UserFields | null, pageId?: string) => {
  if (!ModalRoot.element) {
    const modalElement = document.getElementById('modal')
    ModalRoot.element = createRoot(modalElement!)
  }
  ModalRoot.element.render(
    <Provider store={store}>
      <Popup type={type} user={user} pageId={pageId}/>
    </Provider>
  )
}
