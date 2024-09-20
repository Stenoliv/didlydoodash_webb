import { Route, Routes } from "react-router-dom";
import "./styles/App.css";
import "./styles/MainHeader.css";
import NoMatchPage from "./pages/nomatch";
import DefaultLayout from "./components/layouts/DefaultLayout";
import ProfileLayout from "./components/layouts/ProfileLayout";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MainSideBar from "./components/SideBar";
import ProfilePage from "./pages/profile";
import ProjectLayout from "./components/layouts/ProjectLayout";
import ProjectPage from "./pages/project";
import OrganisationLayout from "./components/layouts/OrganisationLayout";
import OrganisationPage from "./pages/organisation";
import ChatsPage from "./pages/organisation/chats";
import CreateProjectPage from "./pages/project/create";
import CompletedProjectsPage from "./pages/project/completed";

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

						{/** Project routes */}
						<Route path="/projects" element={<ProjectLayout />}>
							<Route index element={<ProjectPage />} />
							<Route path="/projects/create" element={<CreateProjectPage />} />
							<Route
								path="/projects/completed"
								element={<CompletedProjectsPage />}
							/>
						</Route>

						{/** Organisation routes */}
						<Route path="/organisations" element={<OrganisationLayout />}>
							<Route index element={<OrganisationPage />} />
							<Route path="/organisations/chats" element={<ChatsPage />} />
						</Route>

						{/** Profile routes */}
						<Route path="/profile" element={<ProfileLayout />}>
							<Route index element={<ProfilePage />} />
						</Route>
						<Route path="*" element={<NoMatchPage />} />
					</Route>
				</Routes>
			</main>
		</div>
	);
}

export default App;
