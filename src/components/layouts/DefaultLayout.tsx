import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function DefaultLayout() {
	return (
		<>
			<header className="header">
				<Link to={"/"}>
					<h1 className="header-name">DidlydooDash</h1>
				</Link>
			</header>
			<main>
				<Outlet />
			</main>
		</>
	);
}
