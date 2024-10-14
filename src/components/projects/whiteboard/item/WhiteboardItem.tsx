import { Whiteboard } from "@/utils/types";
import "./whiteboarditem.css";
import { useNavigate } from "react-router-dom";

export interface WhiteboardItemProps {
	whiteboard: Whiteboard;
}

export default function WhiteboardItem(props: WhiteboardItemProps) {
	const { whiteboard } = props;

	const navigate = useNavigate();

	const handleOnClick = () => {
		navigate(`/whiteboard/${whiteboard.id}`);
	};

	return (
		<div className="kanban-item-container" onClick={handleOnClick}>
			<h2>Title: {whiteboard.name}</h2>
			<div className="kanban-status">
				<div className="row texts">
					<span>Last modified:</span>
					<p>{new Date(whiteboard.updatedAt).toLocaleString()}</p>
				</div>
			</div>
		</div>
	);
}
