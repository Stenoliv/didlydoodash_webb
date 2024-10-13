import { KanbanArchiveItem } from "@/utils/types";
import "./archiveitem.css";

export interface ArchiveItemProps {
	item: KanbanArchiveItem;
}

export default function ArchiveItem(props: ArchiveItemProps) {
	const { item } = props;

	return <div>{item.name}</div>;
}
