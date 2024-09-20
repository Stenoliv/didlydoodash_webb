import React from "react";
import { Outlet } from "react-router-dom";

export default function ProjectLayout() {
	return (
		<>
			<div>Projects</div>
			<Outlet />
		</>
	);
}
