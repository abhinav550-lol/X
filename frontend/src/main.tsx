import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './store/store.ts'

/*
Routes

Auth
/ -> The default login screen
/login
/register

App
/home -> Dashboard accessible if authenticated
/search -> search profiles
/user/:userId -> userProfile
/user/:userId/:tweetId -> userTweet
*/


createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<Provider store={store}> 
		<App />
	</Provider> 
  </StrictMode>,
)
