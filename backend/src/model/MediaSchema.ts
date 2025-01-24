import {model , Schema} from 'mongoose'

interface MediaInterface{
	mediaAddress : string,
	userId : Schema.Types.ObjectId,
	tweetId : Schema.Types.ObjectId,
	type : string,
};

const mediaSchema = new Schema<MediaInterface>({
	mediaAddress : {
		type : String,
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
	type : {
		type : String,
		enum : ['Video' , 'Image' ],
		required : [true, 'Please provide media type.']
	}
}, {timestamps : true});

mediaSchema.index({ userId: 1 });
mediaSchema.index({ tweetId: 1 });


export default model<MediaInterface>('Media' , mediaSchema);