import { Request, Response, NextFunction } from "express";
import AppError from "./AppError"; // Assuming AppError class is defined

export default function errorMiddleware(err: AppError, req: Request, res: Response, next: NextFunction) {
  let { name, message = "Internal Server Error", status = 500 } = err;

  if (name === "ValidationError") {
    message = "Mongoose Validation Failed";
	console.log(err)
    status = 400; 
  }

  res.status(status).json({
    success: false,
    message,
  });
}
