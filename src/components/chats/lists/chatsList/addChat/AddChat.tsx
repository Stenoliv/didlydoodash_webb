import { API } from "@/utils/api";
import "./addchat.css";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useOrgStore } from "@/stores/organisation";
import { useChatStore } from "@/stores/organisation/chats";
import { useAuthStore } from "@/stores/auth/store";
import { Modal } from "@mui/material";

export interface AddChatProps {
	open: boolean;
	setOpen: (val: boolean) => void;
}

export default function AddChat(props: AddChatProps) {
	const { open, setOpen } = props;

	const { organisation } = useOrgStore();
	const { addChat } = useChatStore();
	const { user } = useAuthStore();

	const [input, setInput] = useState({
		name: "",
		members: [{ id: user?.id }],
	});

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAddChat = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		return API.post(`/api/organisations/${organisation?.id}/chats`, {
			...input,
		})
			.then((response) => {
				const chat = response.data.chat;
				addChat(chat);
				setOpen(false);
				toast.success(`Created new chat: ${chat.name}`);
			})
			.catch((error) => {
				toast.error("Failed to create chat: " + error.response.data.message, {
					position: "top-left",
				});
			})
			.finally();
	};

	return (
		<Modal open={open} onClose={() => setOpen(false)} className="addUser">
			<form onSubmit={handleAddChat}>
				<input
					type="text"
					placeholder="Name"
					name="name"
					value={input.name}
					onChange={handleInput}
				/>
				<button>Add</button>
			</form>
		</Modal>
	);
}
