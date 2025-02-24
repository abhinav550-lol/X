import dotenv from 'dotenv'
dotenv.config();

import passport from 'passport';
import express from 'express';
import cors from 'cors'	
import { connectDB } from './config/mongoConnection';
import errorMiddleware from './error/errorMiddleware';
import session from 'express-session'

import authRoutes from './routes/authRouter'
import userRoutes from './routes/userRoutes'
import tweetRoutes from './routes/tweetRoutes'
import commentRoutes from './routes/commentRoutes'
import notificationRoutes from './routes/notificationRoutes'

//Config & Jobs
import './config/passport'
const app = express();

app.use(cors({
	origin : process.env.FRONTEND_URI as string,   
	methods: ['GET' , 'POST' , 'PUT' , 'PATCH' , 'DELETE'],
	credentials : true,
}))

app.use(session({
	secret: process.env.SESSION_SECRET as string,
	resave: false,
	saveUninitialized: false,  
	
}));

import "express-session";
import fileUpload from 'express-fileupload';
declare module "express-session" {
  interface SessionData {
    user: string;
  }
}

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(fileUpload({
	createParentPath : true,
}));

//Routes

app.use('/auth' , authRoutes);
app.use('/user' , userRoutes);
app.use('/tweet' , tweetRoutes);
app.use('/comment' , commentRoutes);
app.use('/notification' , notificationRoutes);

//Error Middleware
app.use(errorMiddleware);

//Server Start
const startServer = async () => {
	try {
		const mongoUri = process.env.MONGO_URI;
	  if (!mongoUri) {
		throw new Error("MONGO_URI is not defined in the .env file");
	  }
  
	  await connectDB(mongoUri);
  
	  app.listen(3000 , () => {console.log("Server online!")});
	} catch (error) {
	  console.error("Error starting the server:", error);
	  process.exit(1); 
	}
  };
  
  startServer();


