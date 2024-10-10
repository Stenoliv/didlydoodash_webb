import { useProjectStore } from "@/stores/projects";
import { useNavigate } from "react-router-dom";
import MemberItem from "@/components/projects/member/item/MemberItem";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { Kanban, Whiteboard } from "@/utils/types";
import { useQuery } from "react-query";
import { useOrgStore } from "@/stores/organisation";
import { useKanbanStore } from "@/stores/kanbans";
import { useWhiteboards } from "@/stores/whiteboards";

import "./project.css";
import CreateKanban from "@/components/projects/kanban/create/create";

export default function ProjectView() {
	const { project } = useProjectStore();
	const { organisation } = useOrgStore();
	const navigate = useNavigate();

	const { kanbans, setKanbans } = useKanbanStore();
	useQuery<Kanban[], Error>("kanbans", loadKanbans, {
		onSuccess: (data) => {
			setKanbans(data);
		},
	});

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

	const createWhiteboard = () => {
		return API.post(
			`/api/organisations/${organisation.id}/projects/${project.id}/whiteboards`
		)
			.then((respones) => {
				const whiteboard: Whiteboard = respones.data.kanban;
				toast.success(`Successfully created whiteboard: ${whiteboard.id}`);
			})
			.catch((error) => {
				toast.error(`Failed to create whiteboard: ${error.message}`, {
					position: "top-left",
				});
			});
	};

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
					<button onClick={createWhiteboard}>+</button>
				</div>
				{whiteboards && whiteboards.length ? (
					whiteboards.map((whiteboard) => (
						<div key={whiteboard.id}>Whiteboard</div>
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
				{kanbans && kanbans.length ? (
					kanbans.map((kanban) => <div key={kanban.id}>Kanban</div>)
				) : (
					<div>No kanbans</div>
				)}
			</div>
		</div>
	);
}

const loadWhiteboards = async () => {
	const { organisation } = useOrgStore.getState();
	const { project } = useProjectStore.getState();

	try {
		const response = await API.get(
			`/api/organisations/${organisation?.id}/projects/${project?.id}/whiteboards`
		);
		return response.data.whiteboards;
	} catch (error: any) {
		toast.error(`Failed to load whiteboards: ` + error.message, {
			position: "top-left",
		});
	}
};

const loadKanbans = async () => {
	const { organisation } = useOrgStore.getState();
	const { project } = useProjectStore.getState();

	try {
		const response = await API.get(
			`/api/organisations/${organisation?.id}/projects/${project?.id}/kanbans`
		);
		return response.data.kanbans;
	} catch (error: any) {
		toast.error(`Failed to load kanbans: ` + error.message, {
			position: "top-left",
		});
	}
};
