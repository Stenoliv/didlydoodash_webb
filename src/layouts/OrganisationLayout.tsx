import { Outlet } from "react-router-dom";
import "@/styles/organistaionLayout.css";

export default function OrganisationLayout() {
	return (
		<>
			<div className="header-organisation">
				<p>Organisation</p>
			</div>
			<Outlet />
		</>
	);
}
