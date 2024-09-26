import { Outlet } from "react-router-dom";
import AuthProvider from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";

export default function DefaultLayout() {
	return (
		<>
			<AuthProvider>
				<ToastContainer />
				<Outlet />
			</AuthProvider>
		</>
	);
}
