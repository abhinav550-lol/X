import express from 'express'
import passport from 'passport';
import { alreadyLoggedIn, failureRedirect, getUser, loginUser, logoutUser, registerUser ,isLoggedIn } from '../controllers/authController';
const router = express.Router();

router.get('/login/google', passport.authenticate('google' , {
	scope : ['profile'],
	successRedirect : `${process.env.FRONTEND_URI as string}`,
	failureRedirect : `${process.env.BACKEND_URI as string}/auth/login/google/failure`
}));

router.get('/logout' ,logoutUser);

//Google Routes
router.get('/user', isLoggedIn , getUser);
  
router.get('/login/google/failure' , failureRedirect)

//Session Routes 
router.post('/register/session', alreadyLoggedIn  ,registerUser);

router.post('/login/session',alreadyLoggedIn , loginUser);


export default router;