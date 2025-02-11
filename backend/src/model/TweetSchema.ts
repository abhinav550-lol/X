import {Schema , Types, model} from 'mongoose'
import AppError from '../error/AppError';
import statusCodes from '../utils/statusCodes';

interface tweetInterface {
	 _id : Types.ObjectId,	
	postedOn: Date;
	text?: string;
	postedBy: Schema.Types.ObjectId;
	media?: Schema.Types.ObjectId[]; 
	comments?: Schema.Types.ObjectId[];
	likedBy: Schema.Types.ObjectId[];
	tweetType: string;
	retweetId?: string;
  }

const tweetSchema = new Schema<tweetInterface>({
	postedBy : {
		type : Schema.Types.ObjectId,
		ref : 'User',
		required : [true , "The user who posted the tweet must be specified."]
	},
	text : {
		type : String,
	},
	media : {
		type : [Schema.Types.ObjectId],
		ref : 'Media',
		default : [],
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
	}
}, {timestamps : true});


tweetSchema.pre('validate', function (next) {
  if (!this.text && (this.media && this.media.length === 0)) {
    return next(new AppError(statusCodes.BAD_REQUEST , "Please provide content for the tweet.")); 
  }

  if(this.tweetType === 'Retweet' && !this.retweetId){
	return next(new AppError(statusCodes.BAD_REQUEST, "Please provide with the retweet id."))
  }
  next(); 
});


  
export default model<tweetInterface>('Tweet' , tweetSchema);