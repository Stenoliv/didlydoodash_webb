import { KanbanCategory, WSType } from "@/utils/types";
import "./kanbancategory.css";
import KanbanItem from "../item/KanbanItem";
import CreateItem from "../item/create/CreateItem";

export interface KanbanCategoryProps {
	category: KanbanCategory;
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function KanbanCategoryItem(props: KanbanCategoryProps) {
	const { category, sendMessage } = props;

	return (
		<div className="kanban-category-container">
			<div className="header">
				<h2>{category.name}</h2>
				<CreateItem sendMessage={sendMessage} />
			</div>
			<div className="content">
				<div className="absolute">
					{category.items &&
						Array.isArray(category.items) &&
						category.items.map((item) => <KanbanItem item={item} />)}
					test
				</div>
			</div>
		</div>
	);
}
