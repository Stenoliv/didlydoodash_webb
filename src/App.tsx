import { Route, Routes } from "react-router-dom";
import "./styles/App.css";
import "./styles/MainHeader.css";
import NoMatchPage from "./pages/main/NoMatch";
import DefaultLayout from "./components/layouts/DefaultLayout";
import ProfileLayout from "./components/layouts/ProfileLayout";
import HomePage from "./pages/main/Home";
import ProfilePage from "./pages/main/Profile";
import ProjectLayout from "./components/layouts/ProjectLayout";
import ProjectPage from "./pages/main/Project";
import OrganisationLayout from "./components/layouts/OrganisationLayout";
import OrganisationPage from "./pages/main/Organisation";
import ChatsPage from "./pages/main/Organisation/Chats";
import CreateProjectPage from "./pages/main/Project/Create";
import CompletedProjectsPage from "./pages/main/Project/Completed";
import AuthProvider from "./components/context/AuthContext";
import SigninPage from "./pages/auth/Signin";
import SignupPage from "./pages/auth/Signup";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	return (
		<div className="App">
			<AuthProvider>
				<Routes>
					{/** Public routes */}
					<Route path="/signin" element={<SigninPage />} />
					<Route path="/signup" element={<SignupPage />} />

					{/** Signed in routes */}
					<Route element={<PrivateRoute />}>
						<Route path="/" element={<DefaultLayout />}>
							<Route index element={<HomePage />} />

							{/** Project routes */}
							<Route path="/projects" element={<ProjectLayout />}>
								<Route index element={<ProjectPage />} />
								<Route
									path="/projects/create"
									element={<CreateProjectPage />}
								/>
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
					</Route>
				</Routes>
			</AuthProvider>
		</div>
	);
}

export default App;
