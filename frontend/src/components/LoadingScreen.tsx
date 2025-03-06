export default function LoadingScreen(){
	setTimeout(() => {
		const loadingScreen = document.getElementById('loadingScreen');
		if(loadingScreen) loadingScreen.remove();
	} , 700)

	return (
			<div className="bg-black flex justify-center items-center h-screen w-screen" id="loadingScreen">
				<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/900px-X_logo.jpg" alt="Twitter Logo" className="w-24 LoadingScreenX" />
		</div>
	)
}