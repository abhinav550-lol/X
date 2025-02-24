import {  UploadedFile } from "express-fileupload";
import { Types } from "mongoose";
import Media, { MediaInterface } from "../model/MediaSchema";
import { uploadFile } from "../utils/fileHandling";
import wrapAsyncErrors from "../error/wrapAsyncErrors";
import User from "../model/UserSchema";
import AppError from "../error/AppError";
import statusCodes from "../utils/statusCodes";


// add media for corresponding user
export const uploadMedia = async function (userId : Types.ObjectId , tweetId : Types.ObjectId , media : UploadedFile[]) : Promise<Types.ObjectId>{
	const mediaAddress = uploadFile(media  , userId.toString());
	const createdMedia : MediaInterface = await Media.create({userId , tweetId , mediaAddress });
	return createdMedia._id;
}

//remove media for correponding user
export const deleteMedia = async function (mediaId : Types.ObjectId){
	await Media.findByIdAndDelete(mediaId);
}

//get all media
export const getAllMedia = wrapAsyncErrors(async (req , res , next) => {
	const {id : userId} = req.params;

	const foundUser = await User.findById(userId);
	if(!foundUser){
		return next(new AppError(statusCodes.BAD_REQUEST , "User not found, to fetch media."));
	}

	const allMedia = await Media.find({userId : foundUser._id});
	const allMediaAddress = allMedia.flatMap(m => m.mediaAddress);

	return res.status(statusCodes.OK).json({
		success : true,
		message : "Here's all the media for this user.",
		media : allMediaAddress
	})

})	