import React  from 'react'
import { Routes, Route } from "react-router-dom"
import UserList from './components/UserList'
import LoginForm from './components/LoginForm'
import { useActions } from './hooks/useActions'


function App () {

	const { checkIsLogged } = useActions()
	checkIsLogged()

	return (
		<div className={'content'}>
			<Routes>
				<Route index element={<LoginForm />}/>
				<Route path='contacts' element={<UserList />}>
					<Route path=':pageId' element={<UserList />}/>
				</Route>
			</Routes>
		</div>
	)
}

export default App
