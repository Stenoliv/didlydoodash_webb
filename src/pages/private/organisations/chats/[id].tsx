import MessageItem from "@/components/chats/Message";
import { useAuthStore } from "@/stores/auth/store";
import { useOrgStore } from "@/stores/organisation";
import { WSChatMessage, WSMessage } from "@/utils/types";
import { Button, FormControl, TextField } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";

function ChatPage() {
	const { id } = useParams();
	const { organisation } = useOrgStore();
	const { tokens } = useAuthStore();
	const { user } = useAuthStore();

	const WS_URL = `ws://localhost:3000/organisations/${organisation?.id}/chats/${id}?token=${tokens?.access}`;

	const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
		onOpen: () => {
			console.log("Websocket connection established");
		},
		onClose: () => {
			console.log("Connection closed");
		},
		onMessage: (data) => {
			console.log("Message: " + data.data);
		},
	});

	const [messageHistory, setMessageHistory] = useState<WSChatMessage[]>([]);
	const [input, setInput] = useState({
		message: "",
	});

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	useEffect(() => {
		if (lastMessage !== null) {
			try {
				// Parse the message and cast it as WSMessage
				const parsedData: WSMessage = JSON.parse(lastMessage.data);

				// Check if the message type is 'message.send' and if it belongs to the current room
				if (parsedData.type === "message.send" && parsedData.roomId === id) {
					setMessageHistory((prev) => [...prev, parsedData]);
				}
			} catch (error) {
				console.error("Failed to parse WebSocket message:", error);
			}
		}
	}, [lastMessage, id]);

	const handleSendMessage = useCallback(
		() =>
			sendJsonMessage<WSChatMessage>({
				type: "message.send",
				roomId: id ? id : "",
				payload: {
					userId: user ? user?.id : "",
					message: input.message,
				},
			}),
		[id, user, sendJsonMessage, input.message]
	);

	return (
		<div>
			<div>
				Messages:
				<ul
					style={{
						display: "flex",
						flexDirection: "column",
						position: "relative",
						width: "100%",
						height: "100%",
					}}
				>
					{messageHistory.map((message, idx) => (
						<MessageItem data={message} key={idx} />
					))}
				</ul>
			</div>
			<div>
				<FormControl>
					<TextField
						label="New message"
						name="message"
						value={input.message}
						onChange={handleInput}
					/>
					<Button
						onClick={handleSendMessage}
						disabled={readyState !== ReadyState.OPEN}
					>
						Send
					</Button>
				</FormControl>
			</div>
		</div>
	);
}

export default ChatPage;
