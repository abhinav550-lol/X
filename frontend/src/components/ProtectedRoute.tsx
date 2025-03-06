import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
interface props{
	isAuth : boolean
} 


export default function ProtectedRoute({ isAuth }: { isAuth: boolean }) {
	useEffect(() => {
	  if (!isAuth) {
		toast("Please log in!");
	  }
	}, [isAuth]); // Run only when `isAuth` changes
  
	return isAuth ? <Outlet /> : (
	  <>
		<ToastContainer />
		<Navigate to="/" replace />
	  </>
	);
  }