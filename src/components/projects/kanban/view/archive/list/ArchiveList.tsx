// ArchiveList.js
import "./archivelist.css";
import { useKanbanArchiveStore } from "@/stores/kanbans/archive";

import { WSType } from "@/utils/types";
import ArchiveItem from "../item/ArchiveItem";

export interface ArchiveListProps {
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function ArchiveList(props: ArchiveListProps) {
	const { sendMessage } = props;

	const { open, toggleOpen, archive } = useKanbanArchiveStore();

	return (
		<div className={`kanban-archive-drawer ${open ? "showing" : ""}`}>
			<div className="archive-header">
				<img src="/icons/back.svg" alt="" onClick={toggleOpen} />
				<h2>Kanban Archive:</h2>
			</div>
			<div className="kanban-archive-list">
				<div className="kanban-archive-list-abosulute">
					{archive &&
						Array.isArray(archive) &&
						archive
							.filter((item) => item.deletedAt)
							.sort((a, b) => {
								const dateA = new Date(a.deletedAt).getTime(); // Convert to timestamp
								const dateB = new Date(b.deletedAt).getTime(); // Convert to timestamp
								return dateA - dateB;
							})
							.map((item) => (
								<ArchiveItem item={item} sendMessage={sendMessage} />
							))}
				</div>
			</div>
		</div>
	);
}
