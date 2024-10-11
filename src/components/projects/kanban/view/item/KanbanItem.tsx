import { KanbanItem } from "@/utils/types";
import "./kanbanitem.css";

export interface KanbanItemProps {
	item: KanbanItem;
}

export default function KanbanItemComponent(props: KanbanItemProps) {
	const { item } = props;

	return <div>{item.name}</div>;
}
