import {Schema , model } from 'mongoose'

interface CommentInterface{
	tweetId : Schema.Types.ObjectId, // posted at 
	repliedTo : Schema.Types.ObjectId, // replied to
	userId : Schema.Types.ObjectId, // posted by 
	likes : number,
	text : string,
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
		ref : 'User',
		required :  [true, "Please enter the user id that is being replied to."]	
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
}, {timestamps : true});

export default model<CommentInterface>('Comment' , commentSchema);