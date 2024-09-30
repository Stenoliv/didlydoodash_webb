import { useAuthStore } from "@/stores/auth/store";
import { useOrgStore } from "@/stores/organisation";
import { useChatStore } from "@/stores/organisation/chats";
import { API } from "@/utils/api";
import { Chat } from "@/utils/types";
import {
	Button,
	FormControl,
	Modal,
	TextField,
	Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

export default function ChatsPage() {
	const { organisation } = useOrgStore();
	const { chats, addChat, setChats } = useChatStore();
	const { user } = useAuthStore(); // TODO: Remove temp and implement member selection form
	const { isLoading, isError } = useQuery<Chat[], Error>("chats", getChats, {
		onSuccess: (data) => {
			setChats(data);
		},
	});

	const [open, setOpen] = useState<boolean>(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [input, setInput] = useState({
		name: "",
		members: [{ id: user?.id }],
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput((prevInput) => ({
			...prevInput,
			[name]: value,
		}));
	};

	const handleNewChat = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		return API.post(`/api/organisations/${organisation?.id}/chats`, {
			...input,
		})
			.then((response) => {
				addChat(response.data.chat);
				toast.success("Created new chat");
			})
			.catch(() => {
				toast.error("Failed to create new chat", { position: "top-left" });
			})
			.finally();
	};

	// Chats loading
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {}</div>;
	}

	return (
		<div>
			<Button onClick={handleOpen}>Add Chat</Button>
			<Modal open={open} onClose={handleClose}>
				<FormControl
					onSubmit={handleNewChat}
					component="form"
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						width: 400,
						transform: "translate(-50%,-50%)",
						bgcolor: "background.paper",
						display: "flex",
						flexDirection: "column",
						boxShadow: 24,
						padding: 3,
					}}
				>
					<Typography id="modal-title" variant="h6" component={"h2"}>
						Create a new chat
					</Typography>
					<TextField
						label="Name"
						name="name"
						value={input.name}
						onChange={handleChange}
					/>
					<Button variant="contained" type="submit">
						Create
					</Button>
				</FormControl>
			</Modal>
			{chats.map((chat) => {
				return (
					<NavLink to={`/organisations/chats/${chat.id}`}>{chat.name}</NavLink>
				);
			})}
		</div>
	);
}

const getChats = async () => {
	const { organisation } = useOrgStore.getState();
	try {
		const result = await API.get(
			`/api/organisations/${organisation?.id}/chats`
		);
		return result.data.chats;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		toast.error(`Failed to get chats error message: ${error?.message}`, {
			position: "top-left",
		});
	}
};
