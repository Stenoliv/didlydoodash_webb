import { Link, Outlet } from "react-router-dom";
import SideBar from "@/components/SideBar";
import "@/styles/MainHeader.css";

export default function MainLayout() {
	return (
		<>
			<SideBar />
			<main>
				<header className="header">
					<Link to={"/"}>
						<h1 className="header-name">DidlydooDash</h1>
					</Link>
				</header>
				<Outlet />
			</main>
		</>
	);
}
