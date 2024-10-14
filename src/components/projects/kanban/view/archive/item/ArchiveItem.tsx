import {
	KanbanArchiveItem,
	PermaDeleteKanbanCategory,
	PermaDeleteKanbanItem,
	RestoreKanbanCategory,
	RestoreKanbanItem,
	WSType,
} from "@/utils/types";
import "./archiveitem.css";

export interface ArchiveItemProps {
	item: KanbanArchiveItem;
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function ArchiveItem(props: ArchiveItemProps) {
	const { item, sendMessage } = props;

	const handleRestore = () => {
		switch (item.type) {
			case "item":
				sendMessage(RestoreKanbanItem, { itemId: item.id });
				break;
			case "category":
				sendMessage(RestoreKanbanCategory, { id: item.id });
				break;
		}
	};

	const handleDelete = () => {
		switch (item.type) {
			case "item":
				sendMessage(PermaDeleteKanbanItem, { itemId: item.id });
				break;
			case "category":
				sendMessage(PermaDeleteKanbanCategory, { id: item.id });
				break;
		}
	};

	return (
		<div className={`archive-item ${item.type}`}>
			<h2>
				{item.type === "item" ? "Item" : "Category"}
				<div className="archive-item-actions">
					<img
						className="archive-item-restore"
						src="/icons/restore.svg"
						onClick={handleRestore}
					/>
					<img
						className="archive-item-delete"
						src="/icons/trashcan.svg"
						onClick={handleDelete}
					/>
				</div>
			</h2>
			<div>Name: {item.name}</div>
			<div>Deleted At: {new Date(item.deletedAt).toLocaleDateString()}</div>
		</div>
	);
}
