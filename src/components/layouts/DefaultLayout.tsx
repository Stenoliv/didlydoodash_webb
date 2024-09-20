import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function DefaultLayout() {
	return (
		<>
			<header className="header">
				<Link to={"/"}>
					<h1 className="header-name">Didlydoodash</h1>
				</Link>
				<nav className="header-nav">
					<li>
						<Link to={"/signin"}>Login</Link>
					</li>
					<li>
						<Link to={"/signup"}>Register</Link>
					</li>
				</nav>
			</header>
			<main>
				<Outlet />
			</main>
		</>
	);
}
