import React, { useEffect, KeyboardEvent } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useTypedSelector } from '../hooks/useTypedSelector'
import { useActions } from '../hooks/useActions'
import { initModal } from './Popup'
import { UserActionTypes, UserFields } from '../types/user'
import { getCurrentUser } from '../store/actions/login'
import Pagination from './Pagination'
import locale from '../locale/index.json'


const UserList: React.FC = () => {
  const { error } = useTypedSelector(state => state.user)
  const { isLogin } = useTypedSelector(state => state.auth)
  const { fetchUsers, logOut } = useActions()
  const currentUser = getCurrentUser()
  const { pageId } = useParams<"pageId">()

  useEffect(() => {
    fetchUsers(pageId, true)
  }, [pageId])

  if (!isLogin) {
    return (
      <Navigate to="/" replace={true} />
    )
  }

  const doLogOut = () => {
    logOut()
  }

  const addNewUser = () => {
    initModal(UserActionTypes.ADD_USER, null, pageId)
  }

  const editUser = (user: UserFields) => {
    initModal(UserActionTypes.EDIT_USER, user, pageId)
  }

  const deleteUser = (user: UserFields) => {
    initModal(UserActionTypes.DELETE_USER, user, pageId)
  }

  if (error) {
    return <div className={'error-list'}>{error}</div>
  }

  return (
    <div className={'user-list-wrapper'}>
      <div className={'user-list-top-header'}>
        <div className={'profile'}>
          <div className={'welcome'}>
            {locale.welcome}, <strong>{currentUser && currentUser.name}</strong>!
          </div>
          <button className={'logout'} onClick={doLogOut}>{locale.logout}</button>
        </div>
        <h1>{locale.pageContactsH1}</h1>
        <button className={'add-user'} onClick={addNewUser}>{locale.addUser}</button>
      </div>
      <UserSearchComponent/>
      <UserListComponent editUser={editUser} deleteUser={deleteUser}/>
      <Pagination/>
    </div>
  )
}


interface ULComponentProps {
  editUser: (user: UserFields) => void
  deleteUser: (user: UserFields) => void
}

const UserListComponent: React.FC<ULComponentProps> = (props) => {

  const { editUser, deleteUser } = props

  const { loading, users } = useTypedSelector(state => state.user)
  const currentUser = getCurrentUser()

  return (
    <div>
    <div className={'user-list-header'}>
      <div className={'user'}>
        <div>{locale.userFields.name}</div>
        <div>{locale.userFields.username}</div>
        <div>{locale.userFields.email}</div>
        <div>{locale.userFields.phone}</div>
        <div>{locale.userFields.actions}</div>
      </div>
    </div>
    {loading ? <div className={'loading'}>{locale.loading}</div> : users.map(user =>
      <div key={user.id} className={'user'}>
        <div>{user.name}</div>
        <div>{user.username}</div>
        <div>{user.email}</div>
        <div>{user.phone}</div>
        <div className={'user_options'}>
          <button className={'edit'} title={locale.edit} onClick={() => editUser(user)}></button>
          <button className={'delete'} title={locale.delete} onClick={() => deleteUser(user)}></button>
        </div>
      </div>
    )}
    </div>
  )
}

const UserSearchComponent: React.FC = () => {

  const searchInput = React.createRef<HTMLInputElement>()

  const { searchUsers, fetchUsers } = useActions()
  const { pageId } = useParams<"pageId">()

  const doSearch = () => {
    const text = searchInput && searchInput.current && searchInput.current.value
    if (text && text.length > 2) {
      searchUsers(text)
    }
    if (!text) {
      fetchUsers(pageId)
    }
  }

  const handleInputKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.which === 13 || e.which === 8) {
      doSearch()
    }
  }

  return (
    <div className={'search-form'}>
      <input type={'text'} id={'search'} defaultValue={''} className={'form-input'} placeholder={locale.searchText} ref={searchInput} onKeyUp={handleInputKeyUp}/>
      <button className={'search-button'} onClick={doSearch}></button>
    </div>
  )
}

export default UserList
