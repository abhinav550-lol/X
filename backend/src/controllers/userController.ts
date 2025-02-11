import { NextFunction, Request, Response } from "express";
import wrapAsyncErrors from "../error/wrapAsyncErrors";
import User, { UserInterface } from "../model/UserSchema";
import AppError from "../error/AppError";
import statusCodes from "../utils/statusCodes";
import { UploadedFile } from "express-fileupload";
import { uploadFile } from "../utils/fileHandling";

export const getUserProfile = wrapAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userHandle } = req.params;

    const foundUser = User.findOne({ userHandle });

    if (!foundUser) {
      return next(
        new AppError(
          statusCodes.NOT_FOUND,
          `User with ${userHandle} not found.`
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
	  const { id: userHandle } = req.params;
  
	  const foundUser = await User.findOne({ userHandle });
  
	  if (!foundUser) {
		return next(
		  new AppError(
			statusCodes.NOT_FOUND,
			`Cannot edit, User with handle ${userHandle} not found.`
		  )
		);
	  }
  
	  const userId = req.session.user || req.user;
  
	  if (foundUser._id.toString() !== userId) {
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
	const {id : userHandle} = req.params;

	const foundUser = await User.findOne({userHandle});
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
		const {id : followHandle} = req.params;

		const userId = req.user || req.session.user;

		const followeeUser = await User.findOne({userHandle : followHandle}); // who is followed
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
	const {id : userHandle} = req.params;

	const foundUser = await User.findOne({userHandle});
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

export const fetchForYou = wrapAsyncErrors( // at last
  async (req: Request, res: Response, next: NextFunction) => {

  }
);
