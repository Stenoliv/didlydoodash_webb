import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import "./styles/App.css";
import "./styles/MainHeader.css";

// Components
import PrivateRoute from "./components/PrivateRoute";

// Layouts
import DefaultLayout from "./components/layouts/DefaultLayout";
import MainLayout from "./components/layouts/MainLayout";
import OrganisationLayout from "./components/layouts/OrganisationLayout";
import ProjectLayout from "./components/layouts/ProjectLayout";
import ProfileLayout from "./components/layouts/ProfileLayout";

// Public pages
import SigninPage from "./pages/public/Signin";
import SignupPage from "./pages/public/Signup";
import NoMatchPage from "@/pages/private/NoMatch";

// Private pages
import HomePage from "./pages/private/Home";
import ProfilePage from "./pages/private/profile";
// Organisation
import OrganisationPage, { dataLoader } from "./pages/private/organisation";
import ChatsPage from "./pages/private/organisation/Chats";
// Projects
import ProjectPage from "./pages/private/project";
import ProjectView from "./pages/private/project/ProjectView";
import CreateProjectPage from "./pages/private/project/Create";
import CompletedProjectsPage from "./pages/private/project/Completed";

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
