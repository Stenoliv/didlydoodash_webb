import { useKanbanStore } from "@/stores/kanbans";
import "./index.css";
import KanbanCategoryItem from "@/components/projects/kanban/view/category/KanbanCategory";
import CreateCategory from "@/components/projects/kanban/view/category/create/CreateCategory";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useOrgStore } from "@/stores/organisation";
import { useProjectStore } from "@/stores/projects";
import {
	ArchiveKanban,
	DeleteKanbanCategory,
	DeleteKanbanItem,
	EditKanban,
	EditKanbanCategory,
	EditKanbanItem,
	ErrorKanban,
	JoinKanban,
	MoveKanbanItem,
	NewKanbanCategory,
	NewKanbanItem,
	RestoreKanbanCategory,
	RestoreKanbanItem,
	WSKanbanInput,
	WSKanbanMessage,
	WSType,
} from "@/utils/types";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { toast } from "react-toastify";
import ArchiveList from "@/components/projects/kanban/view/archive/list/ArchiveList";
import { useKanbanArchiveStore } from "@/stores/kanbans/archive";
import { BASE_URL } from "@/utils/api";

export default function KanbanView() {
	const { organisation } = useOrgStore();
	const { project } = useProjectStore();
	const { kanban, selectKanban, updateKanban } = useKanbanStore();
	const { addCategory, removeCategory, updateCategory } = useKanbanStore();
	const { addItem, moveItem, removeItem, updateItem } = useKanbanStore();
	const { toggleOpen, setArchive } = useKanbanArchiveStore();
	const { tokens, user } = useAuthStore();

	const [overlayVisible, setOverlayVisible] = useState(false);

	// Websocket Url in react state to handle reconnect manually
	const WS_URL = `${BASE_URL}/organisations/${organisation?.id}/projects/${project?.id}/kanbans/${kanban?.id}?token=${tokens?.access}`;

	const { lastJsonMessage, sendJsonMessage, readyState } =
		useWebSocket<WSKanbanMessage>(WS_URL, {
			onOpen: () => {
				toast.info("Connected to Kanban");
				setOverlayVisible(false);
			},
			onClose: () => {
				toast.info("Disconnected from Kanban");
				setOverlayVisible(true);
			},
			retryOnError: true,
			reconnectAttempts: 3,
			reconnectInterval: 2500,
			shouldReconnect: () => true,
			onReconnectStop: () => setOverlayVisible(true),
		});

	const sendMessage = useCallback(
		async (type: WSType, payload: any) => {
			sendJsonMessage<WSKanbanInput>(
				{
					type: type,
					roomId: kanban?.id || "",
					payload: payload,
				},
				true
			);
		},
		[sendJsonMessage, kanban]
	);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (!kanban) return;
		sendMessage(EditKanban, { id: kanban.id, updates: { [name]: value } });
	};

	// Handle websocket messages
	useEffect(() => {
		if (!lastJsonMessage) return;
		try {
			if (!lastJsonMessage.type) return;
			console.log(lastJsonMessage);
			switch (lastJsonMessage.type) {
				case JoinKanban:
					selectKanban(lastJsonMessage.payload.kanban);
					setArchive(lastJsonMessage.payload.archive);
					break;
				case EditKanban:
					updateKanban(lastJsonMessage.payload.updates);
					break;
				case ArchiveKanban:
					setArchive(lastJsonMessage.payload);
					break;

				// Kanban Category responses
				case NewKanbanCategory:
					addCategory(lastJsonMessage.payload.category);
					break;
				case RestoreKanbanCategory:
					addCategory(lastJsonMessage.payload.category);
					break;
				case EditKanbanCategory:
					if (
						!lastJsonMessage.payload.userId ||
						lastJsonMessage.payload.userId === user?.id
					)
						break;
					updateCategory(lastJsonMessage.payload.category);
					break;
				case DeleteKanbanCategory:
					removeCategory(lastJsonMessage.payload.category);
					break;
				// Kanban Item responses
				case NewKanbanItem:
					addItem(
						lastJsonMessage.payload.item.categoryId,
						lastJsonMessage.payload.item
					);
					break;
				case RestoreKanbanItem:
					addItem(
						lastJsonMessage.payload.item.categoryId,
						lastJsonMessage.payload.item
					);
					break;
				case MoveKanbanItem:
					moveItem(
						lastJsonMessage.payload.itemId,
						lastJsonMessage.payload.oldCategoryId,
						lastJsonMessage.payload.newCategoryId
					);
					break;
				case EditKanbanItem:
					if (
						!lastJsonMessage.payload.userId ||
						lastJsonMessage.payload.userId === user?.id
					)
						break;
					updateItem(
						lastJsonMessage.payload.item.categoryId,
						lastJsonMessage.payload.item.id,
						lastJsonMessage.payload.item
					);
					break;
				case DeleteKanbanItem:
					removeItem(
						lastJsonMessage.payload.item.categoryId,
						lastJsonMessage.payload.item.id
					);
					break;
				case ErrorKanban:
					toast.error(lastJsonMessage.payload.message, {
						position: "top-left",
					});
			}
		} catch (error: any) {
			toast.error(`Websocket error: ${error.message}`, {
				position: "top-left",
			});
		}
	}, [
		lastJsonMessage,
		selectKanban,
		removeCategory,
		addCategory,
		updateCategory,
		addItem,
		moveItem,
		updateItem,
		removeItem,
		updateKanban,
		setArchive,
		user?.id,
	]);

	return (
		<div className="kanban-view">
			<div className="header">
				<div className="kanban-name">
					<h1>Kanban:</h1>
					<input
						type="text"
						name="name"
						maxLength={50}
						value={kanban?.name}
						onChange={handleChange}
					/>
				</div>
				<img className="archive" src="/icons/more.svg" onClick={toggleOpen} />
			</div>
			<div className="categories">
				<div className="absolute">
					{kanban?.categories &&
						Array.isArray(kanban.categories) &&
						kanban.categories.map((category) => (
							<KanbanCategoryItem
								category={category}
								sendMessage={sendMessage}
							/>
						))}
					<div className="add-category">
						<CreateCategory sendMessage={sendMessage} />
					</div>
				</div>
				<ArchiveList sendMessage={sendMessage} />
			</div>
			{/* WebSocket Disconnected Overlay */}
			{readyState === ReadyState.CLOSED ||
				(overlayVisible && (
					<div className="overlay">
						<div className="overlay-content">
							<h2>Connection Lost</h2>
							<p>
								You have been disconnected from the Kanban workspace. Try to
								refresh page!
							</p>
						</div>
					</div>
				))}
		</div>
	);
}
