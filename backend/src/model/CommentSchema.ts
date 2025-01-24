import {Schema , model } from 'mongoose'
import statusCodes from '../utils/statusCodes';
import AppError from '../error/AppError';

interface CommentInterface{
	tweetId : Schema.Types.ObjectId, // posted at 
	repliedTo? : Schema.Types.ObjectId, // replied to
	userId : Schema.Types.ObjectId, // posted by 
	likes : number,
	text : string,
	isReply : boolean
};


const commentSchema = new Schema<CommentInterface>({
	tweetId : {
		type : Schema.Types.ObjectId,
		ref : 'Tweet',
		required: [true, "Please give the tweet id to add comment."],
	},
	userId : {
		type : Schema.Types.ObjectId,
		ref : 'User',
		required : [true, "Please enter the user id."]	
	},
	repliedTo : {
		type : Schema.Types.ObjectId,
		ref : 'User'
	},
	likes : {
		type : Number,
		default : 0,
	},
	text : {
		type : String,
		required : [true , "Please enter the comment text."], 
		max: [300, "The comment must not exceed 300 charecters."]
	},
	isReply : {
		type : Boolean,
		default : false
	}
});

commentSchema.pre('validate', function (next){
	if(this.isReply && !this.repliedTo){
		return next(new AppError(statusCodes.BAD_REQUEST , 'Please add the reply target user.'));
	}
	next();
})

export default model<CommentInterface>('Comment' , commentSchema);