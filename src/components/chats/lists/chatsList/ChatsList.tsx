import { useState } from "react";
import "./chatslist.css";
import AddUser from "./addUser/AddUser";
import { useChatStore } from "@/stores/organisation/chats";

export default function ChatsList() {
	const [addMore, setAddMore] = useState<boolean>(false);
	const [input, SetInput] = useState<string>("");
	const { chats } = useChatStore();

	const filteredChats = chats.filter((c) =>
		c.name.toLowerCase().includes(input.toLowerCase())
	);

	return (
		<div className="chatList">
			<div className="search">
				<div className="searchBar">
					<img src="/icons/search.svg" alt="" />
					<input type="text" placeholder="Search" />
				</div>
				<img src="/icons/plus.svg" alt="" className="add" />
			</div>
			{filteredChats.map((chat) => (
				<div className="item" key={chat.id} style={{}}>
					<img src="/icons/avatars/avatar-boy.svg" alt="" />
					<div className="texts">
						<span>{chat.name}</span>
						{/* <p>{chat.lastMessage}</p> */}
					</div>
				</div>
			))}
			{addMore && <AddUser />}
		</div>
	);
}
