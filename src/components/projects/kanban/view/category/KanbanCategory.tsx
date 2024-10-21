import "./kanbancategory.css";
import {
	EditKanbanCategory,
	KanbanCategory,
	KanbanDNDTypes,
	KanbanDragItem,
	KanbanItem,
	MoveKanbanItem,
	WSType,
} from "@/utils/types";
import KanbanItemComp from "../item/KanbanItem";
import CreateItem from "../item/create/CreateItem";
import RemoveCategory from "./remove/RemoveCategory";
import { ChangeEvent, useEffect, useState } from "react";
import { useKanbanStore } from "@/stores/kanbans";
import { useDrop } from "react-dnd";

export interface KanbanCategoryProps {
	category: KanbanCategory;
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function KanbanCategoryItem(props: KanbanCategoryProps) {
	const { category, sendMessage } = props;
	const { updateCategory, getItem } = useKanbanStore();
	const [dragItem, setDragItem] = useState<KanbanItem | null>(null);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		updateCategory({
			...category,
			[name]: value,
		} as KanbanCategory);
		sendMessage(EditKanbanCategory, { id: category.id, name: value });
	};

	const [{ itemOver, isOver }, drop] = useDrop<
		KanbanDragItem,
		void,
		{ itemOver: KanbanDragItem; isOver: boolean }
	>(
		() => ({
			accept: KanbanDNDTypes.ITEM,
			drop: (item) => {
				if (category.id === item.categoryId) return;
				sendMessage(MoveKanbanItem, {
					oldCategoryId: item.categoryId,
					newCategoryId: category.id,
					itemId: item.id,
				});
			},
			collect: (monitor) => ({
				itemOver: monitor.getItem<KanbanDragItem>(),
				isOver: !!monitor.isOver(),
			}),
		}),
		[category.id]
	);

	useEffect(() => {
		if (!itemOver) return;
		const item = getItem(itemOver.categoryId, itemOver.id);
		setDragItem(item);
	}, [category, itemOver, getItem]);

	return (
		<div className="kanban-category-container">
			<div className="category-header">
				<input
					name="name"
					value={category.name}
					onChange={handleChange}
					placeholder="Category name"
				/>
				<div className="actions">
					<RemoveCategory id={category.id} sendMessage={sendMessage} />
					<CreateItem category={category} sendMessage={sendMessage} />
				</div>
			</div>
			<div className="content">
				<div ref={drop} className="absolute">
					{category.items &&
						Array.isArray(category.items) &&
						category.items
							.filter((item) => item.createdAt)
							.sort((a, b) => {
								const dateA = new Date(a.createdAt).getTime(); // Convert to timestamp
								const dateB = new Date(b.createdAt).getTime(); // Convert to timestamp
								return dateA - dateB;
							})
							.map((item) => (
								<KanbanItemComp
									categoryId={category.id}
									key={item.id}
									item={item}
									sendMessage={sendMessage}
								/>
							))}
					{isOver &&
						dragItem &&
						category.items &&
						Array.isArray(category.items) &&
						category.items.find((i) => i.id === dragItem.id) == undefined && (
							<KanbanItemComp
								style={{ opacity: 0.2 }}
								categoryId={category.id}
								key={dragItem.id}
								item={dragItem}
								sendMessage={sendMessage}
							/>
						)}
				</div>
			</div>
		</div>
	);
}
