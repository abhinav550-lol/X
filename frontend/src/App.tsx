
function App() {
	//const [user, setUser] = useState(null);

	//const getUser = async () => {
	//	try {
	//		const url = `http://localhost:3000/auth/login/success`;
	//		const { data } = await axios.get(url, { withCredentials: true });
	//		setUser(data.user._json);
	//		console.log(user)
	//		console.log(data.user._json)
	//	} catch (err) {
	//		console.log(err);
	//	}
	//};

	//useEffect(() => {
	//	getUser();
		
	//}, []);

	function handleClick(){
		window.open( "http://localhost:3000/auth/login/google" , "_blank");
	}
	return (
		<div>

			<button onClick={handleClick}>Google SignIn</button>
		</div>
	)
}

export default App
