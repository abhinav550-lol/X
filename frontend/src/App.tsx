import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import LoadingScreen from './components/LoadingScreen'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ProtectedRoute from './components/ProtectedRoute'
import { config } from './config'


export default function App(){
	const [isAuthenticated , setIsAuthenticated] = useState(false);
	const [loadingScreenShown , setLoadingScreenShown] = useState(false);
	useEffect(() => {
		setLoadingScreenShown((e) => !e)
		async function isUserAuthenticated(){
			try{
				const response = await axios.get(`${config.BACKEND_URI}/auth/user` , {withCredentials : true});	
				setIsAuthenticated((() =>  response.data.success));
			}catch(err){
				setIsAuthenticated(false);
			}
		}
		isUserAuthenticated();
	})

	return (	
		<BrowserRouter >
		{!loadingScreenShown && <LoadingScreen />}
		<Routes>
			{/*Unprotected Routes*/}


			{/*Protected Routes*/}
			<Route element={<ProtectedRoute isAuth={isAuthenticated}/>}>   
				<Route path='/home' ></Route>

			</Route>
		</Routes>
		</BrowserRouter>
	)	
}
