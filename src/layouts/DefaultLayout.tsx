import { Outlet } from "react-router-dom";
import AuthProvider from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DefaultLayout() {
	return (
		<>
			<AuthProvider>
				<ToastContainer
					limit={8}
					theme="colored"
					autoClose={2500}
					closeOnClick
				/>
				<Outlet />
			</AuthProvider>
		</>
	);
}
