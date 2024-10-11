import { useKanbanStore } from "@/stores/kanbans";
import "./index.css";
import KanbanCategoryItem from "@/components/projects/kanban/view/category/KanbanCategory";
import CreateCategory from "@/components/projects/kanban/view/category/create/CreateCategory";
import useWebSocket from "react-use-websocket";
import { useOrgStore } from "@/stores/organisation";
import { useProjectStore } from "@/stores/projects";
import {
	DeleteKanbanCategory,
	EditKanbanCategory,
	JoinKanban,
	NewKanbanCategory,
	WSKanbanInput,
	WSKanbanMessage,
	WSType,
} from "@/utils/types";
import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { toast } from "react-toastify";

export default function KanbanView() {
	const { organisation } = useOrgStore();
	const { project } = useProjectStore();
	const { kanban, selectKanban, addCategory, removeCategory, updateCategory } =
		useKanbanStore();
	const { tokens } = useAuthStore();

	const WS_URL = `http://localhost:3000/organisations/${organisation?.id}/projects/${project?.id}/kanbans/${kanban?.id}?token=${tokens?.access}`;
	const { lastJsonMessage, sendJsonMessage, readyState } =
		useWebSocket<WSKanbanMessage>(WS_URL, {
			onOpen: () => {},
			onClose: () => {
				toast.info("Disconnect from websocket");
			},
			retryOnError: true,
			reconnectAttempts: 10,
			reconnectInterval: 2500,
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

	useEffect(() => {
		if (!lastJsonMessage) return;
		try {
			if (!lastJsonMessage.type) return;
			console.log(lastJsonMessage);
			switch (lastJsonMessage.type) {
				case JoinKanban:
					selectKanban(lastJsonMessage.payload.kanban);
					break;
				case NewKanbanCategory:
					addCategory(lastJsonMessage.payload.category);
					break;
				case EditKanbanCategory:
					updateCategory(lastJsonMessage.payload.category);
					break;
				case DeleteKanbanCategory:
					removeCategory(lastJsonMessage.payload.category);
					break;
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
	]);

	useEffect(() => {}, [readyState]);

	return (
		<div className="kanban-view">
			<div className="header">
				<h1>Kanban: {kanban?.name}</h1>
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
			</div>
		</div>
	);
}
