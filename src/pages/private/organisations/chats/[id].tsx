import { useAuthStore } from "@/stores/auth/store";
import { useOrgStore } from "@/stores/organisation";
import { WSMessage } from "@/utils/types";
import { Button, FormControl, TextField } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";

function ChatPage() {
	const { id } = useParams();
	const { organisation } = useOrgStore();
	const { tokens } = useAuthStore();

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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [messageHistory, setMessageHistory] = useState<WSMessage[]>([]);
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
			sendJsonMessage({
				type: "message.send",
				payload: input.message,
				roomId: id,
			}),
		[id, sendJsonMessage, input.message]
	);

	return (
		<div>
			<div>
				Messages:
				<ul style={{ display: "flex", flexDirection: "column" }}>
					{messageHistory.map((message, idx) => (
						<span key={idx}>{message ? message.payload : null}</span>
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
