import { Outlet } from "react-router-dom";
import AuthProvider from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import NotificationProvider from "@/context/NotificationContext";

export default function DefaultLayout() {
	const darkTheme = createTheme({
		palette: {
			mode: "dark",
		},
	});

	return (
		<>
			<AuthProvider>
				<NotificationProvider>
					<QueryClientProvider client={new QueryClient()}>
						<ThemeProvider theme={darkTheme}>
							<CssBaseline />
							<ToastContainer
								limit={8}
								theme="colored"
								autoClose={2500}
								closeOnClick
							/>
							<Outlet />
						</ThemeProvider>
					</QueryClientProvider>
				</NotificationProvider>
			</AuthProvider>
		</>
	);
}
