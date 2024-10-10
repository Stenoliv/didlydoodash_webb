import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import "./styles/App.css";

// Components
import PrivateRoute from "./components/PrivateRoute";

// Layouts
import DefaultLayout from "@/layouts/DefaultLayout";
import MainLayout from "@/layouts/MainLayout";
import OrganisationLayout from "@/layouts/OrganisationLayout";
import ProjectLayout from "@/layouts/ProjectLayout";
import ProfileLayout from "@/layouts/ProfileLayout";
import WhiteboardLayout from "@/layouts/WhiteboardLayout";

import NoMatchPage from "@/pages/private/NoMatch";
// Public pages
import SigninPage from "@/pages/public/Signin";
import SignupPage from "@/pages/public/Signup";
import ForgotPasswordPage from "@/pages/public/ForgotPassword";

// Private pages
import HomePage from "@/pages/private/Home";
import ProfilePage from "@/pages/private/profile";

// Organisation
import OrganisationPage from "@/pages/private/organisations";
import CreateOrganisationPage from "./pages/private/organisations/CreateOrganisation";
import ChatsPage from "@/pages/private/organisations/chats";

// Projects
import ProjectView from "@/pages/private/project";
import CreateProjectPage from "@/pages/private/project/createdPage";
import ActiveProjectPage from "@/pages/private/project/activePage";
import ArchivedProjectPage from "@/pages/private/project/archivedPage";
import CompletedProjectsPage from "@/pages/private/project/completedPage";

// Whiteboard
import WhiteboardPage from "./pages/private/whiteboard";

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route element={<DefaultLayout />}>
				{/** Public routes */}
				<Route path="/signin" element={<SigninPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/forgot" element={<ForgotPasswordPage />} />

				{/** Authenticated routes */}
				<Route element={<PrivateRoute />}>
					<Route element={<MainLayout />}>
						<Route index element={<HomePage />} />

						{/** Project routes */}
						<Route path="/projects" element={<ProjectLayout />}>
							<Route index element={<ActiveProjectPage />} />
							{/** View a project */}
							<Route path=":projectID" element={<ProjectView />} />
							<Route path="archived" element={<ArchivedProjectPage />} />
							<Route path="create" element={<CreateProjectPage />} />
							<Route path="completed" element={<CompletedProjectsPage />} />
						</Route>

						{/** Whiteboard routes */}
						<Route path="/whiteboard" element={<WhiteboardLayout />}>
							<Route index element={<WhiteboardPage />} />
						</Route>

						{/** Organisation routes */}
						<Route path="/organisations" element={<OrganisationLayout />}>
							<Route index element={<OrganisationPage />} />
							<Route path="create" element={<CreateOrganisationPage />} />
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
