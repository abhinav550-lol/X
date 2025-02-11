import path from 'path'
import fs from 'fs'
import { FileArray, UploadedFile } from 'express-fileupload';
const baseFolder = path.join(__dirname , process.env.FILEUPLOAD_DIST as string);
import statusCodes from './statusCodes';
import AppError from '../error/AppError';


//create user folder
export const createUserFolder = (id : string) => {
	const userFolder = path.join(baseFolder, id);
	if(!fs.existsSync(userFolder)){
		fs.mkdirSync(userFolder , {recursive : true});
	}	
}

export const uploadSingleFile = (file : UploadedFile , userFolder : string) =>{
	const uploadPath = path.join(userFolder , file.name);

	file.mv(uploadPath , function(err){
		 return new AppError(statusCodes.INTERNAL_SERVER_ERROR , `An Error Occurred while file upload. Error: ${err}`);
	})

	return uploadPath;
}	

export const uploadFile = (files : UploadedFile | FileArray , id : string ) : string[] | string => {
	const userFolder : string = path.join(baseFolder ,id);

	if('name' in files){
		//Single Files
		return uploadSingleFile(files as UploadedFile , userFolder);
	}else{
		//Multiple File
		return Object.values(files).map((file) => uploadSingleFile(file as UploadedFile , userFolder));
	}
	
}