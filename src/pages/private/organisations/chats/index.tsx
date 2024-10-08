import Chats from "@/components/chats/chats/Chats";
import List from "@/components/chats/lists/List";
import { useAuthStore } from "@/stores/auth/store";
import { useChatStore } from "@/stores/organisation/chats";
import { useEffect, useState } from "react";

export default function ChatsPage() {
	const { chatId, chats } = useChatStore();
	const { tokens } = useAuthStore();
	const [notifications, setNotifications] = useState<string[]>([]);

	useEffect(() => {
		// Create a new EventSource instance for the notifications
		const eventSource = new EventSource(
			`http://localhost:3000/organisations/notifications/${chatId}?token=${tokens?.access}`
		);

		// Define the event listener for incoming messages
		eventSource.onmessage = (event) => {
			console.log("Event data: " + event.data);
			setNotifications((prevNotifications) => [
				...prevNotifications,
				event.data, // event.data contains the notification message
			]);
		};

		// Handle any errors
		eventSource.onerror = (error) => {
			console.error("EventSource failed:", error);
			eventSource.close(); // Close the connection on error
		};

		// Cleanup function to close the EventSource connection
		return () => {
			eventSource.close();
		};
	}, [chatId, tokens]);

	return (
		<div
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				display: "flex",
			}}
		>
			<List />
			{chats && chatId && chats.length > 0 && <Chats />}
			<div
				style={{
					position: "absolute",
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: -1,
				}}
			>
				<ul>
					{notifications.map((notification, index) => (
						<li key={index}>{notification}</li>
					))}
				</ul>
			</div>
		</div>
	);
}
