import {
	EditKanbanItem,
	KanbanDNDTypes,
	KanbanDragItem,
	KanbanItem,
	KanbanItemPriority,
	WSType,
} from "@/utils/types";
import "./kanbanitem.css";
import RemoveItem from "./remove/RemoveItem";
import { ChangeEvent, CSSProperties, memo, useState } from "react";
import { useDrag } from "react-dnd";
import { Modal } from "@mui/material";
import { useKanbanStore } from "@/stores/kanbans";

export interface KanbanItemProps {
	categoryId: string;
	item: KanbanItem;
	style?: CSSProperties;
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

function KanbanItemComponent(props: KanbanItemProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [showDueTime, setShowDueTime] = useState<boolean>(false);

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

	const [{ isDragging }, drag, dragPreview] = useDrag(
		() => ({
			type: KanbanDNDTypes.ITEM,
			item: dragItem,
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
		}),
		[dragItem]
	);

	const dragStyle: CSSProperties = { opacity: isDragging ? 0.5 : 1 };

	return (
		<>
			<div
				ref={dragPreview}
				className="kanban-item-box"
				style={{ ...dragStyle, ...style }}
				onClick={() => setOpen(true)}
			>
				<div className="kanban-item-header">
					<div className="kanban-item-actions">
						<div ref={drag} className={"kanban-item-handle"}>
							<img src="/icons/grab.svg" />
						</div>
						<RemoveItem item={item} sendMessage={sendMessage} />
					</div>
				</div>
				<div className="kanban-item-content">
					<div className="title-desc">
						<input type="text" value={item.title} placeholder="Title" />
						<input
							className="desc"
							type="text"
							value={item.description}
							placeholder="Description"
						/>
					</div>
					<div className="info-box">
						{item.priority && item.priority !== KanbanItemPriority.NONE && (
							<span className={"priority " + item.priority.toLowerCase()}>
								Priority: <strong>{item.priority}</strong>
							</span>
						)}
						{item.due_date && (
							<span
								className={"due-time"}
								onMouseEnter={() => setShowDueTime(true)}
								onMouseLeave={() => setShowDueTime(false)}
							>
								Due:{" "}
								<strong
									className={
										new Date(item.due_date).getTime() <= Date.now()
											? "late"
											: ""
									}
								>
									{new Date(item.due_date).toLocaleDateString()}
								</strong>
								{showDueTime && (
									<div className="due-time-left">
										Time left: {getTimeLeft(new Date(item.due_date))}
									</div>
								)}
							</span>
						)}
						{item.estimated_time && (
							<span className="estimated-time">
								Estimated work hours: {item.estimated_time}h
							</span>
						)}
					</div>
				</div>
			</div>
			<Modal
				className="edit-kanban-item-modal"
				component="div"
				open={open}
				onClose={() => setOpen(false)}
			>
				<div className="edit-kanban-item-container">
					<h2>Edit Item</h2>
					<div className="edit-content">
						<span className="edit-content-subheader">Title & Description</span>
						<div className="edit-content-row">
							<label>Title:</label>
							<input
								type="text"
								name="title"
								maxLength={40}
								placeholder="Title"
								value={item.title}
								onChange={handleChange}
							/>
						</div>
						<div className="edit-content-row">
							<label>Description:</label>
							<input
								className="desc"
								type="text"
								name="description"
								placeholder="Description"
								value={item.description}
								onChange={handleChange}
							/>
						</div>
						<br />
						<span className="edit-content-subheader">Priority</span>
						<div className="edit-content-row">
							<label>Priority</label>
							<select
								value={item.priority}
								name="priority"
								onChange={handleChange}
							>
								{Object.keys(KanbanItemPriority)
									.reverse()
									.map((key) => (
										<option
											key={key}
											value={
												KanbanItemPriority[
													key as keyof typeof KanbanItemPriority
												]
											}
										>
											{
												KanbanItemPriority[
													key as keyof typeof KanbanItemPriority
												]
											}
										</option>
									))}
							</select>
						</div>
						<br />
						<span className="edit-content-subheader">
							Estimated Time & Due Date
						</span>
						<div className="edit-content-row">
							<label>Due Date</label>
							<input
								type="datetime-local"
								placeholder="Due date"
								name="due_date"
								value={formatDateTimeLocal(new Date(item.due_date))}
								onChange={handleChange}
							/>
						</div>
						<div className="edit-content-row">
							<label>Estimated time</label>
							<input
								type="number"
								placeholder="Time in hours (h)"
								name="estimated_time"
								value={item.estimated_time}
								onChange={handleChange}
							/>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
}

const formatDateTimeLocal = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function getTimeLeft(dueDate: Date) {
	const now = Date.now();
	const timeDiff = dueDate.getTime() - now;

	// If the due date has passed, show it as overdue
	if (timeDiff <= 0) {
		return "Overdue!";
	}

	// Calculate the time left in days, hours, and minutes
	const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

	let result = "";
	if (days > 0) result += `${days} d `;
	if (hours > 0) result += `${hours} h `;
	if (minutes > 0 || (!days && !hours)) result += `${minutes} m`;

	return result.trim();
}

export default memo(KanbanItemComponent);
