import express from 'express'
import passport from 'passport';
import statusCodes from '../utils/statusCodes';
import { loginUser, registerUser } from '../controllers/authController';
const router = express.Router();

router.get('/logout' , (req , res , next) => {
	req.session.destroy((err) => {
		next(err)
	});

	res.send(statusCodes.OK).json({
		success: true,
		message: "User logged out successfully."
	})
})

console.log(process.env.FRONTEND_URI)
console.log(process.env.BACKEND_URI)


//Google Routes
router.get('/login/google', passport.authenticate('google' , {
	scope : ['profile'],
	successRedirect : `${process.env.FRONTEND_URI as string}`,
	failureRedirect : `${process.env.BACKEND_URI as string}/auth/login/google/failure`
}));

router.get('/login/sucess' , (req, res ,next) =>{
	if (req.user) {
		res.status(statusCodes.OK).json({
			success : true,
			message: "Successfully Logged In",
			user: req.user,
		});
	} else {
		res.status(statusCodes.UNAUTHORIZED).json({ success : false , message: "Please log in!" });
	}
})

router.get('/login/google/failure' , (req, res ,next) =>{
	res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
		success : false,
		message : "Authentication Failed!" 
	})
})

//Session Routes 
router.post('/register/session', registerUser);

router.post('/login/session', loginUser);


export default router;