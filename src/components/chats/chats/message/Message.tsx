import { WSChatMessage } from "@/utils/types";
import "./message.css";
import { useAuthStore } from "@/stores/auth/store";
import { Tooltip } from "@mui/material";
import { useChatStore } from "@/stores/organisation/chats";
import { memo } from "react";

export interface MessageProps {
	message: WSChatMessage;
}

function MessageItem(props: MessageProps) {
	const { message } = props;
	const { user } = useAuthStore();
	const { chats, openChatId } = useChatStore();
	const own = user?.id == message.userId ? "own" : "";

	const currentChat = chats.find((chat) => chat.id === openChatId);

	return (
		<Tooltip
			title={
				currentChat?.members.find(
					(member) => member.member.id === message.userId
				)?.member.username
			}
			placement="bottom-start"
		>
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
		</Tooltip>
	);
}

export default memo(MessageItem);
