import { WSChatMessage } from "@/utils/types";

export interface MessageProps {
	data: WSChatMessage;
}

export default function MessageItem(props: MessageProps) {
	const { data } = props;
	const { payload } = data;
	const { userId, message, createdAt, updatedAt } = payload;

	return (
		<div>
			{userId}
			<p>{message}</p>
			<p>{createdAt && new Date(createdAt).toLocaleString()}</p>
			<p>{updatedAt && new Date(updatedAt).toLocaleString()}</p>
		</div>
	);
}
