import {Schema , Types, model } from 'mongoose'

export interface CommentInterface{
	 _id : Types.ObjectId,	
	tweetId : Schema.Types.ObjectId, // posted at 
	repliedTo? : Schema.Types.ObjectId, // replied to
	postedBy : Schema.Types.ObjectId, // posted by
	text : string,
	createdOn : Number,
	isDeleted : Boolean,
};


const commentSchema = new Schema<CommentInterface>({
	tweetId : {
		type : Schema.Types.ObjectId,
		ref : 'Tweet',
		required: [true , "Please give the tweet id to add comment."],
	},
	postedBy : {
		type : Schema.Types.ObjectId,
		ref : 'User',
		required : [true, "Please enter the user id."]	
	},
	repliedTo : {
		type : Schema.Types.ObjectId,
		ref : 'User',
	},
	text : {
		type : String,
		required : [function(this){
			return (
			!this.isDeleted)
		} , "Please enter the comment text."], 
		max: [300, "The comment must not exceed 300 charecters."]
	},
	createdOn : {
		type : Number,
		default :Date.now()
	},
	isDeleted : {
		type : Boolean,
		default : false
	}
});

export default model<CommentInterface>('Comment' , commentSchema);