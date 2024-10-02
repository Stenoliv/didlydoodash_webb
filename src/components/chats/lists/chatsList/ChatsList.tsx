import { useState } from "react";
import "./chatslist.css";
import AddChat from "./addChat/AddChat";
import { useChatStore } from "@/stores/organisation/chats";
import { useQuery } from "react-query";
import { Chat } from "@/utils/types";
import { useOrgStore } from "@/stores/organisation";
import { toast } from "react-toastify";
import { API } from "@/utils/api";
import { Tooltip } from "@mui/material";

export default function ChatsList() {
	const [addMore, setAddMore] = useState<boolean>(false);
	const [input, SetInput] = useState<string>("");
	const { chats, setChats, chatId, selectChat } = useChatStore();
	const { organisation } = useOrgStore();

	// Fetch chats
	const { isLoading, isError, error } = useQuery<Chat[], Error>(
		["chats", organisation],
		getChats,
		{
			onSuccess: (data) => {
				setChats(data);
				if (!data.find((chat) => chat.id === chatId)) {
					selectChat(data[0].id || null);
				}
			},
		}
	);

	const handleSelect = async (chat: Chat) => {
		const foundChat = chats.find((item) => item.id === chat.id);

		if (foundChat) {
			selectChat(foundChat.id);
		}
	};

	const handleAddMore = () => {
		setAddMore(true);
	};

	const filteredChats = chats.filter((c) =>
		c.name.toLowerCase().includes(input.toLowerCase())
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div className="chatList">
			<div className="search">
				<div className="searchBar">
					<img src="/icons/search.svg" alt="" />
					<input
						type="text"
						placeholder="Search"
						value={input}
						onChange={(e) => SetInput(e.target.value)}
					/>
				</div>
				<Tooltip title="Add new chat">
					<img
						src="/icons/plus.svg"
						alt=""
						className="add"
						onClick={handleAddMore}
					/>
				</Tooltip>
			</div>
			{filteredChats.map((chat) => (
				<Tooltip title="Open chat" placement="bottom-start">
					<div
						className="item"
						key={chat.id}
						style={{}}
						onClick={() => handleSelect(chat)}
					>
						<img src="/icons/avatars/avatar-boy.svg" alt="" />
						<div className="texts">
							<span>{chat.name}</span>
							{/* <p>{chat.lastMessage}</p> */}
						</div>
					</div>
				</Tooltip>
			))}
			{addMore && <AddChat open={addMore} setOpen={setAddMore} />}
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
