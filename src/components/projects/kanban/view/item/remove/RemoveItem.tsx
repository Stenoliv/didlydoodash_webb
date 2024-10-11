import { NewKanbanItem, WSType } from "@/utils/types";
import "./removeitem.css";

export interface RemoveItemProps {
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function RemoveItem(props: RemoveItemProps) {
	const { sendMessage } = props;

	return (
		<img
			className="add-item-icon"
			src="/icons/minus.svg"
			onClick={() => sendMessage(NewKanbanItem, { name: "Not named" })}
		/>
	);
}
