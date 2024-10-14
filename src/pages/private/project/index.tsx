import { useProjectStore } from "@/stores/projects";
import { useNavigate } from "react-router-dom";
import MemberItem from "@/components/projects/member/item/MemberItem";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { Whiteboard } from "@/utils/types";
import { useQuery } from "react-query";
import { useOrgStore } from "@/stores/organisation";
import { useWhiteboards } from "@/stores/whiteboards";

import "./project.css";
import CreateKanban from "@/components/projects/kanban/create/create";
import KanbanList from "@/components/projects/kanban/list/KanbanList";
import CreateWhiteboard from "@/components/projects/whiteboard/create/create";

export default function ProjectView() {
	const { project } = useProjectStore();
	const { organisation } = useOrgStore();
	const navigate = useNavigate();

	const { whiteboards, setWhiteboards } = useWhiteboards();
	useQuery<Whiteboard[], Error>("whiteboards", loadWhiteboards, {
		onSuccess: (data) => {
			setWhiteboards(data);
		},
	});

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
				{whiteboards && whiteboards.length ? (
					whiteboards.map((whiteboard) => (
						<div className="whiteboard_link_cont" key={whiteboard.id}>
							<a
								href={`/whiteboard/${whiteboard.id}`}
								className="whiteboard_link"
							>
								{whiteboard.name}
							</a>
						</div>
					))
				) : (
					<div>No whiteboards</div>
				)}
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

const loadWhiteboards = async () => {
	const { organisation } = useOrgStore.getState();
	const { project } = useProjectStore.getState();

	try {
		const response = await API.get(
			`/organisations/${organisation?.id}/projects/${project?.id}/whiteboards`
		);
		return response.data.whiteboards;
	} catch (error: any) {
		toast.error(`Failed to load whiteboards: ` + error.message, {
			position: "top-left",
		});
	}
};
