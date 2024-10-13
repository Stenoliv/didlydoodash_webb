// ArchiveList.js
import "./archivelist.css";
import { useKanbanArchiveStore } from "@/stores/kanbans/archive";
import { useKanbanStore } from "@/stores/kanbans";
import { useQuery, useQueryClient } from "react-query";
import { KanbanArchiveItem } from "@/utils/types";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { useProjectStore } from "@/stores/projects";
import { useOrgStore } from "@/stores/organisation";
import { useEffect, useState } from "react";
import ArchiveItem from "../item/ArchiveItem";

// export interface ArchiveListProps {}

export default function ArchiveList(/*props: ArchiveListProps*/) {
	const [archive, setArchive] = useState<KanbanArchiveItem[]>([]);

	const { open, toggleOpen } = useKanbanArchiveStore();
	const queryClient = useQueryClient();

	useEffect(() => {
		queryClient.invalidateQueries("archive");
	}, [open, queryClient]);

	useQuery<KanbanArchiveItem[], Error>("archive", loadArchive, {
		onSuccess: (data) => {
			setArchive(data);
		},
	});

	return (
		<div className={`kanban-archive-drawer ${open ? "showing" : ""}`}>
			<div className="header">
				<img src="" alt="" onClick={toggleOpen} />
				<h2>Kanban Archive:</h2>
			</div>
			<div className="kanban-archive-list">
				{archive &&
					Array.isArray(archive) &&
					archive.map((item) => <ArchiveItem item={item} />)}
			</div>
		</div>
	);
}

const loadArchive = async () => {
	const { organisation } = useOrgStore.getState();
	const { project } = useProjectStore.getState();
	const { kanban } = useKanbanStore.getState();

	try {
		const response = await API.get(
			`/api/organisations/${organisation?.id}/projects/${project?.id}/kanbans/${kanban?.id}/archive`
		);
		return response.data.archive;
	} catch (error: any) {
		toast.error("Error loading archive: " + error?.message, {
			position: "top-left",
		});
	}
};
