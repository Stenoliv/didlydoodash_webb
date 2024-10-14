import Whiteboard from "@/components/whiteboard/WhiteboardArea";
import { useAuthStore } from "@/stores/auth/store";
import { useOrgStore } from "@/stores/organisation";
import { useProjectStore } from "@/stores/projects";
import { BASE_URL } from "@/utils/api";
import { useParams } from "react-router-dom";

export default function WhiteboardPage() {
	const { whiteboardID } = useParams();
	const { organisation } = useOrgStore();
	const { project } = useProjectStore();
	const { tokens } = useAuthStore();
	return (
		<div style={styles.mainArea}>
			<div style={styles.canvas}>
				{/* This is where you can draw */}
				<Whiteboard
					websocketUrl={`${BASE_URL}/organisations/${organisation?.id}/projects/${project?.id}/whiteboards/${whiteboardID}?token=${tokens?.access}`}
				/>
			</div>
		</div>
	);
}

// Simple styles for the canvas
const styles: { canvas: React.CSSProperties; mainArea: React.CSSProperties } = {
	canvas: {
		position: "relative",
		display: "flex",
		flexGrow: "1",
		justifyContent: "center",
		alignItems: "center",
	},
	mainArea: {
		display: "flex",
		flexGrow: "1",
		flexDirection: "column",
	},
};
