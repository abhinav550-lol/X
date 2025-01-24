import {model , Schema} from 'mongoose'

// likes , retweeted , commented , posted
interface NotificationInterface{
	senderId : Schema.Types.ObjectId,
	receiverId : Schema.Types.ObjectId,
	for : string,
	targetLink : Schema.Types.ObjectId, //tweetId , retweetId , tweetId , tweetId
	isRead? : boolean
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
	for : {
		type : String,
		required : true,
		enum : ['liked' , 'retweeted' , 'commented' , 'posted']
	},
	targetLink : {
		type : Schema.Types.ObjectId,
		ref : "Tweet",
		required : true,	
	},
	isRead : {
		type : Boolean,
		default : false,
	},
},{ timestamps: true });

notificationSchema.index({ receiverId: 1, isRead: 1 });

export default model<NotificationInterface>('Notification' , notificationSchema);