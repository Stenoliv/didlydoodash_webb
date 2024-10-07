import { Outlet } from "react-router-dom";
import SideBar from "@/components/sideBar/SideBar";
import NavBar from "@/components/navBar/NavBar";

export default function MainLayout() {
	return (
		<>
			<NavBar />
			<div className="main-container">
				<SideBar />
				<div className="page-container">
					<Outlet />
				</div>
			</div>
		</>
	);
}
