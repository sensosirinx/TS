import React, { KeyboardEvent } from 'react'
import { AuthActionTypes } from '../types/auth'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { Navigate } from 'react-router-dom'
import { useActions } from '../hooks/useActions'
import locale from '../locale/index.json'


const LoginForm: React.FC = () => {

  const loginInput = React.createRef<HTMLInputElement>()

  const { isLogin, error } = useTypedSelector(state => state.auth)
  const { auth } = useActions()

  if (isLogin) {
    return (
      <Navigate to="/contacts" replace={true} />
    )
  }

  const logIn = () => {
    const username = loginInput && loginInput.current && loginInput.current.value || ''
    auth(username)
  }

  const handleInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode === 13) {
      logIn()
    }
  }

  let inputClassName = 'login'
  let errorInfoClassName = 'error-info hidden'
  if (error) {
    if (error === AuthActionTypes.EMPTY_LOGIN) {
      inputClassName = 'login error'
    } else {
      errorInfoClassName = 'error-info'
    }
  }

  return (
    <div className={'login-form'}>
      <h1>{locale.pageAuthH1}</h1>
      <input type={'text'} placeholder={locale.inputLogin} className={inputClassName} ref={loginInput} onKeyPress={handleInputKeyPress}/>
      <button className={'log-in'} onClick={logIn}>{locale.logIn}</button>
      <div className={errorInfoClassName}>{error}</div>
    </div>
  )
}

export default LoginForm
