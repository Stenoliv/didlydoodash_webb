import { useProjectStore } from "@/stores/projects";
import ProjectsList from "@/components/projects/list/ProjectsList";

import "./archivedpage.css";

export default function ArchivedProjectPage() {
	const { archived } = useProjectStore();

	return (
		<div>
			<div>
				<h2>Active projects:</h2>
				<ProjectsList projects={archived()} />
			</div>
		</div>
	);
}
