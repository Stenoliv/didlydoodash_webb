import { KanbanCategory, NewKanbanItem, WSType } from "@/utils/types";
import "./createitem.css";

export interface CreateItemProps {
	category: KanbanCategory;
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function CreateItem(props: CreateItemProps) {
	const { category, sendMessage } = props;

	return (
		<img
			className="add-item-icon"
			src="/icons/plus.svg"
			onClick={() =>
				sendMessage(NewKanbanItem, {
					categoryId: category.id,
					name: "Not named",
				})
			}
		/>
	);
}
