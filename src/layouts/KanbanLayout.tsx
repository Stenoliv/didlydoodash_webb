import { useKanbanStore } from "@/stores/kanbans";
import { useProjectStore } from "@/stores/projects";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function KanbanLayout() {
	const { kanban } = useKanbanStore();
	const { project } = useProjectStore();

	const navigate = useNavigate();

	if (kanban == null) {
		navigate(-1);
		return;
	}

	return (
		<>
			<div className="kanban-header">
				<NavLink to={`/projects/${project?.id}`}>/Project</NavLink>
				<NavLink to={`/kanban/${kanban.id}`}>/Kanban</NavLink>
			</div>
			<DndProvider backend={HTML5Backend}>
				<Outlet />
			</DndProvider>
		</>
	);
}
