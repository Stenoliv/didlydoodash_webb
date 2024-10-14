import "./create.css";
import { Button, FormControl, Modal, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { useKanbanStore } from "@/stores/kanbans";
import { API } from "@/utils/api";
import { toast } from "react-toastify";
import { Kanban } from "@/utils/types";

export interface CreataKanbanProps {
	orgId: string;
	projectId: string;
}

export default function CreateKanban(props: CreataKanbanProps) {
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

	const handleCreateKanban = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		return API.post(`/organisations/${orgId}/projects/${projectId}/kanbans`, {
			...input,
		})
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
				className="create-kanban-button"
				src="/icons/plus.svg"
				alt=""
				onClick={() => setOpen(true)}
			/>
			<Modal
				className="create-kanban-container"
				open={open}
				onClose={() => setOpen(false)}
			>
				<FormControl
					component="form"
					onSubmit={handleCreateKanban}
					className="create-kanban-form"
				>
					<h2>Create Kanban</h2>
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
