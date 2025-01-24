import {model, Schema } from 'mongoose'


interface userInterface{
	name : string,
	userHandle : string,
	profilePic? : string,
	following : Schema.Types.ObjectId[],
	followers :  Schema.Types.ObjectId[],
	registerDate : Date,
	auth : {
		signInType :string,
		sessionInfo : {
			password : string
		}
	}	
}
``
const userSchema = new Schema<userInterface>({
	name : {
		type : String,
		required : [true, 'Name is required.'],
		maxlength : [50 , 'Name must not exceed 50 charecters.']
	},
	userHandle : {
		type : String,
		required : [true , 'User handle is required.'],
		unique : [true, 'Please enter a unique user handle.']
	},
	profilePic : {
		type : String,
	},
	following : {
		type:  [Schema.Types.ObjectId], 
		ref : 'User'
	},
	followers : {
		type :  [Schema.Types.ObjectId], 
		ref : 'User'
	},
	auth : {
		select : false,
		signInType : {
			type : String,
			enum : ["Google" , "Session"]
		},
		sessionInfo : {
			password : {
				type : String,
				required : [function(this : any){
					return this.auth.signInType === "Session"; 
				} , "Please enter a password."],
			}
		}
	},
	registerDate:{
		type : Date,
		default: Date.now
	}
})

export default model<userInterface>('User' , userSchema);