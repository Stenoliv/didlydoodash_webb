import Chats from "@/components/chats/chats/Chats";
import List from "@/components/chats/lists/List";
import { useChatStore } from "@/stores/organisation/chats";

export default function ChatsPage() {
	const { chatId } = useChatStore();

	return (
		<div
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				display: "inline-flex",
				overflow: "hidden",
				maxHeight: "100%",
			}}
		>
			<List />
			{chatId && <Chats />}
		</div>
	);
}
