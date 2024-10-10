import { useProjectStore } from "@/stores/projects";
import ProjectsList from "@/components/projects/list/ProjectsList";

import "./completedpage.css";

export default function ProjectPage() {
	const { completed } = useProjectStore();

	return (
		<div>
			<div>
				<h2>Completed projects:</h2>
				<ProjectsList projects={completed()} />
			</div>
		</div>
	);
}
