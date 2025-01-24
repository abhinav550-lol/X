import express from 'express';
import cors from 'cors'	
import dotenv from 'dotenv'
import { connectDB } from './config/mongoConnection';
import errorMiddleware from './error/errorMiddleware';

import tagClear from './tasks/tagClear';
//Config & Jobs
dotenv.config();
const app = express();

app.use(cors({
	origin : process.env.FRONTEND_URL, 
	methods: ['GET' , 'POST' , 'PUT' , 'PATCH' , 'DELETE'],
	credentials : true,
}))

app.use(express.json());
app.use(express.urlencoded({extended : true}));

tagClear.start();
//Routes


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


