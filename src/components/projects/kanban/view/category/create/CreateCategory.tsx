import { NewKanbanCategory, WSType } from "@/utils/types";
import "./createcategory.css";

export interface CreateCategoryProps {
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function CreateCategory(props: CreateCategoryProps) {
	const { sendMessage } = props;

	const handleClick = () => {
		sendMessage(NewKanbanCategory, { name: "Not named" });
	};

	return (
		<div className="add-category-texts">
			<img
				className="add-category-icon"
				src="/icons/plus.svg"
				onClick={handleClick}
			/>
			<span>New category</span>
		</div>
	);
}
