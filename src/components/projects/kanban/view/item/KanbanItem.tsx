import { KanbanItem, WSType } from "@/utils/types";
import "./kanbanitem.css";
import RemoveItem from "./remove/RemoveItem";

export interface KanbanItemProps {
	item: KanbanItem;
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function KanbanItemComponent(props: KanbanItemProps) {
	const { item, sendMessage } = props;

    

	return (
		<div>
			{item.name}
			<RemoveItem sendMessage={sendMessage} />
		</div>
	);
}
