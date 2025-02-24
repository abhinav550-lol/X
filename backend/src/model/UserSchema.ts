import { model, Schema, Document, Types, Model } from "mongoose";
import AppError from "../error/AppError";
import statusCodes from "../utils/statusCodes";

export interface UserInterface extends Document {
	_id : Types.ObjectId,	
  name: string;
  userHandle: string;
  profilePic?: string;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  bio?: string,
  location? : string,
  bannerPic? : string,
  likedTweets : Types.ObjectId[],
  auth: {
    signInType: "Google" | "Session";
    sessionInfo?: {
      password: string;
    };
    googleInfo?: {
      googleId: string;
    };
  },
  createdOn : Number,
  addFollower(userId : Types.ObjectId) : Promise<void>;
  addFollowing(userId : Types.ObjectId) : Promise<void>;
  removeFollower(userId : Types.ObjectId) : Promise<void>;
  removeFollowee(userId : Types.ObjectId) : Promise<void>;
}

interface UserModel extends Model<UserInterface> {
	findByUserHandle(userHandle: string): Promise<UserInterface | null>;
  }

const userSchema = new Schema<UserInterface>(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      maxlength: [50, "Name must not exceed 50 characters."],
    },
    userHandle: {
      type: String,
      required: [true, "User handle is required."],
      unique: true,
    },
    profilePic: {
      type: String,
    },
    following: {
		type : [Schema.Types.ObjectId],
		ref : "User",
		default : []
	},
    followers: {
		type : [Schema.Types.ObjectId],
		ref : "User",
		default : []
	},
	bio : {
		type : String,
	},
	bannerPic : {
		type : String,
	},
	location : {
		type : String,
	},
	likedTweets : {
		type : [Schema.Types.ObjectId],
		ref : 'Tweet',
		default : []
	},
    auth: {
      signInType: {
        type: String,
        enum: ["Google", "Session"],
        required: true,
      },
      sessionInfo: {
        password: {
          type: String,
          required: function (this: any) {
            return this.signInType === "Session";
          },
        },
      },
      googleInfo: {
        googleId: {
          type: String,
          required: function (this: any) {
            return this.signInType === "Google";
          },
        },
      },
    },
	createdOn : {
		type : Number,
		default : Date.now()
	}
  }
);

userSchema.statics.findByUserHandle = async function(userHandle : string) : Promise<UserInterface | null>{
	return this.findOne({userHandle});
}

userSchema.methods.addFollower = async function(userId : Types.ObjectId){
	this.followers.push(userId);
	await this.save();
}

userSchema.methods.addFollowing = async function(userId : Types.ObjectId){
	this.following.push(userId);
	await this.save();
}

userSchema.methods.removeFollowee = async function (userId: Types.ObjectId): Promise<void> {
  this.following = this.following.filter((currId: Types.ObjectId) => !currId.equals(userId));
  await this.save();
};


userSchema.methods.removeFollower = async function(userId : Types.ObjectId){
	this.followers = this.followers.filter((currId: Types.ObjectId) => !currId.equals(userId));
	await this.save();
}

const userModel =  model<UserInterface , UserModel>("User", userSchema);

export default userModel;
