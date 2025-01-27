import { NextFunction, Request, Response } from "express";
import statusCodes from "./statusCodes";

export function userHandleGenerater(name : string) : string{ 
	let salt : string = "";
	for(let i = 0 ; i < 7 ; i++){
		const it : number = Math.floor(Math.random() * 10);
		salt += it.toString();
	}
	return` ${name}-${salt}`
}

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