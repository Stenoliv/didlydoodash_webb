import "./whiteboardlist.css";
import { useQuery } from "react-query";
import { Whiteboard } from "@/utils/types";
import { useProjectStore } from "@/stores/projects";
import { useOrgStore } from "@/stores/organisation";
import { toast } from "react-toastify";
import { API } from "@/utils/api";
import { useWhiteboards } from "@/stores/whiteboards";
import WhiteboardItem from "../item/WhiteboardItem";

export default function WhitebaordList() {
	const { whiteboards, setWhiteboards } = useWhiteboards();
	useQuery<Whiteboard[], Error>("whiteboards", loadWhiteboards, {
		onSuccess: (data) => {
			setWhiteboards(data);
		},
	});

	return (
		<div className="kanban-list">
			{whiteboards && Array.isArray(whiteboards) && whiteboards.length > 0 ? (
				whiteboards.map((whiteboard) => (
					<WhiteboardItem whiteboard={whiteboard} key={whiteboard.id} />
				))
			) : (
				<div>No whiteboards</div>
			)}
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
		toast.error(`Failed to load kanbans: ` + error.message, {
			position: "top-left",
		});
	}
};
