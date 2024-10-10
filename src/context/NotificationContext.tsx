import { useAuthStore } from "@/stores/auth/store";
import { useOrgStore } from "@/stores/organisation";
import { ChatNotification } from "@/utils/types";
import {
	useContext,
	createContext,
	ReactNode,
	useState,
	useCallback,
} from "react";
import { toast } from "react-toastify";
import useWebSocket from "react-use-websocket";

export type NotificationContextType = {
	badges: Map<string, number>;
	resetBadge: (chatId: string) => void;
};

const NotificationContext = createContext<NotificationContextType>(
	{} as NotificationContextType
);

export type NotificationProviderProps = {
	children: ReactNode;
};

const NotificationProvider = ({ children }: NotificationProviderProps) => {
	const { tokens } = useAuthStore();
	const { organisation } = useOrgStore();
	const [badges, setBadges] = useState<Map<string, number>>(new Map());

	const WS_URL = `ws://localhost:3000/organisations/${organisation?.id}/chats/notifications?token=${tokens?.access}`;

	useWebSocket(WS_URL, {
		onMessage: (data) => {
			try {
				const parsedData: ChatNotification = JSON.parse(data.data);
				switch (parsedData.type) {
					case "message.count": {
						const { chatId, unreadMessages } = parsedData.payload;
						setBadges((prevBadges) => {
							const updatedBadges = new Map(prevBadges);
							updatedBadges.set(chatId, unreadMessages);
							return updatedBadges;
						});
						break;
					}
					case "message.new": {
						const { chatId } = parsedData.payload;
						setBadges((prevBadges) => {
							const updatedBadges = new Map(prevBadges);
							const current = updatedBadges.get(chatId) || 0;
							updatedBadges.set(chatId, current + 1);
							return updatedBadges;
						});
						break;
					}
					default:
						break;
				}
			} catch (error) {
				toast.error(`Error when loading notification: ${error}`, {
					position: "top-left",
				});
			}
		},
		reconnectAttempts: 5,
	});

	// Reset the badge count for a specific chat
	const resetBadge = useCallback((chatId: string) => {
		setBadges((prevBadges) => {
			const updatedBadges = new Map(prevBadges);
			updatedBadges.set(chatId, 0); // Reset the badge for this chat
			return updatedBadges;
		});
	}, []);

	// Provide the badge and resetBadge method to the context consumers
	const contextValue: NotificationContextType = {
		badges,
		resetBadge,
	};

	return (
		<NotificationContext.Provider value={contextValue}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export default NotificationProvider;
