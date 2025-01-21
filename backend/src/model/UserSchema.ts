import {model, Schema } from 'mongoose'

interface userInterface{
	name : string,
	userHandle : string,
	profilePic : string,
	following : number,
	followers : number,
	registerDate : Date,
	//tweets media replies linked   	
}

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
		type: Number, 
		default : 0,
	},
	followers : {
		type : Number, 
		default : 0,
	},
})

export default model<userInterface>('User' , userSchema);