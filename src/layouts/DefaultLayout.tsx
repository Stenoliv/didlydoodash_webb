import { Outlet } from "react-router-dom";
import AuthProvider from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

export default function DefaultLayout() {
	return (
		<>
			<AuthProvider>
				<QueryClientProvider client={new QueryClient()}>
					<ToastContainer
						limit={8}
						theme="colored"
						autoClose={2500}
						closeOnClick
					/>
					<Outlet />
				</QueryClientProvider>
			</AuthProvider>
		</>
	);
}
