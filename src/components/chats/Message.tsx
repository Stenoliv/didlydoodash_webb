import { useChatStore } from "@/stores/organisation/chats";
import { WSChatMessage } from "@/utils/types";

export interface MessageProps {
	data: WSChatMessage;
}

export default function MessageItem(props: MessageProps) {
	const { data } = props;
	const { payload } = data;
	const { openChat } = useChatStore()
	const { userId, message, createdAt, updatedAt } = payload;

	console.log(openChat)

	const username = openChat?.members.find(((member) => member.member.id == userId))

	return (
		<div>
			Username: {username?.member.username}
			<p>{message}</p>
			<p>{createdAt && new Date(createdAt).toLocaleString()}</p>
			<p>{updatedAt && new Date(updatedAt).toLocaleString()}</p>
		</div>
	);
}
