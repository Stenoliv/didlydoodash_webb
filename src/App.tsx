import { Route, Routes } from "react-router-dom";
import "./styles/App.css";
import "./styles/MainHeader.css";
import NoMatchPage from "./components/pages/nomatch";
import DefaultLayout from "./components/layouts/DefaultLayout";
import HomePage from "./components/pages/home";
import LoginPage from "./components/pages/login";
import RegisterPage from "./components/pages/register";
import MainSideBar from "./components/SideBar";

function App() {
	return (
		<div className="App">
			<MainSideBar />
			<main>
				<Routes>
					<Route path="/" element={<DefaultLayout />}>
						<Route index element={<HomePage />} />
						<Route path="/signin" element={<LoginPage />} />
						<Route path="/signup" element={<RegisterPage />} />
						<Route path="*" element={<NoMatchPage />} />
					</Route>
				</Routes>
			</main>
		</div>
	);
}

export default App;
