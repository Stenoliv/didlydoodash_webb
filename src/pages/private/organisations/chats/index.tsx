import Chats from "@/components/chats/chats/Chats";
import Details from "@/components/chats/details/Details";
import List from "@/components/chats/lists/List";
import { useAuthStore } from "@/stores/auth/store";
import { useOrgStore } from "@/stores/organisation";
import { useChatStore } from "@/stores/organisation/chats";
import { API } from "@/utils/api";
import { Chat } from "@/utils/types";
import { ChangeEvent, FormEvent, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

export default function ChatsPage() {
	const { organisation } = useOrgStore();
	const { addChat, setChats } = useChatStore();
	const { user } = useAuthStore(); // TODO: Remove temp and implement member selection form
	const {} = useQuery<Chat[], Error>("chats", getChats, {
		onSuccess: (data) => {
			setChats(data);
		},
	});

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

	return (
		<div style={{ flex: 1, display: "flex", flexBasis: "auto" }}>
			<List />
			<Chats />
			<Details />
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
