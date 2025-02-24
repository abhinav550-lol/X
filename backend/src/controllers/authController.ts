import { NextFunction, Request, Response } from "express";
import statusCodes from "../utils/statusCodes";
import wrapAsyncErrors from "../error/wrapAsyncErrors";
import AppError from "../error/AppError";
import User from "../model/UserSchema";
import bcrypt from 'bcrypt'
import { createUserFolder } from "../utils/fileHandling";

export function logoutUser (req: Request , res : Response , next : NextFunction) {
	req.session.destroy((err) => {
		next(err)
	});

	res.status(statusCodes.OK).json({
		success: true,
		message: "User logged out successfully."
	})
};

//google signin routes
export function getUser(req: Request, res : Response, next : NextFunction) {
	try {
	  const user = req.user || req.session.user; 
	  if (user) {
		res.status(statusCodes.OK).json({
		  success: true,
		  message: "User logged in!",
		  user,
		});
	  } else {
		res.status(statusCodes.UNAUTHORIZED).json({
		  success: false,
		  message: "Please log in!",
		});
	  }
	} catch (error) {
	  next(error);
	}
  }

export function failureRedirect(req: Request, res: Response, next: NextFunction): void {
	res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
	  success: false,
	  message: "Authentication Failed!",
	});
}

//express signin routes
export const registerUser = wrapAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
	const { name, userHandle, password, confirmPassword } = req.body;
  
	if (!name || !userHandle || !password || !confirmPassword) {
		return next(new AppError(statusCodes.BAD_REQUEST , `Please enter all the required fields.`));
	}

	if(password !== confirmPassword){
		return next(new AppError(statusCodes.BAD_REQUEST , "Passwords do not match."))
	}
	
	const foundUser = await User.findOne({userHandle});
	if(foundUser){
		return next(new AppError(statusCodes.BAD_REQUEST , "The user handle is already taken."))
	}

	const signInType = "Session";

	const hashedPassword = await bcrypt.hash(password , 8);

	const newUser = await User.create({
		name , userHandle ,
		auth : {
			signInType,
			sessionInfo : {
				password : hashedPassword
			}
		}
	})

	//make user directory in store when they login ?
	createUserFolder(newUser._id.toString());

	req.session.user = newUser._id.toString();

	return res.status(statusCodes.OK).json({
		success : true,
		message : "Welcome to X!",
		user : newUser
	})
  });

export const loginUser = wrapAsyncErrors(async (req : Request , res: Response , next: NextFunction) => {
	const {userHandle , password} = req.body;

	if(!userHandle || !password){
		return next(new AppError(statusCodes.BAD_REQUEST , "Please enter all the required fields."))
	}

	const foundUser = await User.findOne({userHandle , "auth.signInType" : "Session"}).select('+auth');
	if(!foundUser){
		return next(new AppError(statusCodes.NOT_FOUND , "User not found."));
	}

	const result = await bcrypt.compare(password , foundUser.auth.sessionInfo?.password as string);
	if(!result){
		return next(new AppError(statusCodes.BAD_REQUEST , "Invalid Userhandle or Password."));
	}

	req.session.user = foundUser._id.toString();

	return res.status(statusCodes.OK).json({
		success : true,
		message : "Successfully logged in.",
	})
})

export const alreadyLoggedIn = wrapAsyncErrors(async(req: Request , res: Response ,next : NextFunction) => {
	const user = req.user || req.session.user;
	if(!user){
		return next();
	}
	return res.status(statusCodes.BAD_REQUEST).json({
		success : false,
		message : "You are already logged in!"
	})
})

export function isLoggedIn(req: Request, res: Response, next: NextFunction){
	if (req.user || req.session.user) {
		next();
	} else {
		  res.status(statusCodes.UNAUTHORIZED ).json({
			  success : false,
			  message : "You are not logged in."
		  })
	  }
};
