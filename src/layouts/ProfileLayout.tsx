import { Outlet } from "react-router-dom";

export default function ProfileLayout() {
	return (
		<>
			<div>Profile</div>
			<Outlet />
		</>
	);
}
