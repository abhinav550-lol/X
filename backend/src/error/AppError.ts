class AppError extends Error{
	public readonly status: number;
	public readonly name: string;
	constructor(status:number , message:string){
		super(message)
		this.status = status
		this.name = this.constructor.name
	}
}

export default AppError;