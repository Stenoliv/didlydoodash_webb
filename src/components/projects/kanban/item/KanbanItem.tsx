import { Kanban } from "@/utils/types";
import "./kanbanitem.css";
import { useNavigate } from "react-router-dom";
import { useKanbanStore } from "@/stores/kanbans";

export interface KanbanItemProps {
	kanban: Kanban;
}

export default function KanbanItem(props: KanbanItemProps) {
	const { kanban } = props;

	const { selectKanban } = useKanbanStore();
	const navigate = useNavigate();

	const handleOnClick = () => {
		selectKanban(kanban);
		navigate(`/kanban/${kanban.id}`);
	};

	return (
		<div className="kanban-item-container" onClick={handleOnClick}>
			<h2>Title: {kanban.name}</h2>
			<div className="kanban-status">
				<div className="row texts">
					<span>Progress:</span>
					<p className={"status " + kanban.status.toLowerCase() || "planning"}>
						{kanban.status}
					</p>
				</div>
				<div className="row texts">
					<span>Last modified:</span>
					<p>{new Date(kanban.updatedAt).toLocaleString()}</p>
				</div>
			</div>
		</div>
	);
}
