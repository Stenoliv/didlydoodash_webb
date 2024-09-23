import { Outlet } from "react-router-dom";
import AuthProvider from "../context/AuthContext";

export default function DefaultLayout() {
	return (
		<>
			<AuthProvider>
				<Outlet />
			</AuthProvider>
		</>
	);
}
