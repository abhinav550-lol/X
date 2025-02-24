import {Collection, Model, Schema , Types, model} from 'mongoose'
import AppError from '../error/AppError';
import statusCodes from '../utils/statusCodes';

export interface tweetInterface {
	 _id : Types.ObjectId,	
	 createdOn: Number;
	text?: string;
	postedBy: Types.ObjectId;
	media?: Types.ObjectId; 
	comments?: Types.ObjectId[];
	likedBy: Types.ObjectId[];
	tweetType: string;
	retweetId?: string;
  }

  interface tweetModel extends Model<tweetInterface>{
	findTweetsByUserId(userId: string) : Promise<Collection<tweetInterface> | null>;
  }

const tweetSchema = new Schema<tweetInterface>({
	postedBy : {
		type : Schema.Types.ObjectId,
		required : [true , "The user who posted the tweet must be specified."]
	},
	text : {
		type : String,
		maxlength : 200,
	},
	media : {
		type : Schema.Types.ObjectId,
		ref : 'Media',
	},
	comments : {
		type : [Schema.Types.ObjectId],
		ref : 'Comment',
		default : [],
	},
	likedBy : {
		type : [Schema.Types.ObjectId],
		ref : 'User',
		default : [],
	},
	tweetType : {
		type : String,
		enum : ['Tweet' , 'Retweet'],
		required : [true , "Please provide the tweet type. "],
	},
	retweetId : {
		type : Schema.Types.ObjectId,
		ref : 'Tweet',
		required : [function(this : any){
			return this.tweetType === 'Retweet' 
		}, "Please provide the tweet id to retweet."]
	},
	createdOn : {
		type : Number,
		default :Date.now()
	}
});


tweetSchema.pre('save', function (next) {
  if (!this.text && !this.media) {
    return next(new AppError(statusCodes.BAD_REQUEST , "Please provide content for the tweet.")); 
  }

  if(this.tweetType === 'Retweet' && !this.retweetId){
	return next(new AppError(statusCodes.BAD_REQUEST, "Please provide with the retweet id."))
  }
  next(); 
});


tweetSchema.statics.findTweetsByUserId = async function(userId : string){
	return this.find({ postedBy: userId });
}
  
export default model<tweetInterface , tweetModel>('Tweet' , tweetSchema);