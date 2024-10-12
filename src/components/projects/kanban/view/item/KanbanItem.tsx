import {
	EditKanbanItem,
	KanbanDNDTypes,
	KanbanDragItem,
	KanbanItem,
	WSType,
} from "@/utils/types";
import "./kanbanitem.css";
import RemoveItem from "./remove/RemoveItem";
import { ChangeEvent, CSSProperties } from "react";
import { useKanbanStore } from "@/stores/kanbans";
import { useDrag } from "react-dnd";

export interface KanbanItemProps {
	categoryId: string;
	item: KanbanItem;
	style?: CSSProperties;
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function KanbanItemComponent(props: KanbanItemProps) {
	const { categoryId, style, item, sendMessage } = props;
	const { updateItem } = useKanbanStore();

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		updateItem(categoryId, item.id, { [name]: value });
		sendMessage(EditKanbanItem, {
			categoryId: categoryId,
			itemId: item.id,
			updates: { [name]: value },
		});
	};

	const dragItem: KanbanDragItem = {
		categoryId: categoryId,
		id: item.id,
	};

	const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
		type: KanbanDNDTypes.ITEM,
		item: dragItem,
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const dragStyle: CSSProperties = { display: isDragging ? "none" : "flex" };

	return (
		<div
			ref={dragPreview}
			className="kanban-item-box"
			style={{ ...style, ...dragStyle }}
		>
			<div className="kanban-item-header">
				<img ref={drag} src="/icons/grab.svg" className="kanban-item-handle" />
				<div className="kanban-item-actions">
					<select name="status" onChange={handleChange}>
						<option value="Working on">Working On</option>
						<option value="Current">Current</option>
						<option value="Done">Done</option>
					</select>
					<RemoveItem item={item} sendMessage={sendMessage} />
				</div>
			</div>
			<div className="kanban-item-content">
				<div className="title-desc">
					<input
						type="text"
						name="title"
						maxLength={20}
						placeholder="Title"
						value={item.title}
						onChange={handleChange}
					/>
					<input
						className="desc"
						type="text"
						name="desc"
						placeholder="Description"
						value={item.desc}
						onChange={handleChange}
					/>
				</div>
			</div>
		</div>
	);
}
