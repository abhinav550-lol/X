import { NextFunction, Request, Response } from "express";
import wrapAsyncErrors from "../error/wrapAsyncErrors";
import User, { UserInterface } from "../model/UserSchema";
import AppError from "../error/AppError";
import statusCodes from "../utils/statusCodes";
import { UploadedFile } from "express-fileupload";
import { uploadFile } from "../utils/fileHandling";
import Tweet from "../model/TweetSchema";
import { Types } from "mongoose";

export const getUserProfile = wrapAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.params;

	const foundUser = await User.findById(userId);

    if (!foundUser) {
      return next(
        new AppError(
          statusCodes.NOT_FOUND,
          `User with ${userId} not found.`
        )
      );
    }

    return res.status(statusCodes.OK).json({
      success: false,
      message: "User found!",
      user: foundUser,
    });
  }
);

export const editUser = wrapAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id: userId } = req.params;

		const foundUser = await User.findById(userId);
  
	  if (!foundUser) {
		return next(
		  new AppError(
			statusCodes.NOT_FOUND,
			`Cannot edit, User with handle ${userId} not found.`
		  )
		);
	  }
	  
	  const loggedInUser = req.user || req.session.user;
  
	  if (foundUser._id.toString() !== loggedInUser) {
		return next(
		  new AppError(statusCodes.UNAUTHORIZED, "You cannot edit this profile.")
		);
	  }
  
	  const { name, bio, location } = req.body;
  
	  let profilePicPath: string | undefined;
	  let bannerPicPath: string | undefined;
  
	  if (req.files) {
		const profilePic = req.files.profilePic as UploadedFile;
		const bannerPic = req.files.bannerPic as UploadedFile;
  
		if (profilePic) {
		  profilePicPath = uploadFile(profilePic, foundUser._id.toString()) as string;
		}
		if (bannerPic) {
		  bannerPicPath = uploadFile(bannerPic, foundUser._id.toString()) as string;
		}
	  }

	  if(!name && !bio && !location && !profilePicPath && !bannerPicPath){
		return next(new AppError(statusCodes.BAD_REQUEST , "Nothing to update!"));
	  }
  
	  const updateData: Partial<UserInterface> = {};
	  if (name) updateData.name = name;
	  if (bio) updateData.bio = bio;
	  if (location) updateData.location = location;
	  if (profilePicPath) updateData.profilePic = profilePicPath;
	  if (bannerPicPath) updateData.bannerPic = bannerPicPath;
  
	  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
		new: true,
		runValidators: true,
	  });
  
	  return res.status(statusCodes.OK).json({
		success: true,
		message: "User updated successfully.",
		user : updatedUser
	  });
	}
  );


export const followUser = wrapAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
		const {id : followHandle} = req.params;

		const userId = req.user || req.session.user;

		const followeeUser = await User.findOne({userHandle : followHandle});
		const followerUser = await User.findById(userId);

		if(!followeeUser || !followerUser){
			return next(new AppError(statusCodes.BAD_REQUEST , "The user to be followed is not found."));
		}

		followeeUser.addFollower(followerUser._id);
		followerUser.addFollowing(followeeUser._id);
		
		return res.status(statusCodes.OK).json({
			success : true,
			message: "User followed successfully.",
		})
  }
);

export const getFollowers = wrapAsyncErrors(async (req : Request , res : Response , next : NextFunction) => {
	const {id : userId} = req.params;

	const foundUser = await User.findById(userId);
	if(!foundUser){
		return next(new AppError(statusCodes.BAD_REQUEST , "User not found."))
	}

	const followers = await User.find({ _id: { $in: foundUser.followers } })
	.select("profilePic userHandle name bio");
  
	return res.status(statusCodes.OK).json({
		success : true,
		message: "User followers fetched successfully.",
		followers
	})
})

export const unfollowUser = wrapAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		const {id : followeeId} = req.params;

		const userId = req.user || req.session.user;

		const followeeUser = await User.findById(followeeId); // who is followed
		const followerUser = await User.findById(userId); // who follows

		if(!followeeUser || !followerUser){
			return next(new AppError(statusCodes.BAD_REQUEST , "The user to be followed is not found."));
		}
		
		if(!followerUser.following.includes(followeeUser._id)){
			return next(new AppError(statusCodes.BAD_REQUEST, "The user cannot be unfollowed."));
		}

		followeeUser.removeFollower(followerUser._id);
		followerUser.removeFollowee(followeeUser._id);

		return res.status(statusCodes.OK).json({
			success : true,
			message : "User unfollowed successfully.",
		})
	}
);

export const getFollowing = wrapAsyncErrors(async (req : Request , res : Response , next : NextFunction) => {
	const {id : userId} = req.params;

	const foundUser = await User.findById(userId);
	if(!foundUser){
		return next(new AppError(statusCodes.BAD_REQUEST , "User not found."))
	}

	const following = await User.find({ _id: { $in: foundUser.following } })
	.select("profilePic userHandle name bio");
  
	return res.status(statusCodes.OK).json({
		success : true,
		message: "User following fetched successfully.",
		following
	})
})

export const fetchForYou = wrapAsyncErrors( 
  async (req: Request, res: Response, next: NextFunction) => {
	const {id : userId} = req.params;

	const foundUser = await User.findById(userId);

	if(!foundUser){
		return next(new AppError(statusCodes.BAD_REQUEST , "User not found, (to fetch for you)."))
	}

	const foundTweets = await Tweet.find({$and : [
		{createdOn : {$gte : Date.now() - 86400000}},
		{postedBy : {$in : foundUser.following}}
	]}).limit(25);

	const remainingTweets = await Tweet.find({createdOn : {$gte : Date.now() - (86400000*7)}}).limit(25 - foundTweets.length);

	const allTweets = foundTweets.concat(remainingTweets);

	return res.status(statusCodes.OK).json({
		success : true,
		message : "For you fetched.",
		forYouTweets : allTweets 
	})
  }
);


export const fetchFollowSuggestions = wrapAsyncErrors(async(req :Request , res : Response , next : NextFunction) => {
	const {id : userId} = req.params;;
	const foundUserFollowing = await User.findById(userId).select('following').populate('following').lean(); //following 

	let suggestions : UserInterface[] = [];
	if(!foundUserFollowing){
		const randomSuggestions = await User.aggregate([{$sample : {size : 5}}]);
		suggestions = randomSuggestions;
	}else{	
		//to find following suggestion from the user following's following
		//@ts-ignore
		const possibleSuggestions = foundUserFollowing.following.flatMap((userFollowing)=> userFollowing.following);
		console.log(possibleSuggestions);
		let queryArray : Types.ObjectId[];
		if(possibleSuggestions.length <= 5){
			queryArray = possibleSuggestions;
		}else{
			possibleSuggestions.sort(() => Math.random() - 0.5);
			queryArray = possibleSuggestions.slice(0, 5);
		}

		suggestions = await User.find({$in : queryArray});

	}
		return res.status(statusCodes.OK).json({
			success : true,
			message : "Here are some follow suggestions.",
			followSuggestions : suggestions
		})
})