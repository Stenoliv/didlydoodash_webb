import { WSChatMessage } from "@/utils/types";
import "./message.css";
import { useChatStore } from "@/stores/organisation/chats";
import { memo } from "react";
import { useAuth } from "@/context/AuthContext";

export interface MessageProps {
	message: WSChatMessage;
}

function MessageItem(props: MessageProps) {
	const { message } = props;
	const { user } = useAuth();
	const { chats, openChatId } = useChatStore();
	const own = user?.id == message.userId ? "own" : "";

	const currentChat = chats.find((chat) => chat.id === openChatId);

	return (
		<div className={`message ${own}`}>
			<img src="/icons/avatars/avatar-boy.svg" alt="" />
			<div className={`texts ${own}`}>
				<p>{message.message}</p>
				<span>
					{message.createdAt &&
						currentChat?.members.find(
							(member) => member.member.id === message.userId
						)?.member.username +
							" sent: " +
							new Date(message.createdAt).toLocaleString()}
				</span>
			</div>
		</div>
	);
}

export default memo(MessageItem);
