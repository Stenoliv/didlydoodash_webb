import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
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
import OrganisationPage, { dataLoader } from "./pages/main/Organisation";
import ChatsPage from "./pages/main/Organisation/Chats";
import CreateProjectPage from "./pages/main/Project/Create";
import CompletedProjectsPage from "./pages/main/Project/Completed";
import SigninPage from "./pages/auth/Signin";
import SignupPage from "./pages/auth/Signup";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/layouts/MainLayout";
import ProjectView from "./pages/main/Project/ProjectView";

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route element={<DefaultLayout />}>
				{/** Public routes */}
				<Route path="/signin" element={<SigninPage />} />
				<Route path="/signup" element={<SignupPage />} />

				{/** Authenticated routes */}
				<Route element={<PrivateRoute />}>
					<Route element={<MainLayout />}>
						<Route index element={<HomePage />} />

						{/** Project routes */}
						<Route path="/projects" element={<ProjectLayout />}>
							<Route index element={<ProjectPage />} />
							{/** View a project */}
							<Route path=":projectID" element={<ProjectView />} />
							<Route path="create" element={<CreateProjectPage />} />
							<Route path="completed" element={<CompletedProjectsPage />} />
						</Route>

						{/** Organisation routes */}
						<Route path="/organisations" element={<OrganisationLayout />}>
							<Route index element={<OrganisationPage />} loader={dataLoader} />
							<Route path="chats" element={<ChatsPage />} />
						</Route>

						{/** Profile routes */}
						<Route path="/profile" element={<ProfileLayout />}>
							<Route index element={<ProfilePage />} />
						</Route>
						<Route path="*" element={<NoMatchPage />} />
					</Route>
				</Route>
			</Route>
		)
	);

	return (
		<div className="App">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
