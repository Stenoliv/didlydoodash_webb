import { Project } from "@/utils/types";
import "./projectlist.css";
import ProjectItem from "../item/ProjectItem";

export interface ProjectsListProps {
	projects: Project[];
}

export default function ProjectsList(props: ProjectsListProps) {
	const { projects } = props;

	return (
		<div className="grid-projects">
			{projects.map((project) => (
				<ProjectItem key={project.id} project={project} />
			))}
		</div>
	);
}
