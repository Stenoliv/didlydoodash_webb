import { useOrgStore } from "@/stores/organisation";
import { useChatStore } from "@/stores/organisation/chats";
import { API } from "@/utils/api";
import { Chat } from "@/utils/types";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

export default function ChatsPage() {
	const { chats, setChats } = useChatStore();
	const { isLoading, error } = useQuery<Chat[], Error>("chats", getChats, {
		onSuccess: (data) => {
			console.log(data);
			setChats(data);
		},
	});

	const [open, setOpen] = useState<boolean>(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// Chats loading
	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error != null) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div>
			<Button onClick={handleOpen}>Add Chat</Button>
			<Modal open={open} onClose={handleClose}>
				<Box sx={style}>
					<Typography id="modal-title" variant="h6" component={"h2"}>
						Create a new chat
					</Typography>
				</Box>
			</Modal>
			{chats.map((chat) => {
				return <div>{chat.name}</div>;
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

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%,-50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};
