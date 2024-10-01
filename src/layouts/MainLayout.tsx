import { Outlet } from "react-router-dom";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/NavBar";

export default function MainLayout() {
	return (
		<>
			<NavBar />
			<main>
				<SideBar />
				<div className="main-layout">
					<Outlet />
				</div>
			</main>
		</>
	);
}
