import { Project } from "@/utils/types";
import "./projectitem.css";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "@/stores/projects";
import MemberItem from "../member/item/MemberItem";

export interface ProjectItemProps {
	project: Project;
}

export default function ProjectItem(props: ProjectItemProps) {
	const { setProject } = useProjectStore();
	const navigate = useNavigate();
	const { project } = props;

	// Extract project values
	const { id, name, members, status } = project;

	const handleSelectProject = () => {
		navigate(`/projects/${id}`);
		setProject(project);
	};

	return (
		<div className="project-container" onClick={handleSelectProject}>
			<h2>{name}</h2>
			<div>
				<div className="texts">
					<span>
						Status: <strong className={status.toLowerCase()}>{status}</strong>
					</span>
					<span>Members:</span>
					<div className="project-members">
						{members &&
							Array.isArray(members) &&
							members.map((member) => (
								<MemberItem member={member} key={member.user.id} />
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
