import { MessageAll, WSType } from "@/utils/types";
import "./createitem.css";

export interface CreateItemProps {
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function CreateItem(props: CreateItemProps) {
	const { sendMessage } = props;

	return (
		<>
			<button onClick={() => sendMessage(MessageAll, "test")}>New Item</button>
		</>
	);
}
