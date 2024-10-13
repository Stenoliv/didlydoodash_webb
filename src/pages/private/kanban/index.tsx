import { useKanbanStore } from "@/stores/kanbans";
import "./index.css";
import KanbanCategoryItem from "@/components/projects/kanban/view/category/KanbanCategory";
import CreateCategory from "@/components/projects/kanban/view/category/create/CreateCategory";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useOrgStore } from "@/stores/organisation";
import { useProjectStore } from "@/stores/projects";
import {
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
	WSKanbanInput,
	WSKanbanMessage,
	WSType,
} from "@/utils/types";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { toast } from "react-toastify";
import ArchiveList from "@/components/projects/kanban/view/archive/list/ArchiveList";
import { useNavigate } from "react-router-dom";
import { useKanbanArchiveStore } from "@/stores/kanbans/archive";

export default function KanbanView() {
	const { organisation } = useOrgStore();
	const { project } = useProjectStore();
	const { kanban, selectKanban, updateKanban } = useKanbanStore();
	const { addCategory, removeCategory, updateCategory } = useKanbanStore();
	const { addItem, moveItem, removeItem, updateItem } = useKanbanStore();
	const { toggleOpen } = useKanbanArchiveStore();
	const navigate = useNavigate();
	const { tokens } = useAuthStore();

	const [overlayVisible, setOverlayVisible] = useState(false);
	const [webSocketURL, setWebSocketURL] = useState<string | null>(null);

	// Websocket Url in react state to handle reconnect manually
	useEffect(() => {
		setWebSocketURL(
			`http://localhost:3000/organisations/${organisation?.id}/projects/${project?.id}/kanbans/${kanban?.id}?token=${tokens?.access}`
		);
	}, [kanban?.id, organisation?.id, project?.id, tokens?.access]);

	const { lastJsonMessage, sendJsonMessage, readyState } =
		useWebSocket<WSKanbanMessage>(webSocketURL, {
			onOpen: () => {
				toast.info("Connected to Kanban");
				setOverlayVisible(false);
			},
			onClose: () => {
				toast.info("Disconnected from Kanban");
				setOverlayVisible(true);
			},
			retryOnError: true,
			reconnectAttempts: 10,
			reconnectInterval: 2500,
			onReconnectStop: () => setOverlayVisible(true),
			shouldReconnect: () => true,
		});

	const sendMessage = useCallback(
		async (type: WSType, payload: any) => {
			sendJsonMessage<WSKanbanInput>({
				type: type,
				roomId: kanban?.id || "",
				payload: payload,
			});
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
					break;
				case EditKanban:
					updateKanban(lastJsonMessage.payload.updates);
					break;

				// Kanban Category responses
				case NewKanbanCategory:
					addCategory(lastJsonMessage.payload.category);
					break;
				case EditKanbanCategory:
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
				case MoveKanbanItem:
					moveItem(
						lastJsonMessage.payload.itemId,
						lastJsonMessage.payload.oldCategoryId,
						lastJsonMessage.payload.newCategoryId
					);
					break;
				case EditKanbanItem:
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
	]);

	function handleReconnect(): void {
		setOverlayVisible(true);
		setWebSocketURL(
			`http://localhost:3000/organisations/${organisation?.id}/projects/${project?.id}/kanbans/${kanban?.id}?token=${tokens?.access}`
		);
	}

	if (!kanban) {
		navigate(-1);
		return;
	}

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
				<ArchiveList />
			</div>
			{/* WebSocket Disconnected Overlay */}
			{readyState === ReadyState.CLOSED ||
				(overlayVisible && (
					<div className="overlay">
						<div className="overlay-content">
							<h2>Connection Lost</h2>
							<p>You have been disconnected from the Kanban workspace.</p>
							<button
								className="reconnect-button"
								onClick={handleReconnect}
							></button>
						</div>
					</div>
				))}
		</div>
	);
}
