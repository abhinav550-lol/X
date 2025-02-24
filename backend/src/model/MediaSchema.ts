import {model , Schema, Types} from 'mongoose'

export interface MediaInterface{
	 _id : Types.ObjectId,	
	mediaAddress : string[],
	userId : Schema.Types.ObjectId,
	tweetId : Schema.Types.ObjectId,
	createdOn : Number,
};

const mediaSchema = new Schema<MediaInterface>({
	mediaAddress : {
		type : [String],
		required : [true, 'Please provide a valid address for the media.']
	},
	userId : {
		type : Schema.Types.ObjectId,
		ref : "User",
		required : true,
	},
	tweetId : {
		type : Schema.Types.ObjectId,
		ref : 'Tweet',
		required : true,
	},
	createdOn : {
		type : Number,
		default :Date.now()
	}
});

mediaSchema.index({ userId: 1 });
mediaSchema.index({ tweetId: 1 });


export default model<MediaInterface>('Media' , mediaSchema);