import { NextFunction, Request, Response } from "express";
import wrapAsyncErrors from "../error/wrapAsyncErrors";
import Tweet, { tweetInterface } from "../model/TweetSchema";
import statusCodes from "../utils/statusCodes";
import AppError from "../error/AppError";
import User ,{ UserInterface  }  from "../model/UserSchema";
import {  UploadedFile } from "express-fileupload";
import { deleteMedia, uploadMedia } from "./mediaController";
import  { Types } from "mongoose";
import { issueNotification } from "./notificationController";

export const getAllTweets = wrapAsyncErrors(async (req : Request , res : Response , next : NextFunction) => {
	const {userId} = req.params;

	const foundTweets = await Tweet.findTweetsByUserId(userId);

	res.status(statusCodes.OK).json({
		success : true,
		message : "Fetched all user tweets.",
		tweets : foundTweets
	}) 
})

export const createTweet = wrapAsyncErrors(async (req : Request , res : Response , next : NextFunction) => {
    const { userId } = req.params;

	const foundUser = await User.findById(userId);


	if(!foundUser){
		return next(new AppError(statusCodes.BAD_REQUEST , "User not found."))
	}

	const {text } = req.body;
	const media : UploadedFile[]  | null = (req.files && req.files.media) ? (Array.isArray(req.files.media) ? req.files.media : [req.files.media]) : null;


	if(!text && (media && media.length === 0)){
		return next(new AppError(statusCodes.BAD_REQUEST , "Empty text and media fields are not allowed."));
	}	

	const newTweet : Partial<tweetInterface> = {};
	if(text) newTweet.text = text;
	if(media && media.length !== 0) newTweet.media = (new Types.ObjectId() )  ;
	newTweet.tweetType = "Tweet";
	newTweet.postedBy = foundUser._id;
	
	const createdTweet = await Tweet.create(newTweet);

	if(media && media.length !== 0){
		createdTweet.media = (await uploadMedia(foundUser._id , createdTweet._id , media as UploadedFile[]) ) ;
		createdTweet.save();
	}

	for(let i = 0 , len = foundUser.followers.length ; i < len ; i++){
		await issueNotification('posted' , foundUser._id , foundUser.followers[i] , createdTweet._id.toString());
	}

	res.status(statusCodes.CREATED).json({
		success : true,
		message : "Tweet created successfully.",
		tweet : newTweet
	})

})

export const getTweet = wrapAsyncErrors(async (req : Request , res : Response , next : NextFunction) => {
	const { tweetId} = req.params;

	const foundTweet = await Tweet.findById(tweetId);

	if(!foundTweet){
		return next(new AppError(statusCodes.BAD_REQUEST , `Tweet not found with id: ${tweetId}`));
	}

	res.status(statusCodes.OK).json({
		success : true,
		message : "Tweet found.",
		tweet : foundTweet
	})
})

export const editTweet = wrapAsyncErrors(async (req : Request , res : Response , next : NextFunction) => {
	const {tweetId} = req.params;

	const foundTweet = await Tweet.findById(tweetId);

	if(!foundTweet){
		return next(new AppError(statusCodes.BAD_REQUEST, `Tweet not found with id: ${tweetId}`));
	}

	const userId =  req.user || req.session.user;
	const foundUser : UserInterface | null = await User.findById(userId);

	if(!foundUser || foundUser && userId !== foundTweet.postedBy){
		return next(new AppError(statusCodes.BAD_REQUEST , "Not Authorized to edit this tweet."));
	}

	const {text} = req.body;
	const media : UploadedFile[]  | null = (req.files && req.files.media) ? (Array.isArray(req.files.media) ? req.files.media : [req.files.media]) : null;
	if(!text && (media && media.length === 0)){
		return next(new AppError(statusCodes.BAD_REQUEST , "Empty text and media fields are not allowed."));
	}	

	if(text) foundTweet.text = text;
	if(media && media.length !== 0){
		foundTweet.media = (await uploadMedia(foundUser._id , foundTweet._id , media as UploadedFile[]) ) ;
	}
	foundTweet.save();

	res.status(statusCodes.OK).json({
		success : true,
		message : "Tweet created successfully.",
		tweet : foundTweet
	})	
})

export const deleteTweet = wrapAsyncErrors(async (req : Request , res : Response , next : NextFunction) => {
	const {tweetId } = req.params;

	const foundTweet = await Tweet.findById(tweetId);
	
	if(!foundTweet){
		return next(new AppError(statusCodes.BAD_REQUEST, `Tweet not found with id: ${tweetId}`));
	}

	const userId =  req.user || req.session.user;
	const foundUser : UserInterface | null = await User.findById(userId);

	if(!foundUser ||  userId !== foundTweet.postedBy){
		return next(new AppError(statusCodes.BAD_REQUEST , "Not Authorized to edit this tweet."));
	}
	
	await deleteMedia((foundTweet.media as unknown) as Types.ObjectId);

	await Tweet.findByIdAndDelete(foundTweet._id)

	res.status(statusCodes.OK).json({
		success : true,
		message : "Tweet deleted succesfully",
	})
})

export const tweetLike = wrapAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { tweetId } = req.params;

    const foundTweet : tweetInterface | null = await Tweet.findById(tweetId);
    if (!foundTweet) {
        return next(new AppError(statusCodes.BAD_REQUEST, `Tweet not found with id: ${tweetId}`));
    }

    const userId = (req.user || req.session.user) as string;

	const foundUser = await User.findById(userId) as UserInterface;

    let message = "";
    const index = foundTweet.likedBy.findIndex(currUser => currUser.toString() === userId);

    if (index !== -1) {
        foundTweet.likedBy.splice(index,1);
        message = "Unliked Tweet.";
		const foundTweetIndex = foundUser.likedTweets.findIndex(currTweet => currTweet.toString() === tweetId);
		if(foundTweetIndex !== -1) foundUser.likedTweets.splice(foundTweetIndex , 1);
    } else {
        foundTweet.likedBy.push(new Types.ObjectId(userId as string));
        message = "Liked Tweet.";
		foundUser.likedTweets.push(new Types.ObjectId(tweetId));
    }

	//@ts-ignore
    await foundTweet.save(); 
	await foundUser.save();

	if(index === -1 && userId !== foundTweet._id.toString()){
		const foundUser = await User.findById(foundTweet.postedBy) as UserInterface;
		await issueNotification("liked" , new Types.ObjectId(userId as string) , foundUser._id  , foundTweet.postedBy.toString() );
	}

    res.status(statusCodes.OK).json({
        success: true,
        message,
    });
});



export const retweetTweet = wrapAsyncErrors(async (req : Request , res : Response , next : NextFunction) => {
	const {tweetId} = req.params;

	const foundTweet : tweetInterface | null = await Tweet.findById(tweetId);

	if(!foundTweet){
		return next(new AppError(statusCodes.BAD_REQUEST, `Tweet not found with id: ${tweetId}`));
	}

	const userId = (req.user || req.session.user) as string;
	const foundUser : UserInterface | null = await User.findById(userId) ;
	
	if(!foundUser){
		return next(new AppError(statusCodes.BAD_REQUEST , `User not found.`));
	}

	const {text} = req.body;
	const media : UploadedFile[]  | null = (req.files && req.files.media) ? (Array.isArray(req.files.media) ? req.files.media : [req.files.media]) : null;
	if(!text && (media && media.length === 0)){
		return next(new AppError(statusCodes.BAD_REQUEST , "Empty text and media fields are not allowed."));
	}	

	const newRetweet : Partial<tweetInterface> = {};
	if(text) newRetweet.text = text;
	if(media && media.length !== 0) newRetweet.media = (new Types.ObjectId())  ;
	newRetweet.tweetType = "Retweet";
	newRetweet.postedBy = foundUser._id;
	newRetweet.retweetId = tweetId;

	const createdTweet = await Tweet.create(newRetweet);

	if(media && media.length !== 0){
		createdTweet.media = (await uploadMedia(foundUser._id , createdTweet._id , media as UploadedFile[]) ) ;
		createdTweet.save();
	}

	await issueNotification('retweeted' , new Types.ObjectId(userId ) , foundTweet.postedBy, createdTweet._id.toString());

	res.status(statusCodes.OK).json({
		success : true,
		message : "Retweet posted.",
		tweet : createdTweet
	})

})

export const fetchAllLikedTweets = wrapAsyncErrors(async (req : Request , res : Response , next : NextFunction) => {
	const {userId} = req.params;

	const foundUser = await User.findById(userId);

	if(!foundUser){
		return next(new AppError(statusCodes.BAD_REQUEST , "User not found. (to fetch the liked tweets)."));
	}

	const foundTweets = await Tweet.find({_id : {$in : foundUser.likedTweets}});

	return res.status(statusCodes.OK).json({
		success : true,
		message : "Liked Tweets fetched.",
		foundTweets
	})
})