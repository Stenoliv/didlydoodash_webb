import "./kanbancategory.css";
import { EditKanbanCategory, KanbanCategory, WSType } from "@/utils/types";
import KanbanItem from "../item/KanbanItem";
import CreateItem from "../item/create/CreateItem";
import RemoveCategory from "./remove/RemoveCategory";
import { ChangeEvent } from "react";
import { useKanbanStore } from "@/stores/kanbans";

export interface KanbanCategoryProps {
	category: KanbanCategory;
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function KanbanCategoryItem(props: KanbanCategoryProps) {
	const { category, sendMessage } = props;
	const { updateCategoryName } = useKanbanStore();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		updateCategoryName(category.id, value);
		sendMessage(EditKanbanCategory, { id: category.id, name: value });
	};

	return (
		<div className="kanban-category-container">
			<div className="category-header">
				<input
					value={category.name}
					onChange={handleChange}
					placeholder="Category name"
				/>
				<div className="actions">
					<RemoveCategory id={category.id} sendMessage={sendMessage} />
					<CreateItem sendMessage={sendMessage} />
				</div>
			</div>
			<div className="content">
				<div className="absolute">
					{category.items &&
						Array.isArray(category.items) &&
						category.items.map((item) => (
							<KanbanItem key={item.id} item={item} sendMessage={sendMessage} />
						))}
					test
				</div>
			</div>
		</div>
	);
}
