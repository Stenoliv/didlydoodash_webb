import { DeleteKanbanItem, KanbanItem, WSType } from "@/utils/types";
import "./removeitem.css";

export interface RemoveItemProps {
	item: KanbanItem;
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function RemoveItem(props: RemoveItemProps) {
	const { item, sendMessage } = props;

	return (
		<img
			className="add-item-icon"
			src="/icons/minus.svg"
			onClick={() => sendMessage(DeleteKanbanItem, { itemId: item.id })}
		/>
	);
}
