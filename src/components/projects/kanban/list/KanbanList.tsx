import "./kanbanlist.css";
import { useQuery } from "react-query";
import { Kanban } from "@/utils/types";
import { useKanbanStore } from "@/stores/kanbans";
import { useProjectStore } from "@/stores/projects";
import { useOrgStore } from "@/stores/organisation";
import { toast } from "react-toastify";
import { API } from "@/utils/api";
import KanbanItem from "../item/KanbanItem";

export default function KanbanList() {
	const { kanbans, setKanbans } = useKanbanStore();
	useQuery<Kanban[], Error>("kanbans", loadKanbans, {
		onSuccess: (data) => {
			setKanbans(data);
		},
	});

	return (
		<div className="kanban-list">
			{kanbans && kanbans.length ? (
				kanbans.map((kanban) => <KanbanItem kanban={kanban} key={kanban.id} />)
			) : (
				<div>No kanbans</div>
			)}
		</div>
	);
}

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
