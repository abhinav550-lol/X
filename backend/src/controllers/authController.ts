import { NextFunction, Request, Response } from "express";

export function registerUser(req : Request , res: Response , next: NextFunction){
	const {name , userHandle , } = req.body;
}

export function loginUser(req : Request , res: Response , next: NextFunction){

}