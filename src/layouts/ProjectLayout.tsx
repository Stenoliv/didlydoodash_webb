import { Outlet } from "react-router-dom";

export default function ProjectLayout() {
	return (
		<>
			<div>
				<p>Projects</p>
			</div>
			<Outlet />
		</>
	);
}
