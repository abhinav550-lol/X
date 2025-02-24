import {model , Schema, Types} from 'mongoose'

// likes , retweeted , commented , posted
export interface NotificationInterface{
	 _id : Types.ObjectId,	
	senderId : Schema.Types.ObjectId,
	receiverId : Schema.Types.ObjectId,
	_for : string,
	targetLink :String, //tweetId , retweetId , tweetId , tweetId
	isRead? : boolean,
	createdOn : Number,
};

const notificationSchema = new Schema<NotificationInterface>({
	senderId : {
		type : Schema.Types.ObjectId,
		ref : "User",
		required : [true , "Please provide the sender id."]
	},
	receiverId : {
		type : Schema.Types.ObjectId,
		ref : "User",
		required : [true , "Please provide the reciever id."]
	},
	_for : {
		type : String,
		required : true,
		enum : ['liked' , 'retweeted' , 'commented' , 'posted']
	},
	targetLink : {
		type : String,
		required : true,	
	},
	isRead : {
		type : Boolean,
		default : false,
	},
	createdOn : {
		type : Number,
		default :Date.now()
	},
});

notificationSchema.index({ receiverId: 1, isRead: 1 });

export default model<NotificationInterface>('Notification' , notificationSchema);