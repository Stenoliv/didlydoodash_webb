import { useProjectStore } from "@/stores/projects";
import { useNavigate } from "react-router-dom";
import MemberItem from "@/components/projects/member/item/MemberItem";
import { useOrgStore } from "@/stores/organisation";

import "./project.css";
import CreateKanban from "@/components/projects/kanban/create/create";
import KanbanList from "@/components/projects/kanban/list/KanbanList";
import CreateWhiteboard from "@/components/projects/whiteboard/create/create";
import WhitebaordList from "@/components/projects/whiteboard/list/WhiteboardList";

export default function ProjectView() {
	const { project } = useProjectStore();
	const { organisation } = useOrgStore();
	const navigate = useNavigate();

	if (!project || !organisation) {
		navigate(-1);
		return;
	}

	return (
		<div className="project-view">
			<div className="project-header">
				<img src="/icons/back.svg" alt="" onClick={() => navigate(-1)} />
				<h2>{project?.name}</h2>
			</div>
			<div className="project-members">
				<span>Members:</span>
				<div className="list-members">
					{project.members?.map((member) => (
						<MemberItem member={member} />
					))}
				</div>
			</div>
			<div className="whiteboards">
				<div className="texts">
					<h3>Whiteboards:</h3>
					<CreateWhiteboard orgId={organisation.id} projectId={project.id} />
				</div>
				<WhitebaordList />
			</div>
			<div className="kanbans">
				<div className="texts">
					<h3>Kanbans:</h3>
					<CreateKanban orgId={organisation.id} projectId={project.id} />
				</div>
				<KanbanList />
			</div>
		</div>
	);
}
