import { useProjectStore } from "@/stores/projects";

import "./activepage.css";
import ProjectsList from "@/components/projects/list/ProjectsList";

export default function ActiveProjectPage() {
	const { active } = useProjectStore();

	return (
		<div>
			<div className="active-projects">
				<h2>Active projects:</h2>
				<ProjectsList projects={active()} />
			</div>
		</div>
	);
}
