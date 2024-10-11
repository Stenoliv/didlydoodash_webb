import "./create.css";
import { Button, FormControl, Modal, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { useKanbanStore } from "@/stores/kanbans";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { Kanban } from "@/utils/types";

export interface CreataWhiteboardProps {
	orgId: string;
	projectId: string;
}

export default function CreateWhiteboard(props: CreataWhiteboardProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [input, setInput] = useState({
		name: "",
	});

	const { orgId, projectId } = props;
	const { addKanban } = useKanbanStore();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCreateWhiteboard = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		return API.post(
			`/api/organisations/${orgId}/projects/${projectId}/whiteboard`,
			{ ...input }
		)
			.then((respones) => {
				const kanban: Kanban = respones.data.kanban;
				addKanban(kanban);
				toast.success(`Successfully created kanban: ${kanban.name}`);
			})
			.catch((error) => {
				toast.error(`Failed to create kanban: ${error.response.data.message}`, {
					position: "top-left",
				});
			});
	};

	return (
		<>
			<img
				className="create-whiteboard-button"
				src="/icons/plus.svg"
				alt=""
				onClick={() => setOpen(true)}
			/>
			<Modal
				className="create-whiteboard-container"
				open={open}
				onClose={() => setOpen(false)}
			>
				<FormControl
					component="form"
					onSubmit={handleCreateWhiteboard}
					className="create-whiteboard-form"
				>
					<h2>Create Whiteboard</h2>
					<TextField
						name="name"
						value={input.name}
						onChange={handleChange}
						label="Name"
					/>
					<Button type="submit" variant="contained">
						Create
					</Button>
				</FormControl>
			</Modal>
		</>
	);
}
