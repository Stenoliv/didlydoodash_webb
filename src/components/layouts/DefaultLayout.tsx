import { Link, Outlet } from "react-router-dom";
import MainSideBar from "@/components/SideBar";

export default function DefaultLayout() {
	return (
		<>
			<MainSideBar />
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
