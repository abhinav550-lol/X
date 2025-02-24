import wrapAsyncErrors from "../error/wrapAsyncErrors";
import Comment, { CommentInterface } from "../model/CommentSchema";
import Tweet, { tweetInterface } from "../model/TweetSchema";
import User, { UserInterface } from "../model/UserSchema";
import statusCodes from "../utils/statusCodes";
import AppError from "../error/AppError";
import { issueNotification } from "./notificationController";
import { Types } from "mongoose";

export const postComment =  wrapAsyncErrors(async (req , res , next) => {
	const { tweetId  } = req.params; // replied user

	if( !tweetId){
		return next(new AppError(statusCodes.BAD_REQUEST , "Please fill all the required fields in the query body."));
	}

	const userId = (req.user || req.session.user) as string;

	const foundTweet = await Tweet.findById(tweetId);

	if(!foundTweet){
		return next(new AppError(  statusCodes.BAD_REQUEST , "Tweet not found, to add a comment."));
	}

	const {text}  = req.body as {text : string};
	text.trim();

	if(!text){
		return next(new AppError(statusCodes.BAD_REQUEST , "Please provide text for the comment."))
	}
	
	const createdComment = await Comment.create({
		text,
		postedBy : userId,
		tweetId,
	})

	const foundUser = await User.findById(foundTweet.postedBy) as UserInterface;
	await issueNotification('commented' , new Types.ObjectId(userId) , foundUser._id , createdComment._id.toString());

	return res.status(statusCodes.CREATED).json({
		success : true,
		message : `Comment posted on ${tweetId}`,
		comment : createdComment
	})
	

})

export const deleteComment =  wrapAsyncErrors(async (req , res , next) => {
	const {commentId} = req.params;

	const foundComment : CommentInterface | null = await Comment.findById(commentId);

	if(!foundComment){
		return next(new AppError(statusCodes.BAD_REQUEST , "Comment to delete not found."));
	}

	const userId = req.user || req.session.user;

	if(userId !== foundComment.postedBy.toString()){
		console.log(1)
		return next(new AppError(statusCodes.BAD_REQUEST , "You cannot delete this comment. (NOT THE USER WHO POSTED IT)"))
	}

	foundComment.text = "";
	foundComment.isDeleted = true;
	//@ts-ignore
	await foundComment.save();

	return res.status(statusCodes.OK).json({
		success : true,
		message : "Comment Deleted."
	})
})

export const editComment = wrapAsyncErrors(async (req , res , next) => {
	const {commentId} = req.params;

	const foundComment : CommentInterface | null = await Comment.findById(commentId);

	if(!foundComment){
		return next(new AppError(statusCodes.BAD_REQUEST , "Comment to delete not found."));
	}

	const userId = req.user || req.session.user;

	if(userId !== foundComment.postedBy.toString()){
		return next(new AppError(statusCodes.BAD_REQUEST , "You cannot edit this comment. (NOT THE USER WHO POSTED IT)"))
	}

	const {text}  = req.body as {text : string};
	text.trim();

	if(!text){
		return next(new AppError(statusCodes.BAD_REQUEST , "Please provide text for the comment."))
	}

	foundComment.text = text;
	//@ts-ignore
	await foundComment.save();

	return res.status(statusCodes.OK).json({
		success : true,
		message : "Comment edited.",
		comment: foundComment
	})
})

export const replyToComment = wrapAsyncErrors(async (req , res , next) => {
	const { userId :r_userId , tweetId} = req.query;
	const { commentId} = req.params;

	const foundComment : CommentInterface | null = await Comment.findById(commentId);

	if(!foundComment){
		return next(new AppError(statusCodes.BAD_REQUEST , "Comment to delete not found."));
	}

	const userId = req.user || req.session.user;

	const foundUser_r = await User.findById(r_userId);

	if(!foundUser_r){
		return next(new AppError(statusCodes.BAD_REQUEST , "User to be replied not found." ));
	}

	const {text}  = req.body as {text : string};
	text.trim();

	if(!text){
		return next(new AppError(statusCodes.BAD_REQUEST , "Please provide text for the comment."))
	}

	
	const createdComment = await Comment.create({
		text,
		postedBy : new Types.ObjectId(userId as string),
		repliedTo : foundUser_r,
		tweetId,
	})

	return res.status(statusCodes.CREATED).json({
		success : true,
		message : `Comment posted on ${tweetId}`,
		comment : createdComment
	})
})

export const fetchTweetComments = wrapAsyncErrors(async (req , res , next) => {
	const {tweetId} = req.params;

	const foundTweet : tweetInterface | null  = await Tweet.findById(tweetId);

	if(!foundTweet){
		return next(new AppError(statusCodes.BAD_REQUEST , "Tweet not found to fetch comments."));
	}

	const allComments = await Comment.find({tweetId });

	return res.status(statusCodes.OK).json({
		success : true,
		message : allComments.length === 0 ? "No comments found" : "Here's are all the found comments",
		comments : allComments
	})
})