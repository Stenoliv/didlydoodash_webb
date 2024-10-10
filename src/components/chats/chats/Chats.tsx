import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import "./chats.css";
import { useAuthStore } from "@/stores/auth/store";
import { useChatStore } from "@/stores/organisation/chats";
import { Tooltip } from "@mui/material";
import useWebSocket from "react-use-websocket";
import { useOrgStore } from "@/stores/organisation";
import { toast } from "react-toastify";
import MessageItem from "./message/Message";
import {
	MessageAll,
	MessageError,
	MessageRead,
	MessageSend,
	User,
	WSChatMessage,
	WSInputMessage,
	WSInputMessageRead,
	WSMessage,
} from "@/utils/types";
import AddUser from "./addUser/AddUser";
import { API } from "@/utils/api";

export default function Chats() {
	const { chats, openChatId, selectChat, removeMember } = useChatStore();
	const { user, tokens } = useAuthStore();
	const { organisation } = useOrgStore();

	const endRef = useRef<HTMLDivElement>(null);
	const openChat = chats.find((chat) => chat.id === openChatId);

	const [openAddUser, setOpenAddUser] = useState(false);
	const [text, setText] = useState("");

	const [messages, setMessages] = useState<WSChatMessage[]>([]);

	// Handlers
	const handleAddUser = () => {
		setOpenAddUser(true);
	};

	const handleRemoveUser = (user: User) => {
		return API.delete(
			`/api/organisations/${organisation?.id}/chats/${openChatId}/member/${user.id}`
		)
			.then((response) => {
				toast.success(`User ${user.username} removed!`);
				if (openChatId) removeMember(openChatId, response.data.member);
			})
			.catch(() => {
				toast.error(`Failed to remove ${user.username}`, {
					position: "top-left",
				});
			});
	};

	const handleCloseChat = () => {
		selectChat(null);
	};

	// Websocket connection
	const WS_URL = `ws://localhost:3000/organisations/${organisation?.id}/chats/${openChatId}?token=${tokens?.access}`;
	const { sendJsonMessage, lastJsonMessage } = useWebSocket<WSMessage>(WS_URL, {
		reconnectAttempts: 5,
		onReconnectStop: (attempts) => {
			toast.error(`Failed to reconnect to websocket: ${attempts}`, {
				position: "top-left",
			});
		},
	});

	// Send message callback
	const handleSend = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (text === "") return;

			sendJsonMessage<WSInputMessage>({
				type: "message.send",
				roomId: openChatId || "",
				payload: {
					id: user?.id || "",
					message: text,
				},
			});
			setText("");
		},
		[sendJsonMessage, text, openChatId, user]
	);

	// Update last read message
	useEffect(() => {
		if (messages.length > 0) {
			const lastMessage = messages[messages.length - 1];

			sendJsonMessage<WSInputMessageRead>({
				type: MessageRead,
				roomId: openChatId || "",
				payload: {
					messageId: lastMessage.id,
				},
			});
		}
	}, [messages, openChatId, user, sendJsonMessage]);

	useEffect(() => {
		if (!lastJsonMessage || !lastJsonMessage.type || !openChatId) return;
		try {
			// Check if the message type is 'message.send' and if it belongs to the current room
			if (
				lastJsonMessage.type === MessageSend &&
				lastJsonMessage.roomId === openChatId
			) {
				setMessages((prev) => [...prev, lastJsonMessage.payload]);
			}
			// If type === message.all
			else if (
				lastJsonMessage.type === MessageAll &&
				lastJsonMessage.roomId === openChatId
			) {
				setMessages(lastJsonMessage.payload);
			}
			// If type === message.error
			else if (lastJsonMessage.type === MessageError) {
				toast.error("Error: " + lastJsonMessage.payload.message, {
					position: "top-left",
				});
			}
		} catch (error) {
			toast.error("Failed to parse WebSocket message: " + error, {
				position: "top-left",
			});
		}
	}, [lastJsonMessage, openChatId]);

	useEffect(() => {
		if (lastJsonMessage && lastJsonMessage.type === MessageAll) {
			endRef.current?.scrollIntoView({ behavior: "instant" });
		}
		if (lastJsonMessage && lastJsonMessage.type === MessageSend)
			endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, lastJsonMessage]);

	return (
		<div className="chat">
			<div className="top">
				<div className="user">
					<img src={user?.avatar || "/icons/avatars/avatar-girl2.svg"} alt="" />
					<div className="texts">
						<h2>{openChat?.name}</h2>
						<p style={{ display: "flex", gap: "15px", alignItems: "center" }}>
							Members:
							{openChat?.members.map((member) => (
								<Tooltip key={member.id} title={`Remove user`}>
									<span onClick={() => handleRemoveUser(member.member)}>
										{member.member.username}
									</span>
								</Tooltip>
							))}
						</p>
					</div>
				</div>
				<div className="icons">
					<Tooltip title="Add user to chat" placement="top-start">
						<img src="/icons/plus.svg" alt="" onClick={handleAddUser} />
					</Tooltip>
					<Tooltip title="Close chat" placement="top-start">
						<img src="/icons/close.svg" alt="" onClick={handleCloseChat} />
					</Tooltip>
					<AddUser open={openAddUser} setOpen={setOpenAddUser} />
				</div>
			</div>
			<div className="center">
				{messages.map((message) => {
					return <MessageItem key={message.id} message={message} />;
				})}
				<div id="bottom" ref={endRef}></div>
			</div>
			<form className="bottom" onSubmit={handleSend}>
				<input
					type="text"
					placeholder="Type a message..."
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<button className="sendButton" type="submit" disabled={false}>
					Send
				</button>
			</form>
		</div>
	);
}
