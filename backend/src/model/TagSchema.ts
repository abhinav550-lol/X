import {model , Schema } from 'mongoose'

interface tagInterface{
	keyword : string,
	frequency? : number,
};

const tagSchema = new Schema<tagInterface>({
	keyword : {
		type : String,
		required : [true, "A hash keyword is required."] ,
	},
	frequency : {
		type : Number,
		default: 1
	}
})

tagSchema.statics.createOrUpdateTag = async function(key : string) : Promise<void>{
	const foundTag = await this.findOne({keyword : key});

	if(!foundTag){
		await this.create({keyword : key});
	}else{
		foundTag.frequency++;
		await foundTag.save();
	}
}

export default  model<tagInterface>('Tag' , tagSchema);
