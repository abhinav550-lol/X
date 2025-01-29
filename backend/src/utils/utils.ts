export function userHandleGenerater(name : string) : string{ 
	let salt : string = "";
	for(let i = 0 ; i < 7 ; i++){
		const it : number = Math.floor(Math.random() * 10);
		salt += it.toString();
	}
	return` ${name}-${salt}`
}

